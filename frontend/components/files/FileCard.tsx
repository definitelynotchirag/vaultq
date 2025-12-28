'use client';

import { useAuth } from '@/hooks/useAuth';
import { formatDate, formatFileSize } from '@/lib/utils';
import { File as FileType } from '@/types';
import { Check, File, FileText, Folder, Image, MoreVertical, Presentation, Star, Table, Video } from 'lucide-react';
import { useState } from 'react';

interface FileCardProps {
  file: FileType;
  onSelect?: (file: FileType, event: React.MouseEvent) => void;
  onMenuClick?: (file: FileType, event: React.MouseEvent) => void;
  onDoubleClick?: (file: FileType) => void;
  onStar?: (file: FileType) => void;
  selected?: boolean;
}

export function FileCard({
  file,
  onSelect,
  onMenuClick,
  onDoubleClick,
  onStar,
  selected,
}: FileCardProps) {
  const [hovered, setHovered] = useState(false);
  const { user } = useAuth();
  const isStarred = user && file.starredBy?.includes(user._id);

  const handleClick = (e: React.MouseEvent) => {
    if (e.detail === 2 && onDoubleClick) {
      onDoubleClick(file);
    } else if (onSelect) {
      onSelect(file, e);
    }
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMenuClick) {
      onMenuClick(file, e);
    }
  };

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStar) {
      onStar(file);
    }
  };

  const getFileIcon = () => {
    const extension = file.originalName.split('.').pop()?.toLowerCase() || '';
    const iconSize = 48;
    
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

  const showCheckbox = selected || hovered;

  return (
    <div
      className={`border border-[#e5e5e5] rounded-lg cursor-pointer transition-base p-2 sm:p-8 ${
        selected
          ? 'border-[#1a73e8] shadow-[0_1px_3px_rgba(60,64,67,.3),0_4px_8px_3px_rgba(60,64,67,.15)]'
          : 'hover:shadow-[0_1px_3px_rgba(60,64,67,.3),0_4px_8px_3px_rgba(60,64,67,.15)] hover:border-transparent'
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      onDoubleClick={() => onDoubleClick && onDoubleClick(file)}
    >
      <div className="h-[140px] sm:h-[160px] md:h-[180px] bg-[#f1f3f4] rounded-t-lg flex items-center justify-center relative">
        <div className="scale-75 sm:scale-90 md:scale-100">
          {getFileIcon()}
        </div>
        
        {showCheckbox && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
            <div className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center transition-colors ${
              selected
                ? 'bg-[#1a73e8] border-[#1a73e8]'
                : 'bg-white border-[#5f6368] hover:border-[#1a73e8]'
            }`}>
              {selected && <Check size={14} color="white" strokeWidth={3} />}
            </div>
          </div>
        )}
        
        {!showCheckbox && onStar && isStarred && (
          <button
            onClick={handleStarClick}
            className="absolute top-2 sm:top-3 left-2 sm:left-3 w-7 h-7 sm:w-8 sm:h-8 bg-transparent rounded-full flex items-center justify-center text-[#f4b400] transition-colors"
            aria-label="Starred"
          >
            <Star size={18} className="sm:w-5 sm:h-5 fill-current" />
          </button>
        )}
        
        {hovered && (
          <>
            {onStar && (
              <button
                onClick={handleStarClick}
                className={`absolute top-2 sm:top-3 right-10 sm:right-12 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors ${
                  isStarred
                    ? 'bg-[#feefc3] hover:bg-[#fde293] text-[#f4b400]'
                    : 'bg-white hover:bg-[#f1f3f4] text-[#5f6368] shadow-[0_1px_2px_rgba(0,0,0,.3),0_1px_3px_1px_rgba(0,0,0,.15)]'
                }`}
                aria-label={isStarred ? 'Remove star' : 'Add star'}
              >
                <Star size={16} className={`sm:w-[18px] sm:h-[18px] ${isStarred ? 'fill-current' : ''}`} />
              </button>
            )}
            <button
              onClick={handleMenuClick}
              className="absolute top-2 sm:top-3 right-2 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 bg-white hover:bg-[#f1f3f4] rounded-full flex items-center justify-center text-[#5f6368] shadow-[0_1px_2px_rgba(0,0,0,.3),0_1px_3px_1px_rgba(0,0,0,.15)] transition-colors"
              aria-label="More actions"
            >
              <MoreVertical size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </>
        )}
      </div>
      
      <div className="p-3 sm:p-3.5 md:p-4">
        <div className="text-xs sm:text-sm text-[#202124] font-normal overflow-hidden text-ellipsis whitespace-nowrap mb-1 sm:mb-1.5">
          {file.originalName}
        </div>
        <div className="text-[11px] sm:text-xs text-[#5f6368] flex items-center gap-1 sm:gap-1.5">
          <span className="truncate">{formatDate(file.updatedAt)}</span>
          <span>•</span>
          <span>{formatFileSize(file.size)}</span>
        </div>
      </div>
    </div>
  );
}
