import { createError } from '../middleware/errorHandler';
import { File } from '../models/File';
import { IFile, IUser } from '../types';

export const checkFileAccess = async (
  fileId: string,
  user: IUser,
  requiredLevel: 'read' | 'write' = 'read'
): Promise<IFile> => {
  const file = await File.findById(fileId);
  if (!file) {
    throw createError('File not found', 404);
  }

  if (file.deleted) {
    throw createError('File not found', 404);
  }

  const userId = user._id.toString();
  const ownerId = file.owner.toString();

  if (ownerId === userId) {
    return file;
  }

  if (file.public && requiredLevel === 'read') {
    return file;
  }

  const hasPermission = file.permissions.some(
    (perm) => perm.userId.toString() === userId && perm.level === requiredLevel
  );

  if (hasPermission) {
    return file;
  }

  if (file.public && requiredLevel === 'write') {
    throw createError('Write access denied for public files', 403);
  }

  throw createError('Access denied', 403);
};

export const getAccessibleFiles = async (user: IUser, searchQuery?: string) => {
  const userId = user._id;

  const accessQuery = {
    $or: [
      { owner: userId },
      { public: true },
      { 'permissions.userId': userId },
    ],
  };

  let query: any = {
    ...accessQuery,
    deleted: { $ne: true },
  };

  if (searchQuery) {
    query = {
      $and: [
        accessQuery,
        { originalName: { $regex: searchQuery, $options: 'i' } },
        { deleted: { $ne: true } },
      ],
    };
  }

  return File.find(query).sort({ createdAt: -1 }).populate('owner', 'name email');
};

export const getTrashFiles = async (user: IUser) => {
  const userId = user._id;

  const query = {
    $or: [
      { owner: userId },
      { 'permissions.userId': userId },
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

  const accessQuery = {
    $or: [
      { owner: userId },
      { public: true },
      { 'permissions.userId': userId },
    ],
    starredBy: userId,
  };

  let query: any = {
    ...accessQuery,
    deleted: { $ne: true },
  };

  if (searchQuery) {
    query = {
      $and: [
        accessQuery,
        { originalName: { $regex: searchQuery, $options: 'i' } },
        { deleted: { $ne: true } },
      ],
    };
  }

  return File.find(query).sort({ createdAt: -1 }).populate('owner', 'name email');
};

