'use client';

import { File } from '@/types';
import { Download, Folder, MoreVertical, Star, Trash2, Users } from 'lucide-react';

interface SelectionToolbarProps {
  selectedCount: number;
  selectedFiles: File[];
  onShare?: () => void;
  onDownload?: () => void;
  onMove?: () => void;
  onStar?: () => void;
  onDelete?: () => void;
  onMore?: () => void;
}

export function SelectionToolbar({
  selectedCount,
  selectedFiles,
  onShare,
  onDownload,
  onMove,
  onStar,
  onDelete,
  onMore,
}: SelectionToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed top-16 left-0 md:left-64 right-0 h-16 bg-[#e8f0fe] border-b border-[#c2e7ff] flex items-center px-4 md:px-8 gap-3 md:gap-6 z-30 transition-all">
      <div className="text-sm font-medium text-[#001d35] whitespace-nowrap">
        {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
      </div>
      
      <div className="flex items-center gap-2 overflow-x-auto">
        {onShare && (
          <button
            onClick={onShare}
            className="h-9 px-3 md:px-4 rounded flex items-center gap-2 text-sm text-[#001d35] hover:bg-[rgba(1,87,155,0.08)] transition-colors whitespace-nowrap"
          >
            <Users size={18} />
            <span className="hidden sm:inline">Share</span>
          </button>
        )}
        
        {onDownload && (
          <button
            onClick={onDownload}
            className="h-9 px-3 md:px-4 rounded flex items-center gap-2 text-sm text-[#001d35] hover:bg-[rgba(1,87,155,0.08)] transition-colors whitespace-nowrap"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Download</span>
          </button>
        )}
        
        {onMove && (
          <button
            onClick={onMove}
            className="h-9 px-3 md:px-4 rounded flex items-center gap-2 text-sm text-[#001d35] hover:bg-[rgba(1,87,155,0.08)] transition-colors whitespace-nowrap hidden md:flex"
          >
            <Folder size={18} />
            <span>Move</span>
          </button>
        )}
        
        {onStar && (
          <button
            onClick={onStar}
            className="h-9 px-3 md:px-4 rounded flex items-center gap-2 text-sm text-[#001d35] hover:bg-[rgba(1,87,155,0.08)] transition-colors whitespace-nowrap"
          >
            <Star size={18} />
            <span className="hidden sm:inline">Star</span>
          </button>
        )}
        
        {onDelete && (
          <button
            onClick={onDelete}
            className="h-9 px-3 md:px-4 rounded flex items-center gap-2 text-sm text-[#001d35] hover:bg-[rgba(1,87,155,0.08)] transition-colors whitespace-nowrap"
          >
            <Trash2 size={18} />
            <span className="hidden sm:inline">Delete</span>
          </button>
        )}
        
        {onMore && (
          <button
            onClick={onMore}
            className="h-9 px-3 md:px-4 rounded flex items-center gap-2 text-sm text-[#001d35] hover:bg-[rgba(1,87,155,0.08)] transition-colors whitespace-nowrap hidden md:flex"
          >
            <MoreVertical size={18} />
            <span>More</span>
          </button>
        )}
      </div>
    </div>
  );
}

