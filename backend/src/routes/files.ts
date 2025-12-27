import { Router, Request, Response } from 'express';
import { File } from '../models/File';
import { User } from '../models/User';
import { requireAuth } from '../middleware/auth';
import { validateFileSize } from '../middleware/fileValidation';
import { fileRateLimiter } from '../config/rateLimiter';
import { generateUploadUrl, generateDownloadUrl, deleteFile as deleteS3File } from '../services/s3Service';
import { checkFileAccess, getAccessibleFiles } from '../services/fileService';
import { createError } from '../middleware/errorHandler';
import { IUser } from '../types';

const router = Router();

router.use(requireAuth);

router.post(
  '/upload-url',
  fileRateLimiter,
  validateFileSize,
  async (req: Request, res: Response) => {
    const { originalName, size } = req.body;

    if (!originalName || typeof originalName !== 'string') {
      throw createError('originalName is required and must be a string', 400);
    }

    try {
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
      throw createError(error.message || 'Failed to generate upload URL', 500);
    }
  }
);

router.post(
  '/confirm-upload',
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
  fileRateLimiter,
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw createError('Authentication required', 401);
    }
    const searchQuery = req.query.search as string | undefined;

    try {
      const user = req.user as IUser;
      const files = await getAccessibleFiles(user, searchQuery);

      res.json({
        success: true,
        files: files.map((file) => ({
          _id: file._id,
          originalName: file.originalName,
          size: file.size,
          public: file.public,
          owner: file.owner,
          permissions: file.permissions,
          createdAt: file.createdAt,
          updatedAt: file.updatedAt,
        })),
      });
    } catch (error: any) {
      throw createError(error.message || 'Failed to fetch files', 500);
    }
  }
);

router.put(
  '/:id',
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
  fileRateLimiter,
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw createError('Authentication required', 401);
    }
    const { id } = req.params;

    try {
      const user = req.user as IUser;
      const file = await checkFileAccess(id, user, 'write');

      await deleteS3File(file.storageName);
      await File.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'File deleted successfully',
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
  fileRateLimiter,
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw createError('Authentication required', 401);
    }
    const { id } = req.params;

    try {
      const user = req.user as IUser;
      const file = await checkFileAccess(id, user, 'write');

      file.public = true;
      await file.save();

      res.json({
        success: true,
        file: {
          _id: file._id,
          originalName: file.originalName,
          public: file.public,
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
  fileRateLimiter,
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw createError('Authentication required', 401);
    }
    const { id } = req.params;

    try {
      const user = req.user as IUser;
      const file = await checkFileAccess(id, user, 'write');

      file.public = false;
      await file.save();

      res.json({
        success: true,
        file: {
          _id: file._id,
          originalName: file.originalName,
          public: file.public,
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
    if (!req.user) {
      throw createError('Authentication required', 401);
    }
    const { id } = req.params;

    try {
      const user = req.user as IUser;
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

export default router;

