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
    <div className="fixed top-16 left-0 md:left-[var(--sidebar-width,256px)] right-0 h-14 sm:h-16 bg-[#e8f0fe] border-b border-[#c2e7ff] flex items-center px-3 sm:px-4 md:px-8 gap-2 sm:gap-3 md:gap-6 z-30 transition-all">
      <div className="text-xs sm:text-sm font-medium text-[#001d35] whitespace-nowrap">
        {selectedCount} {selectedCount === 1 ? 'item' : 'items'}
      </div>
      
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto hide-scrollbar flex-1">
        {onShare && (
          <button
            onClick={onShare}
            className="h-8 sm:h-9 px-2.5 sm:px-3 md:px-4 rounded flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#001d35] hover:bg-[rgba(1,87,155,0.08)] transition-colors whitespace-nowrap flex-shrink-0"
            aria-label="Share"
          >
            <Users size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden sm:inline">Share</span>
          </button>
        )}
        
        {onDownload && (
          <button
            onClick={onDownload}
            className="h-8 sm:h-9 px-2.5 sm:px-3 md:px-4 rounded flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#001d35] hover:bg-[rgba(1,87,155,0.08)] transition-colors whitespace-nowrap flex-shrink-0"
            aria-label="Download"
          >
            <Download size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden sm:inline">Download</span>
          </button>
        )}
        
        {onMove && (
          <button
            onClick={onMove}
            className="h-8 sm:h-9 px-2.5 sm:px-3 md:px-4 rounded flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#001d35] hover:bg-[rgba(1,87,155,0.08)] transition-colors whitespace-nowrap hidden md:flex flex-shrink-0"
            aria-label="Move"
          >
            <Folder size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span>Move</span>
          </button>
        )}
        
        {onStar && (
          <button
            onClick={onStar}
            className="h-8 sm:h-9 px-2.5 sm:px-3 md:px-4 rounded flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#001d35] hover:bg-[rgba(1,87,155,0.08)] transition-colors whitespace-nowrap flex-shrink-0"
            aria-label="Star"
          >
            <Star size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden sm:inline">Star</span>
          </button>
        )}
        
        {onDelete && (
          <button
            onClick={onDelete}
            className="h-8 sm:h-9 px-2.5 sm:px-3 md:px-4 rounded flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#001d35] hover:bg-[rgba(1,87,155,0.08)] transition-colors whitespace-nowrap flex-shrink-0"
            aria-label="Delete"
          >
            <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        )}
        
        {onMore && (
          <button
            onClick={onMore}
            className="h-8 sm:h-9 px-2.5 sm:px-3 md:px-4 rounded flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#001d35] hover:bg-[rgba(1,87,155,0.08)] transition-colors whitespace-nowrap hidden md:flex flex-shrink-0"
            aria-label="More"
          >
            <MoreVertical size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span>More</span>
          </button>
        )}
      </div>
    </div>
  );
}

