'use client';

import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { getColors } from '@/lib/colors';
import { hasWriteAccess } from '@/lib/filePermissions';
import { File } from '@/types';
import {
    ChevronRight,
    Delete,
    Download,
    Edit,
    Info,
    Link as LinkIcon,
    OpenInNew,
    Share,
    Star,
} from '@mui/icons-material';
import {
    Divider,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    useMediaQuery,
    useTheme,
} from '@mui/material';
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
  const { mode } = useCustomTheme();
  const colors = getColors(mode);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
        const shareableUrl = api.files.getShareableUrl(file._id);
        if (shareableUrl) {
          window.open(shareableUrl, '_blank', 'noopener,noreferrer');
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
          minWidth: { xs: 180, sm: 200 },
          boxShadow: colors.shadow.menu,
          border: `1px solid ${colors.border.default}`,
        },
      }}
      MenuListProps={{
        sx: { py: { xs: 0.25, sm: 0.5 } },
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
              minHeight: { xs: 44, sm: 40 },
              px: { xs: 1.5, sm: 2 },
              py: { xs: 0.75, sm: 0.5 },
              '&:hover': {
                backgroundColor: colors.background.hover,
              },
            }}
          >
            {Icon && (
              <ListItemIcon sx={{ minWidth: { xs: 32, sm: 36 }, color: colors.text.secondary }}>
                <Icon fontSize={isMobile ? 'small' : 'small'} />
              </ListItemIcon>
            )}
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                sx: {
                  fontSize: { xs: '0.8125rem', sm: '0.875rem' },
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
