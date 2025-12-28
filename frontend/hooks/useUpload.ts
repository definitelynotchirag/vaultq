import { api } from '@/lib/api';
import { File as FileType } from '@/types';
import { useState } from 'react';

interface UploadProgress {
  file: globalThis.File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

export function useUpload() {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: globalThis.File): Promise<FileType | null> => {
    const MAX_SIZE = 100 * 1024 * 1024; // 100MB

    if (file.size > MAX_SIZE) {
      throw new Error('File size exceeds 100MB limit');
    }

    setIsUploading(true);
    const uploadId = Date.now().toString();

    try {
      const uploadProgress: UploadProgress = {
        file: file as any,
        progress: 0,
        status: 'uploading',
      };
      setUploads((prev) => [...prev, uploadProgress]);

      const { uploadUrl, fields, storageName, url } = await api.files.getUploadUrl(
        file.name,
        file.size
      );

      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append('file', file);

      const xhr = new XMLHttpRequest();

      return new Promise<FileType | null>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setUploads((prev) =>
              prev.map((u) =>
                u.file === file ? { ...u, progress } : u
              )
            );
          }
        });

        xhr.addEventListener('load', async () => {
          if (xhr.status === 200 || xhr.status === 204) {
            try {
              const response = await api.files.confirmUpload(
                file.name,
                storageName,
                url,
                file.size
              );

              setUploads((prev) =>
                prev.map((u) =>
                  u.file === file
                    ? { ...u, progress: 100, status: 'success' }
                    : u
                )
              );

              setTimeout(() => {
                setUploads((prev) => prev.filter((u) => u.file !== file));
              }, 2000);

              setIsUploading(false);
              resolve(response.file);
            } catch (error: any) {
              setUploads((prev) =>
                prev.map((u) =>
                  u.file === file
                    ? {
                        ...u,
                        status: 'error',
                        error: error.message || 'Failed to confirm upload',
                      }
                    : u
                )
              );
              setIsUploading(false);
              reject(error);
            }
          } else {
            const error = new Error('Upload failed');
            setUploads((prev) =>
              prev.map((u) =>
                u.file === file
                  ? { ...u, status: 'error', error: 'Upload failed' }
                  : u
              )
            );
            setIsUploading(false);
            reject(error);
          }
        });

        xhr.addEventListener('error', () => {
          setUploads((prev) =>
            prev.map((u) =>
              u.file === file
                ? { ...u, status: 'error', error: 'Network error' }
                : u
            )
          );
          setIsUploading(false);
          reject(new Error('Network error'));
        });

        xhr.open('POST', uploadUrl);
        xhr.send(formData);
      });
    } catch (error: any) {
      setUploads((prev) =>
        prev.map((u) =>
          u.file === file
            ? { ...u, status: 'error', error: error.message || 'Upload failed' }
            : u
        )
      );
      setIsUploading(false);
      throw error;
    }
  };

  const clearUploads = () => {
    setUploads([]);
  };

  return {
    uploadFile,
    uploads,
    isUploading,
    clearUploads,
  };
}

