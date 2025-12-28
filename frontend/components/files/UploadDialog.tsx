'use client';

import { useRef, useState } from 'react';
import { X, Upload, File as FileIcon } from 'lucide-react';
import { useUpload } from '@/hooks/useUpload';
import { formatFileSize } from '@/lib/utils';

interface UploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: () => void;
}

export function UploadDialog({
  isOpen,
  onClose,
  onUploadComplete,
}: UploadDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, uploads, isUploading, clearUploads } = useUpload();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    for (const file of selectedFiles) {
      try {
        await uploadFile(file);
        if (onUploadComplete) {
          onUploadComplete();
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    setSelectedFiles([]);
    clearUploads();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[1000] modal-enter p-3 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-[480px] sm:max-w-md shadow-[0_8px_16px_rgba(0,0,0,0.15)] overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#e5e5e5] h-14 sm:h-16 px-4 sm:px-6">
          <h2 className="text-[#202124] text-base sm:text-lg font-normal">Upload Files</h2>
          <button
            onClick={handleClose}
            className="text-[#5f6368] hover:bg-[#f1f3f4] w-8 h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-4 sm:px-6 py-4 sm:py-5">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#dadce0] rounded-lg p-8 sm:p-10 text-center cursor-pointer hover:bg-[#f8f9fa] hover:border-[#1a73e8] transition-all"
          >
            <Upload size={40} className="sm:w-12 sm:h-12 text-[#5f6368] mx-auto mb-3 sm:mb-4" />
            <p className="text-[#202124] font-medium mb-2 text-sm sm:text-base">Click to select files</p>
            <p className="text-[#5f6368] text-xs sm:text-sm">Maximum file size: 100MB</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-4 sm:mt-5 space-y-2 max-h-[180px] sm:max-h-[200px] overflow-y-auto pr-1">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-[#f1f3f4] p-3 sm:p-4 rounded-lg"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <FileIcon size={18} className="sm:w-5 sm:h-5 text-[#5f6368] flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-[#202124] text-xs sm:text-sm font-medium truncate">{file.name}</div>
                      <div className="text-[#5f6368] text-[11px] sm:text-xs mt-0.5 sm:mt-1">
                        {formatFileSize(file.size)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {uploads.length > 0 && (
            <div className="mt-4 sm:mt-5 space-y-2 max-h-[180px] sm:max-h-[200px] overflow-y-auto pr-1">
              {uploads.map((upload, index) => (
                <div
                  key={index}
                  className="bg-[#f1f3f4] p-3 sm:p-4 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#202124] text-xs sm:text-sm font-medium truncate flex-1 mr-3">
                      {(upload.file as any).name}
                    </span>
                    <span className="text-[#5f6368] text-[11px] sm:text-xs flex-shrink-0">
                      {upload.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-[#dadce0] rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        upload.status === 'success'
                          ? 'bg-[#0f9d58]'
                          : upload.status === 'error'
                          ? 'bg-[#ea4335]'
                          : 'bg-[#1a73e8]'
                      }`}
                      style={{ width: `${upload.progress}%` }}
                    />
                  </div>
                  {upload.error && (
                    <div className="text-[#ea4335] text-[11px] sm:text-xs mt-2">
                      {upload.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 sm:gap-3 mt-5 sm:mt-6">
            <button
              onClick={handleClose}
              className="flex-1 px-4 sm:px-5 py-2 sm:py-2.5 bg-white border border-[#dadce0] hover:bg-[#f8f9fa] text-[#202124] rounded-lg transition-colors text-xs sm:text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || isUploading}
              className="flex-1 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#1a73e8] hover:bg-[#1765cc] disabled:bg-[#dadce0] disabled:cursor-not-allowed text-white rounded-lg transition-colors text-xs sm:text-sm font-medium shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
