import { s3, S3_BUCKET } from '../config/s3';
import { generateStorageName } from '../utils/helpers';

const MAX_FILE_SIZE = 100 * 1024 * 1024;
const PRESIGNED_URL_EXPIRY = 15 * 60;

export interface PresignedUploadResponse {
  uploadUrl: string;
  fields: Record<string, string>;
  storageName: string;
  url: string;
}

export const generateUploadUrl = async (
  originalName: string,
  size: number
): Promise<PresignedUploadResponse> => {
  if (size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }

  const storageName = generateStorageName(originalName);
  const key = `files/${storageName}`;

  const params = {
    Bucket: S3_BUCKET,
    Key: key,
    Expires: PRESIGNED_URL_EXPIRY,
    Conditions: [
      ['content-length-range', 1, MAX_FILE_SIZE],
    ],
    Fields: {
      'Content-Type': 'application/octet-stream',
    },
  };

  return new Promise((resolve, reject) => {
    s3.createPresignedPost(params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      resolve({
        uploadUrl: data.url,
        fields: data.fields,
        storageName,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${key}`,
      });
    });
  });
};

export const generateDownloadUrl = async (storageName: string): Promise<string> => {
  const key = `files/${storageName}`;

  const params = {
    Bucket: S3_BUCKET,
    Key: key,
    Expires: PRESIGNED_URL_EXPIRY,
  };

  return s3.getSignedUrlPromise('getObject', params);
};

export const deleteFile = async (storageName: string): Promise<void> => {
  const key = `files/${storageName}`;

  const params = {
    Bucket: S3_BUCKET,
    Key: key,
  };

  await s3.deleteObject(params).promise();
};

