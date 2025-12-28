'use client';

import { X, Folder, FileText, Table, Presentation, File, Image, Video } from 'lucide-react';
import { File as FileType } from '@/types';
import { formatFileSize, formatDate } from '@/lib/utils';

interface PreviewPanelProps {
  file: FileType | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PreviewPanel({ file, isOpen, onClose }: PreviewPanelProps) {
  if (!isOpen || !file) return null;

  const getFileIcon = () => {
    const extension = file.originalName.split('.').pop()?.toLowerCase() || '';
    const iconSize = 64;
    
    if (extension === 'folder' || !extension) {
      return <Folder size={iconSize} color="#5f6368" />;
    }
    
    if (['pdf'].includes(extension)) {
      return <File size={iconSize} color="#ea4335" />;
    }
    
    if (['doc', 'docx'].includes(extension)) {
      return <FileText size={iconSize} color="#4285f4" />;
    }
    
    if (['xls', 'xlsx'].includes(extension)) {
      return <Table size={iconSize} color="#0f9d58" />;
    }
    
    if (['ppt', 'pptx'].includes(extension)) {
      return <Presentation size={iconSize} color="#f4b400" />;
    }
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return <Image size={iconSize} color="#4285f4" />;
    }
    
    if (['mp4', 'mov', 'avi', 'webm'].includes(extension)) {
      return <Video size={iconSize} color="#ea4335" />;
    }
    
    return <FileText size={iconSize} color="#5f6368" />;
  };

  return (
    <div className="fixed right-0 top-16 w-full sm:w-[360px] h-[calc(100vh-64px)] bg-white border-l border-[#e5e5e5] overflow-y-auto z-40">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-normal text-[#202124]">Details</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#f1f3f4] flex items-center justify-center transition-colors"
          >
            <X size={18} className="text-[#5f6368]" />
          </button>
        </div>

        <div className="w-full h-[200px] bg-[#f1f3f4] rounded-lg flex items-center justify-center mb-6">
          {getFileIcon()}
        </div>

        <div className="mb-6">
          <div className="text-[11px] font-medium text-[#5f6368] uppercase tracking-wide mb-2">
            Name
          </div>
          <div className="text-sm text-[#202124] break-words">
            {file.originalName}
          </div>
        </div>

        <div className="mb-6">
          <div className="text-[11px] font-medium text-[#5f6368] uppercase tracking-wide mb-2">
            Size
          </div>
          <div className="text-sm text-[#202124]">
            {formatFileSize(file.size)}
          </div>
        </div>

        <div className="mb-6">
          <div className="text-[11px] font-medium text-[#5f6368] uppercase tracking-wide mb-2">
            Modified
          </div>
          <div className="text-sm text-[#202124]">
            {formatDate(file.updatedAt)}
          </div>
        </div>

        <div className="mb-6">
          <div className="text-[11px] font-medium text-[#5f6368] uppercase tracking-wide mb-2">
            Created
          </div>
          <div className="text-sm text-[#202124]">
            {formatDate(file.createdAt)}
          </div>
        </div>

        <div className="mb-6">
          <div className="text-[11px] font-medium text-[#5f6368] uppercase tracking-wide mb-2">
            Owner
          </div>
          <div className="text-sm text-[#202124]">
            You
          </div>
        </div>

        {file.public && (
          <div className="mb-6">
            <div className="text-[11px] font-medium text-[#5f6368] uppercase tracking-wide mb-2">
              Sharing
            </div>
            <div className="text-sm text-[#202124]">
              Anyone with the link can view
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

