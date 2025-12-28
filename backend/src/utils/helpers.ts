import { v4 as uuidv4 } from 'uuid';

export const generateStorageName = (originalName: string): string => {
  const timestamp = Date.now();
  const uuid = uuidv4();
  const extension = originalName.split('.').pop() || '';
  const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
  const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_');
  return `${sanitizedName}_${timestamp}_${uuid}.${extension}`;
};



