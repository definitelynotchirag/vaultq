import {
  AuthResponse,
  DownloadUrlResponse,
  FileResponse,
  FilesResponse,
  StorageResponse,
  UploadUrlResponse,
  ViewUrlResponse
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  skipAuthRedirect: boolean = false
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (response.status === 401) {
    if (!skipAuthRedirect) {
      const pathname = window.location.pathname;
      const isAuthPage = pathname.startsWith('/auth/');
      const isSharedPage = pathname.startsWith('/shared/');
      const isSigninPage = pathname === '/signin';
      if (!isAuthPage && !isSharedPage && !isSigninPage) {
        window.location.href = `${API_URL}/auth/google`;
      }
    }
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.error || errorData.message || 'Unauthorized',
      401,
      'Unauthorized'
    );
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.error || errorData.message || 'Request failed',
      response.status,
      response.statusText
    );
  }

  return response.json();
}

export const api = {
  auth: {
    login: () => {
      window.location.href = `${API_URL}/auth/google`;
    },

    getCurrentUser: async (): Promise<AuthResponse> => {
      return fetchApi<AuthResponse>('/auth/me', {}, true);
    },

    logout: async (): Promise<{ success: boolean; message?: string }> => {
      return fetchApi('/auth/logout', {
        method: 'POST',
      });
    },
  },

  files: {
    getFiles: async (search?: string): Promise<FilesResponse> => {
      const query = search ? `?search=${encodeURIComponent(search)}` : '';
      return fetchApi<FilesResponse>(`/files${query}`);
    },

    getFile: async (fileId: string): Promise<FileResponse> => {
      return fetchApi<FileResponse>(`/files/${fileId}`);
    },

    getUploadUrl: async (
      originalName: string,
      size: number
    ): Promise<UploadUrlResponse> => {
      return fetchApi<UploadUrlResponse>('/files/upload-url', {
        method: 'POST',
        body: JSON.stringify({ originalName, size }),
      });
    },

    confirmUpload: async (
      originalName: string,
      storageName: string,
      url: string,
      size: number
    ): Promise<FileResponse> => {
      return fetchApi<FileResponse>('/files/confirm-upload', {
        method: 'POST',
        body: JSON.stringify({ originalName, storageName, url, size }),
      });
    },

    renameFile: async (
      fileId: string,
      originalName: string
    ): Promise<FileResponse> => {
      return fetchApi<FileResponse>(`/files/${fileId}`, {
        method: 'PUT',
        body: JSON.stringify({ originalName }),
      });
    },

    deleteFile: async (fileId: string): Promise<{ success: boolean; message?: string }> => {
      return fetchApi(`/files/${fileId}`, {
        method: 'DELETE',
      });
    },

    downloadFile: async (fileId: string): Promise<DownloadUrlResponse> => {
      return fetchApi<DownloadUrlResponse>(`/files/${fileId}/download`);
    },

    getViewUrl: async (fileId: string): Promise<ViewUrlResponse> => {
      return fetchApi<ViewUrlResponse>(`/files/${fileId}/view`);
    },

    shareFile: async (
      fileId: string,
      userId: string,
      level: 'read' | 'write'
    ): Promise<FileResponse> => {
      return fetchApi<FileResponse>(`/files/${fileId}/share`, {
        method: 'POST',
        body: JSON.stringify({ userId, level }),
      });
    },

    shareFileByEmail: async (
      fileId: string,
      email: string,
      level: 'read' | 'write'
    ): Promise<FileResponse> => {
      return fetchApi<FileResponse>(`/files/${fileId}/share-email`, {
        method: 'POST',
        body: JSON.stringify({ email, level }),
      });
    },

    makePublic: async (fileId: string): Promise<FileResponse> => {
      return fetchApi<FileResponse>(`/files/${fileId}/public`, {
        method: 'POST',
      });
    },

    makePrivate: async (fileId: string): Promise<FileResponse> => {
      return fetchApi<FileResponse>(`/files/${fileId}/private`, {
        method: 'POST',
      });
    },

    getTrashFiles: async (): Promise<FilesResponse> => {
      return fetchApi<FilesResponse>('/files/trash');
    },

    restoreFile: async (fileId: string): Promise<FileResponse> => {
      return fetchApi<FileResponse>(`/files/${fileId}/restore`, {
        method: 'POST',
      });
    },

    permanentDeleteFile: async (fileId: string): Promise<{ success: boolean; message?: string }> => {
      return fetchApi(`/files/${fileId}/permanent`, {
        method: 'DELETE',
      });
    },

    getSharedFile: async (fileId: string): Promise<FileResponse> => {
      return fetchApi<FileResponse>(`/shared/${fileId}`, {}, true);
    },

    getSharedFileViewUrl: async (fileId: string): Promise<ViewUrlResponse> => {
      return fetchApi<ViewUrlResponse>(`/shared/${fileId}/view`, {}, true);
    },

    getSharedFileDownloadUrl: async (fileId: string): Promise<DownloadUrlResponse> => {
      return fetchApi<DownloadUrlResponse>(`/shared/${fileId}/download`, {}, true);
    },

    starFile: async (fileId: string): Promise<FileResponse> => {
      return fetchApi<FileResponse>(`/files/${fileId}/star`, {
        method: 'POST',
      });
    },

    unstarFile: async (fileId: string): Promise<FileResponse> => {
      return fetchApi<FileResponse>(`/files/${fileId}/star`, {
        method: 'DELETE',
      });
    },

    getStarredFiles: async (search?: string): Promise<FilesResponse> => {
      const query = search ? `?search=${encodeURIComponent(search)}` : '';
      return fetchApi<FilesResponse>(`/files/starred${query}`);
    },

    getShareableUrl: (fileId: string): string => {
      if (typeof window === 'undefined') return '';
      return `${window.location.origin}/shared/${fileId}`;
    },

    getStorage: async (): Promise<StorageResponse> => {
      return fetchApi<StorageResponse>('/files/storage');
    },
  },
};

export { ApiError };

