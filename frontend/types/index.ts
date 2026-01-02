export interface User {
  _id: string;
  googleId: string;
  email: string;
  name: string;
  storageLimit?: number;
  storageUsed?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  userId: string | { _id: string; name: string; email: string };
  level: 'read' | 'write';
}

export interface File {
  _id: string;
  owner: string | { _id: string; name: string; email: string };
  originalName: string;
  storageName: string;
  url: string;
  size: number;
  mimeType: string;
  public: boolean;
  permissions: Permission[];
  isStarred?: boolean;
  starCount?: number;
  shareCount?: number;
  deleted?: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export interface FilesResponse {
  success: boolean;
  files: File[];
}

export interface FileResponse {
  success: boolean;
  file: File;
}

export interface UploadUrlResponse {
  success: boolean;
  uploadUrl: string;
  fields: Record<string, string>;
  storageName: string;
  url: string;
  maxSize: number;
}

export interface DownloadUrlResponse {
  success: boolean;
  downloadUrl: string;
  expiresIn: number;
}

export interface ViewUrlResponse {
  success: boolean;
  viewUrl: string;
  expiresIn: number;
}

export interface StorageResponse {
  success: boolean;
  storage: {
    used: number;
    limit: number;
    available: number;
    percentage: number;
  };
}

