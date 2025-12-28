import { Router, Request, Response } from 'express';
import { fileRateLimiter } from '../config/rateLimiter';
import { getSharedFile } from '../services/fileService';
import { createError } from '../middleware/errorHandler';
import { IUser } from '../types';
import { User } from '../models/User';
import { generateDownloadUrl, generateViewUrl } from '../services/s3Service';

const router = Router();

router.get(
  '/:fileId',
  fileRateLimiter,
  async (req: Request, res: Response) => {
    const { fileId } = req.params;

    try {
      const user = req.user as IUser | undefined;
      const file = await getSharedFile(fileId, user || undefined);

      const populatedPermissions = await Promise.all(
        file.permissions.map(async (perm: any) => {
          const user = await User.findById(perm.userId).select('name email');
          return {
            userId: user ? { _id: user._id, name: user.name, email: user.email } : perm.userId,
            level: perm.level,
          };
        })
      );

      res.json({
        success: true,
        file: {
          _id: file._id,
          originalName: file.originalName,
          size: file.size,
          public: file.public,
          owner: file.owner,
          permissions: populatedPermissions,
          starredBy: file.starredBy,
          createdAt: file.createdAt,
          updatedAt: file.updatedAt,
        },
      });
    } catch (error: any) {
      if (error.statusCode) {
        throw error;
      }
      throw createError(error.message || 'Failed to fetch shared file', 500);
    }
  }
);

router.get(
  '/:fileId/view',
  fileRateLimiter,
  async (req: Request, res: Response) => {
    const { fileId } = req.params;

    try {
      const user = req.user as IUser | undefined;
      const file = await getSharedFile(fileId, user || undefined);

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
  '/:fileId/download',
  fileRateLimiter,
  async (req: Request, res: Response) => {
    const { fileId } = req.params;

    try {
      const user = req.user as IUser | undefined;
      const file = await getSharedFile(fileId, user || undefined);

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

