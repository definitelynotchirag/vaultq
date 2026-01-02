import { createError } from '../middleware/errorHandler';
import { File } from '../models/File';
import { Permission } from '../models/Permission';
import { Star } from '../models/Star';
import { IFile, IUser } from '../types';

export const checkFileAccess = async (
  fileId: string,
  user: IUser | undefined,
  requiredLevel: 'read' | 'write' = 'read'
): Promise<IFile> => {
  const file = await File.findById(fileId);
  if (!file) {
    throw createError('File not found', 404);
  }

  if (file.deleted) {
    throw createError('File not found', 404);
  }

  if (file.public && requiredLevel === 'read') {
    return file;
  }

  if (!user) {
    throw createError('Authentication required', 401);
  }

  const userId = user._id.toString();
  const ownerId = file.owner.toString();

  if (ownerId === userId) {
    return file;
  }

  const permission = await Permission.findOne({
    fileId: file._id,
    userId: user._id,
  });

  if (permission) {
    if (requiredLevel === 'read') {
      if (permission.level === 'read' || permission.level === 'write') {
        return file;
      }
    } else {
      if (permission.level === 'write') {
        return file;
      }
    }
  }

  if (file.public && requiredLevel === 'write') {
    throw createError('Write access denied for public files', 403);
  }

  throw createError('Access denied', 403);
};

export const getAccessibleFiles = async (user: IUser, searchQuery?: string) => {
  const userId = user._id;

  const userPermissions = await Permission.find({ userId }).select('fileId');
  const accessibleFileIds = userPermissions.map((p) => p.fileId);

  let query: any = {
    $or: [
      { owner: userId },
      { _id: { $in: accessibleFileIds } },
    ],
    public: { $ne: true },
    deleted: { $ne: true },
  };

  if (searchQuery) {
    query = {
      $and: [
        {
          $or: [
            { owner: userId },
            { _id: { $in: accessibleFileIds } },
          ],
        },
        { public: { $ne: true } },
        { originalName: { $regex: searchQuery, $options: 'i' } },
        { deleted: { $ne: true } },
      ],
    };
  }

  return File.find(query).sort({ createdAt: -1 }).populate('owner', 'name email');
};

export const getTrashFiles = async (user: IUser) => {
  const userId = user._id;

  const userPermissions = await Permission.find({ userId }).select('fileId');
  const accessibleFileIds = userPermissions.map((p) => p.fileId);

  const query = {
    $or: [
      { owner: userId },
      { _id: { $in: accessibleFileIds } },
    ],
    deleted: true,
  };

  return File.find(query).sort({ deletedAt: -1 }).populate('owner', 'name email');
};

export const getSharedFile = async (fileId: string, user?: IUser): Promise<IFile> => {
  const file = await File.findById(fileId);
  if (!file) {
    throw createError('File not found', 404);
  }

  if (file.deleted) {
    throw createError('File not found', 404);
  }

  if (file.public === true) {
    return file;
  }

  if (!user) {
    throw createError('Authentication required', 401);
  }

  return checkFileAccess(fileId, user, 'read');
};

export const getStarredFiles = async (user: IUser, searchQuery?: string) => {
  const userId = user._id;

  const userStars = await Star.find({ userId }).select('fileId');
  const starredFileIds = userStars.map((s) => s.fileId);

  const userPermissions = await Permission.find({ userId }).select('fileId');
  const accessibleFileIds = userPermissions.map((p) => p.fileId);

  let query: any = {
    $or: [
      { owner: userId },
      { _id: { $in: accessibleFileIds } },
    ],
    _id: { $in: starredFileIds },
    public: { $ne: true },
    deleted: { $ne: true },
  };

  if (searchQuery) {
    query = {
      $and: [
        {
          $or: [
            { owner: userId },
            { _id: { $in: accessibleFileIds } },
          ],
        },
        { _id: { $in: starredFileIds } },
        { public: { $ne: true } },
        { originalName: { $regex: searchQuery, $options: 'i' } },
        { deleted: { $ne: true } },
      ],
    };
  }

  return File.find(query).sort({ createdAt: -1 }).populate('owner', 'name email');
};

