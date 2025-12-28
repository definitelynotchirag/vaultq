'use client';

import { useEffect, useRef } from 'react';
import {
  Download,
  Edit,
  Copy,
  Share2,
  Folder,
  Info,
  CheckCircle,
  Trash2,
  ChevronRight,
  Star,
  Link as LinkIcon,
  ExternalLink,
} from 'lucide-react';
import { File } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { hasWriteAccess } from '@/lib/filePermissions';

interface FileContextMenuProps {
  file: File;
  position: { x: number; y: number };
  onClose: () => void;
  onDownload?: (file: File) => void;
  onRename?: (file: File) => void;
  onCopy?: (file: File) => void;
  onShare?: (file: File) => void;
  onStar?: (file: File) => void;
  onCopyLink?: (file: File) => void;
  onOrganize?: (file: File) => void;
  onInfo?: (file: File) => void;
  onOpen?: (file: File) => void;
  onDelete?: (file: File) => void;
}

export function FileContextMenu({
  file,
  position,
  onClose,
  onDownload,
  onRename,
  onCopy,
  onShare,
  onStar,
  onCopyLink,
  onOrganize,
  onInfo,
  onOpen,
  onDelete,
}: FileContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const canWrite = hasWriteAccess(file, user);
  const isStarred = user && file.starredBy?.includes(user._id);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let x = position.x;
      let y = position.y;

      if (x + rect.width > viewportWidth) {
        x = viewportWidth - rect.width - 10;
      }
      if (y + rect.height > viewportHeight) {
        y = viewportHeight - rect.height - 10;
      }

      menuRef.current.style.left = `${x}px`;
      menuRef.current.style.top = `${y}px`;
    }
  }, [position]);

  const menuItems = [
    {
      label: 'Open',
      icon: null,
      hasArrow: false,
      onClick: () => onOpen && onOpen(file),
    },
    {
      label: 'Open in new tab',
      icon: ExternalLink,
      hasArrow: false,
      onClick: () => window.open(file.url, '_blank'),
    },
    {
      type: 'divider',
    },
    {
      label: 'Share',
      icon: Share2,
      hasArrow: false,
      onClick: () => onShare && onShare(file),
      hidden: !canWrite,
    },
    {
      label: 'Get link',
      icon: LinkIcon,
      hasArrow: false,
      onClick: () => onCopyLink && onCopyLink(file),
    },
    {
      label: 'Move to',
      icon: Folder,
      hasArrow: true,
      onClick: () => onOrganize && onOrganize(file),
    },
    {
      label: isStarred ? 'Remove from starred' : 'Add to starred',
      icon: Star,
      hasArrow: false,
      onClick: () => onStar && onStar(file),
    },
    {
      label: 'Rename',
      icon: Edit,
      hasArrow: false,
      onClick: () => onRename && onRename(file),
      hidden: !canWrite,
    },
    {
      label: 'View details',
      icon: Info,
      hasArrow: false,
      onClick: () => onInfo && onInfo(file),
    },
    {
      type: 'divider',
    },
    {
      label: 'Make a copy',
      icon: Copy,
      hasArrow: false,
      onClick: () => onCopy && onCopy(file),
    },
    {
      label: 'Download',
      icon: Download,
      hasArrow: false,
      onClick: () => onDownload && onDownload(file),
    },
    {
      type: 'divider',
    },
    {
      label: 'Move to trash',
      icon: Trash2,
      hasArrow: false,
      onClick: () => onDelete && onDelete(file),
      hidden: !canWrite,
    },
  ].filter((item) => !('hidden' in item && item.hidden));

  return (
    <div
      ref={menuRef}
      className="fixed bg-white rounded-lg shadow-[0_2px_6px_rgba(0,0,0,.15),0_1px_2px_rgba(0,0,0,.3)] py-2 min-w-[200px] z-[1000]"
      style={{ left: position.x, top: position.y }}
    >
      {menuItems.map((item, index) => {
        if (item.type === 'divider') {
          return (
            <div
              key={`divider-${index}`}
              className="h-px bg-[#e5e5e5] my-2"
            />
          );
        }

        const Icon = item.icon;
        const isDisabled = ('disabled' in item && item.disabled) as boolean;
        const isGrayed = ('grayed' in item && item.grayed) as boolean;
        return (
          <button
            key={index}
            onClick={() => {
              if (!isDisabled && 'onClick' in item && item.onClick) {
                item.onClick();
                onClose();
              }
            }}
            disabled={!!isDisabled}
            className={`w-full h-10 px-4 flex items-center justify-between text-sm transition-colors ${
              isDisabled || isGrayed
                ? 'text-[#80868b] cursor-not-allowed'
                : 'text-[#202124] hover:bg-[#f1f3f4]'
            }`}
          >
            <div className="flex items-center gap-3">
              {Icon && <Icon size={18} className="text-[#5f6368]" />}
              <span>{item.label}</span>
            </div>
            {item.hasArrow && (
              <ChevronRight size={16} className="text-[#5f6368]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
