import { s3, S3_BUCKET } from '../config/s3';
import { generateStorageName } from '../utils/helpers';

const MAX_FILE_SIZE = 100 * 1024 * 1024;
const PRESIGNED_URL_EXPIRY = 15 * 60;

export const getContentType = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    txt: 'text/plain',
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    json: 'application/json',
    xml: 'application/xml',
    zip: 'application/zip',
    mp4: 'video/mp4',
    mp3: 'audio/mpeg',
  };
  return mimeTypes[ext] || 'application/octet-stream';
};

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
  const contentType = getContentType(originalName);

  const params = {
    Bucket: S3_BUCKET,
    Key: key,
    Expires: PRESIGNED_URL_EXPIRY,
    Conditions: [
      ['content-length-range', 1, MAX_FILE_SIZE],
      ['eq', '$Content-Type', contentType],
    ],
    Fields: {
      key: key,
      'Content-Type': contentType,
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

export const generateViewUrl = async (storageName: string, originalName?: string): Promise<string> => {
  const key = `files/${storageName}`;
  const contentType = originalName ? getContentType(originalName) : undefined;

  const params: any = {
    Bucket: S3_BUCKET,
    Key: key,
    Expires: PRESIGNED_URL_EXPIRY,
    ResponseContentDisposition: 'inline',
  };

  if (contentType) {
    params.ResponseContentType = contentType;
  }

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

