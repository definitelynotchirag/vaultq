'use client';

import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  OpenInNew,
  Share,
  Link as LinkIcon,
  Star,
  Edit,
  Info,
  Download,
  Delete,
  ChevronRight,
} from '@mui/icons-material';
import { File } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/lib/colors';
import { hasWriteAccess } from '@/lib/filePermissions';
import { useEffect, useRef } from 'react';

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
  const { user } = useAuth();
  const canWrite = hasWriteAccess(file, user);
  const isStarred = user && file.starredBy?.includes(user._id);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const menuItems = [
    {
      label: 'Open',
      icon: null,
      hasArrow: false,
      onClick: () => onOpen && onOpen(file),
    },
    {
      label: 'Open in new tab',
      icon: OpenInNew,
      hasArrow: false,
      onClick: () => {
        if (file.url) {
          window.open(file.url, '_blank', 'noopener,noreferrer');
        }
      },
    },
    { type: 'divider' },
    {
      label: 'Share',
      icon: Share,
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
    { type: 'divider' },
    {
      label: 'Download',
      icon: Download,
      hasArrow: false,
      onClick: () => onDownload && onDownload(file),
    },
    { type: 'divider' },
    {
      label: 'Move to trash',
      icon: Delete,
      hasArrow: false,
      onClick: () => onDelete && onDelete(file),
      hidden: !canWrite,
    },
  ].filter((item) => !('hidden' in item && item.hidden));

  return (
    <Menu
      open={true}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={{ top: position.y, left: position.x }}
      ref={menuRef}
      PaperProps={{
        sx: {
          minWidth: 200,
          boxShadow: colors.shadow.menu,
          border: `1px solid ${colors.border.default}`,
        },
      }}
      MenuListProps={{
        sx: { py: 0.5 },
      }}
    >
      {menuItems.map((item, index) => {
        if (item.type === 'divider') {
          return <Divider key={`divider-${index}`} />;
        }

        const Icon = item.icon;
        return (
          <MenuItem
            key={index}
            onClick={() => {
              if ('onClick' in item && item.onClick) {
                item.onClick();
                onClose();
              }
            }}
            sx={{
              minHeight: 40,
              px: 2,
              '&:hover': {
                backgroundColor: colors.background.hover,
              },
            }}
          >
            {Icon && (
              <ListItemIcon sx={{ minWidth: 36, color: colors.text.secondary }}>
                <Icon fontSize="small" />
              </ListItemIcon>
            )}
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                sx: {
                  fontSize: '0.875rem',
                  color: colors.text.primary,
                },
              }}
            />
            {item.hasArrow && (
              <ChevronRight sx={{ fontSize: 16, color: colors.text.secondary, ml: 1 }} />
            )}
          </MenuItem>
        );
      })}
    </Menu>
  );
}
