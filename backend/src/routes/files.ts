import { Router, Request, Response } from 'express';
import { File } from '../models/File';
import { User } from '../models/User';
import { requireAuth } from '../middleware/auth';
import { validateFileSize } from '../middleware/fileValidation';
import { fileRateLimiter } from '../config/rateLimiter';
import { generateUploadUrl, generateDownloadUrl, generateViewUrl, deleteFile as deleteS3File } from '../services/s3Service';
import { checkFileAccess, getAccessibleFiles, getTrashFiles, getStarredFiles } from '../services/fileService';
import { createError } from '../middleware/errorHandler';
import { calculateUserStorageUsed } from '../utils/helpers';
import { IUser } from '../types';

const router = Router();

router.post(
  '/upload-url',
  requireAuth,
  fileRateLimiter,
  validateFileSize,
  async (req: Request, res: Response) => {
    const { originalName, size } = req.body;

    if (!originalName || typeof originalName !== 'string') {
      throw createError('originalName is required and must be a string', 400);
    }

    if (!req.user) {
      throw createError('Authentication required', 401);
    }

    try {
      const user = req.user as IUser;
      const storageUsed = await calculateUserStorageUsed(user);
      const storageLimit = user.storageLimit || 100 * 1024 * 1024;

      if (storageUsed + size > storageLimit) {
        const availableSpace = storageLimit - storageUsed;
        throw createError(
          `Storage limit exceeded. Available space: ${(availableSpace / (1024 * 1024)).toFixed(2)}MB, Required: ${(size / (1024 * 1024)).toFixed(2)}MB`,
          413
        );
      }

      const { uploadUrl, fields, storageName, url } = await generateUploadUrl(originalName, size);

      res.json({
        success: true,
        uploadUrl,
        fields,
        storageName,
        url,
        maxSize: 100 * 1024 * 1024,
      });
    } catch (error: any) {
      if (error.statusCode) {
        throw error;
      }
      throw createError(error.message || 'Failed to generate upload URL', 500);
    }
  }
);

router.post(
  '/confirm-upload',
  requireAuth,
  fileRateLimiter,
  async (req: Request, res: Response) => {
    const { originalName, storageName, url, size } = req.body;

    if (!originalName || !storageName || !url || !size) {
      throw createError('Missing required fields: originalName, storageName, url, size', 400);
    }

    try {
      if (!req.user) {
        throw createError('Authentication required', 401);
      }
      const user = req.user as IUser;
      const file = await File.create({
        owner: user._id,
        originalName,
        storageName,
        url,
        size,
        public: false,
        permissions: [],
      });

      res.status(201).json({
        success: true,
        file: {
          _id: file._id,
          originalName: file.originalName,
          storageName: file.storageName,
          url: file.url,
          size: file.size,
          public: file.public,
          createdAt: file.createdAt,
        },
      });
    } catch (error: any) {
      throw createError(error.message || 'Failed to create file record', 500);
    }
  }
);

router.get(
  '/',
  requireAuth,
  fileRateLimiter,
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw createError('Authentication required', 401);
    }
    const searchQuery = req.query.search as string | undefined;

    try {
      const user = req.user as IUser;
      const files = await getAccessibleFiles(user, searchQuery);

      const populatedFiles = await Promise.all(
        files.map(async (file) => {
          const populatedPermissions = await Promise.all(
            file.permissions.map(async (perm: any) => {
              const user = await User.findById(perm.userId).select('name email');
              return {
                userId: user ? { _id: user._id, name: user.name, email: user.email } : perm.userId,
                level: perm.level,
              };
            })
          );

          return {
            _id: file._id,
            originalName: file.originalName,
            size: file.size,
            public: file.public,
            owner: file.owner,
            permissions: populatedPermissions,
            starredBy: file.starredBy,
            createdAt: file.createdAt,
            updatedAt: file.updatedAt,
          };
        })
      );

      res.json({
        success: true,
        files: populatedFiles,
      });
    } catch (error: any) {
      throw createError(error.message || 'Failed to fetch files', 500);
    }
  }
);

router.put(
  '/:id',
  requireAuth,
  fileRateLimiter,
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw createError('Authentication required', 401);
    }
    const { id } = req.params;
    const { originalName } = req.body;

    if (!originalName || typeof originalName !== 'string') {
      throw createError('originalName is required and must be a string', 400);
    }

    try {
      const user = req.user as IUser;
      const file = await checkFileAccess(id, user, 'write');

      file.originalName = originalName;
      await file.save();

      res.json({
        success: true,
        file: {
          _id: file._id,
          originalName: file.originalName,
          size: file.size,
          public: file.public,
          createdAt: file.createdAt,
          updatedAt: file.updatedAt,
        },
      });
    } catch (error: any) {
      if (error.statusCode) {
        throw error;
      }
      throw createError(error.message || 'Failed to update file', 500);
    }
  }
);

router.delete(
  '/:id',
  requireAuth,
  fileRateLimiter,
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw createError('Authentication required', 401);
    }
    const { id } = req.params;

    try {
      const user = req.user as IUser;
      const file = await checkFileAccess(id, user, 'write');

      file.deleted = true;
      file.deletedAt = new Date();
      await file.save();

      res.json({
        success: true,
        message: 'File moved to trash successfully',
      });
    } catch (error: any) {
      if (error.statusCode) {
        throw error;
      }
      throw createError(error.message || 'Failed to delete file', 500);
    }
  }
);

router.post(
  '/:id/share',
  requireAuth,
  fileRateLimiter,
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw createError('Authentication required', 401);
    }
    const { id } = req.params;
    const { userId, level } = req.body;

    if (!userId || !level) {
      throw createError('userId and level are required', 400);
    }

    if (level !== 'read' && level !== 'write') {
      throw createError('level must be either "read" or "write"', 400);
    }

    try {
      const currentUser = req.user as IUser;
      const file = await checkFileAccess(id, currentUser, 'write');

      const targetUser = await User.findById(userId);
      if (!targetUser) {
        throw createError('User not found', 404);
      }

      const existingPermissionIndex = file.permissions.findIndex(
        (perm: { userId: any; level: string }) => perm.userId.toString() === userId
      );

      if (existingPermissionIndex >= 0) {
        file.permissions[existingPermissionIndex].level = level;
      } else {
        file.permissions.push({ userId: targetUser._id, level });
      }

      await file.save();

      res.json({
        success: true,
        file: {
          _id: file._id,
          originalName: file.originalName,
          permissions: file.permissions,
        },
      });
    } catch (error: any) {
      if (error.statusCode) {
        throw error;
      }
      throw createError(error.message || 'Failed to share file', 500);
    }
  }
);

router.post(
  '/:id/public',
  requireAuth,
  fileRateLimiter,
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw createError('Authentication required', 401);
    }
    const { id } = req.params;

    try {
      const user = req.user as IUser;
      await checkFileAccess(id, user, 'write');

      const updatedFile = await File.findByIdAndUpdate(
        id,
        { public: true },
        { new: true }
      );

      if (!updatedFile) {
        throw createError('File not found', 404);
      }

      res.json({
        success: true,
        file: {
          _id: updatedFile._id,
          originalName: updatedFile.originalName,
          public: updatedFile.public,
        },
      });
    } catch (error: any) {
      if (error.statusCode) {
        throw error;
      }
      throw createError(error.message || 'Failed to make file public', 500);
    }
  }
);

router.post(
  '/:id/private',
  requireAuth,
  fileRateLimiter,
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw createError('Authentication required', 401);
    }
    const { id } = req.params;

    try {
      const user = req.user as IUser;
      await checkFileAccess(id, user, 'write');

      const updatedFile = await File.findByIdAndUpdate(
        id,
        { public: false },
        { new: true }
      );

      if (!updatedFile) {
        throw createError('File not found', 404);
      }

      res.json({
        success: true,
        file: {
          _id: updatedFile._id,
          originalName: updatedFile.originalName,
          public: updatedFile.public,
        },
      });
    } catch (error: any) {
      if (error.statusCode) {
        throw error;
      }
      throw createError(error.message || 'Failed to make file private', 500);
    }
  }
);

router.get(
  '/:id/download',
  fileRateLimiter,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const user = req.user as IUser | undefined;
      const file = await checkFileAccess(id, user, 'read');

      const downloadUrl = await generateDownloadUrl(file.storageName);

      res.json({
        success: true,
        downloadUrl,
        expiresIn: 15 * 60,
      });
    } catch (error: any) {
      if (error.statusCode) {
        throw error;
      }
      throw createError(error.message || 'Failed to generate download URL', 500);
    }
  }
);

router.get(
  '/:id/view',
  fileRateLimiter,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const user = req.user as IUser | undefined;
      const file = await checkFileAccess(id, user, 'read');

      const viewUrl = await generateViewUrl(file.storageName, file.originalName);

      res.json({
        success: true,
        viewUrl,
        expiresIn: 15 * 60,
      });
    } catch (error: any) {
      if (error.statusCode) {
        throw error;
      }
      throw createError(error.message || 'Failed to generate view URL', 500);
    }
  }
);

router.get(
  '/trash',
  requireAuth,
  fileRateLimiter,
  async (req: Request, res: Response) => {

    try {
      const user = req.user as IUser;
      const files = await getTrashFiles(user);

      const populatedFiles = await Promise.all(
        files.map(async (file) => {
          const populatedPermissions = await Promise.all(
            file.permissions.map(async (perm: any) => {
              const user = await User.findById(perm.userId).select('name email');
              return {
                userId: user ? { _id: user._id, name: user.name, email: user.email } : perm.userId,
                level: perm.level,
              };
            })
          );

          return {
            _id: file._id,
            originalName: file.originalName,
            size: file.size,
            public: file.public,
            owner: file.owner,
            permissions: populatedPermissions,
            starredBy: file.starredBy,
            deleted: file.deleted,
            deletedAt: file.deletedAt,
            createdAt: file.createdAt,
            updatedAt: file.updatedAt,
          };
        })
      );

      res.json({
        success: true,
        files: populatedFiles,
      });
    } catch (error: any) {
      throw createError(error.message || 'Failed to fetch trash files', 500);
    }
  }
);

router.post(
  '/:id/restore',
  requireAuth,
  fileRateLimiter,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const user = req.user as IUser;
      const file = await File.findById(id);

      if (!file) {
        throw createError('File not found', 404);
      }

      const userId = user._id.toString();
      const ownerId = file.owner.toString();

      if (ownerId !== userId) {
        throw createError('Access denied', 403);
      }

      if (!file.deleted) {
        throw createError('File is not in trash', 400);
      }

      file.deleted = false;
      file.deletedAt = null;
      await file.save();

      res.json({
        success: true,
        file: {
          _id: file._id,
          originalName: file.originalName,
          deleted: file.deleted,
        },
      });
    } catch (error: any) {
      if (error.statusCode) {
        throw error;
      }
      throw createError(error.message || 'Failed to restore file', 500);
    }
  }
);

router.delete(
  '/:id/permanent',
  requireAuth,
  fileRateLimiter,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const user = req.user as IUser;
      const file = await File.findById(id);

      if (!file) {
        throw createError('File not found', 404);
      }

      const userId = user._id.toString();
      const ownerId = file.owner.toString();

      if (ownerId !== userId) {
        throw createError('Access denied', 403);
      }

      if (!file.deleted) {
        throw createError('File must be in trash before permanent deletion', 400);
      }

      await deleteS3File(file.storageName);
      await File.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'File permanently deleted',
      });
    } catch (error: any) {
      if (error.statusCode) {
        throw error;
      }
      throw createError(error.message || 'Failed to permanently delete file', 500);
    }
  }
);

router.post(
  '/:id/share-email',
  requireAuth,
  fileRateLimiter,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { email, level } = req.body;

    if (!email || !level) {
      throw createError('email and level are required', 400);
    }

    if (level !== 'read' && level !== 'write') {
      throw createError('level must be either "read" or "write"', 400);
    }

    try {
      const currentUser = req.user as IUser;
      const file = await checkFileAccess(id, currentUser, 'write');

      const targetUser = await User.findOne({ email: email.toLowerCase().trim() });
      if (!targetUser) {
        throw createError('User not found with this email address', 404);
      }

      if (targetUser._id.toString() === currentUser._id.toString()) {
        throw createError('Cannot share file with yourself', 400);
      }

      const existingPermissionIndex = file.permissions.findIndex(
        (perm: { userId: any; level: string }) => perm.userId.toString() === targetUser._id.toString()
      );

      if (existingPermissionIndex >= 0) {
        file.permissions[existingPermissionIndex].level = level;
      } else {
        file.permissions.push({ userId: targetUser._id, level });
      }

      await file.save();

      res.json({
        success: true,
        file: {
          _id: file._id,
          originalName: file.originalName,
          permissions: file.permissions,
        },
      });
    } catch (error: any) {
      if (error.statusCode) {
        throw error;
      }
      throw createError(error.message || 'Failed to share file', 500);
    }
  }
);

router.post(
  '/:id/star',
  requireAuth,
  fileRateLimiter,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const user = req.user as IUser;
      const file = await checkFileAccess(id, user, 'read');

      const userId = user._id;
      const isStarred = file.starredBy.some(
        (starredUserId) => starredUserId.toString() === userId.toString()
      );

      if (!isStarred) {
        file.starredBy.push(userId);
        await file.save();
      }

      res.json({
        success: true,
        file: {
          _id: file._id,
          originalName: file.originalName,
          starredBy: file.starredBy,
        },
      });
    } catch (error: any) {
      if (error.statusCode) {
        throw error;
      }
      throw createError(error.message || 'Failed to star file', 500);
    }
  }
);

router.delete(
  '/:id/star',
  requireAuth,
  fileRateLimiter,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const user = req.user as IUser;
      const file = await checkFileAccess(id, user, 'read');

      const userId = user._id;
      file.starredBy = file.starredBy.filter(
        (starredUserId) => starredUserId.toString() !== userId.toString()
      );
      await file.save();

      res.json({
        success: true,
        file: {
          _id: file._id,
          originalName: file.originalName,
          starredBy: file.starredBy,
        },
      });
    } catch (error: any) {
      if (error.statusCode) {
        throw error;
      }
      throw createError(error.message || 'Failed to unstar file', 500);
    }
  }
);

router.get(
  '/starred',
  requireAuth,
  fileRateLimiter,
  async (req: Request, res: Response) => {
    const searchQuery = req.query.search as string | undefined;

    try {
      const user = req.user as IUser;
      const files = await getStarredFiles(user, searchQuery);

      const populatedFiles = await Promise.all(
        files.map(async (file) => {
          const populatedPermissions = await Promise.all(
            file.permissions.map(async (perm: any) => {
              const user = await User.findById(perm.userId).select('name email');
              return {
                userId: user ? { _id: user._id, name: user.name, email: user.email } : perm.userId,
                level: perm.level,
              };
            })
          );

          return {
            _id: file._id,
            originalName: file.originalName,
            size: file.size,
            public: file.public,
            owner: file.owner,
            permissions: populatedPermissions,
            starredBy: file.starredBy,
            createdAt: file.createdAt,
            updatedAt: file.updatedAt,
          };
        })
      );

      res.json({
        success: true,
        files: populatedFiles,
      });
    } catch (error: any) {
      throw createError(error.message || 'Failed to fetch starred files', 500);
    }
  }
);

router.get(
  '/storage',
  requireAuth,
  fileRateLimiter,
  async (req: Request, res: Response) => {

    try {
      const user = req.user as IUser;
      const storageUsed = await calculateUserStorageUsed(user);
      const storageLimit = user.storageLimit || 100 * 1024 * 1024;

      res.json({
        success: true,
        storage: {
          used: storageUsed,
          limit: storageLimit,
          available: Math.max(0, storageLimit - storageUsed),
          percentage: storageLimit > 0 ? (storageUsed / storageLimit) * 100 : 0,
        },
      });
    } catch (error: any) {
      throw createError(error.message || 'Failed to fetch storage information', 500);
    }
  }
);

export default router;

