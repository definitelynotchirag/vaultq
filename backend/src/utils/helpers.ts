import { v4 as uuidv4 } from 'uuid';
import { File } from '../models/File';
import { IUser } from '../types';

export const generateStorageName = (originalName: string): string => {
  const timestamp = Date.now();
  const uuid = uuidv4();
  const extension = originalName.split('.').pop() || '';
  const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
  const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_');
  return `${sanitizedName}_${timestamp}_${uuid}.${extension}`;
};

export const calculateUserStorageUsed = async (user: IUser): Promise<number> => {
  const result = await File.aggregate([
    {
      $match: {
        owner: user._id,
      },
    },
    {
      $group: {
        _id: null,
        totalSize: { $sum: '$size' },
      },
    },
  ]);

  return result.length > 0 ? result[0].totalSize : 0;
};



