import { File } from '../models/File';
import { IUser, IFile } from '../types';
import { createError } from '../middleware/errorHandler';

export const checkFileAccess = async (
  fileId: string,
  user: IUser,
  requiredLevel: 'read' | 'write' = 'read'
): Promise<IFile> => {
  const file = await File.findById(fileId);
  if (!file) {
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

  let query: any = {
    $or: [
      { owner: userId },
      { public: true },
      { 'permissions.userId': userId },
    ],
  };

  if (searchQuery) {
    query.$and = [
      query.$or,
      {
        $or: [
          { originalName: { $regex: searchQuery, $options: 'i' } },
          { $text: { $search: searchQuery } },
        ],
      },
    ];
    delete query.$or;
  }

  return File.find(query).sort({ createdAt: -1 }).populate('owner', 'name email');
};

