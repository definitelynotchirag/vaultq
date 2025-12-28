'use client';

import { File } from '@/types';
import { FileCard } from '@/components/files/FileCard';

interface FileGridProps {
  files: File[];
  onFileSelect?: (file: File, event: React.MouseEvent) => void;
  onFileMenuClick?: (file: File, event: React.MouseEvent) => void;
  onFileDoubleClick?: (file: File) => void;
  onFileStar?: (file: File) => void;
  selectedFiles?: string[];
  loading?: boolean;
}

export function FileGrid({
  files,
  onFileSelect,
  onFileMenuClick,
  onFileDoubleClick,
  onFileStar,
  selectedFiles = [],
  loading = false,
}: FileGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 md:gap-5">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="border border-[#e5e5e5] rounded-lg animate-pulse"
          >
            <div className="h-[180px] bg-[#f1f3f4] rounded-t-lg" />
            <div className="p-4">
              <div className="h-4 bg-[#e8eaed] rounded mb-2" />
              <div className="h-3 bg-[#e8eaed] rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#5f6368]">
        <div className="text-6xl mb-4">📁</div>
        <div className="text-lg mb-2 text-[#202124]">No files yet</div>
        <div className="text-sm">Upload files to get started</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 md:gap-5 w-full">
      {files.map((file) => (
        <FileCard
          key={file._id}
          file={file}
          onSelect={onFileSelect}
          onMenuClick={onFileMenuClick}
          onDoubleClick={onFileDoubleClick}
          onStar={onFileStar}
          selected={selectedFiles.includes(file._id)}
        />
      ))}
    </div>
  );
}
