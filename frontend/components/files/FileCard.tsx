'use client';

import { useState } from 'react';
import { MoreVertical, Star, Check } from 'lucide-react';
import { Folder, FileText, Table, Presentation, File, Image, Video } from 'lucide-react';
import { File as FileType } from '@/types';
import { formatFileSize, formatDate } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

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
      className={`border border-[#e5e5e5] rounded-lg cursor-pointer transition-base ${
        selected
          ? 'border-[#1a73e8] shadow-[0_1px_3px_rgba(60,64,67,.3),0_4px_8px_3px_rgba(60,64,67,.15)]'
          : 'hover:shadow-[0_1px_3px_rgba(60,64,67,.3),0_4px_8px_3px_rgba(60,64,67,.15)] hover:border-transparent'
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      onDoubleClick={() => onDoubleClick && onDoubleClick(file)}
    >
      <div className="h-[180px] bg-[#f1f3f4] rounded-t-lg flex items-center justify-center relative">
        {getFileIcon()}
        
        {showCheckbox && (
          <div className="absolute top-2 left-2">
            <div className={`w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-colors ${
              selected
                ? 'bg-[#1a73e8] border-[#1a73e8]'
                : 'bg-white border-[#5f6368] hover:border-[#1a73e8]'
            }`}>
              {selected && <Check size={12} color="white" />}
            </div>
          </div>
        )}
        
        {hovered && (
          <>
            {onStar && (
              <button
                onClick={handleStarClick}
                className={`absolute top-2 right-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isStarred
                    ? 'bg-yellow-400 hover:bg-yellow-500 text-white'
                    : 'bg-white hover:bg-gray-100 text-[#5f6368] shadow-sm'
                }`}
              >
                <Star size={16} className={isStarred ? 'fill-current' : ''} />
              </button>
            )}
            <button
              onClick={handleMenuClick}
              className="absolute top-2 right-2 w-8 h-8 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center text-[#5f6368] shadow-sm transition-colors"
            >
              <MoreVertical size={16} />
            </button>
          </>
        )}
        
        {!hovered && onStar && isStarred && (
          <button
            onClick={handleStarClick}
            className="absolute top-2 left-2 w-8 h-8 bg-yellow-400 hover:bg-yellow-500 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <Star size={16} className="fill-current" />
          </button>
        )}
      </div>
      
      <div className="p-4">
        <div className="text-sm text-[#202124] font-normal overflow-hidden text-ellipsis whitespace-nowrap mb-2">
          {file.originalName}
        </div>
        <div className="text-xs text-[#5f6368] flex items-center gap-1.5">
          <span>{formatDate(file.updatedAt)}</span>
          <span>•</span>
          <span>{formatFileSize(file.size)}</span>
        </div>
      </div>
    </div>
  );
}
