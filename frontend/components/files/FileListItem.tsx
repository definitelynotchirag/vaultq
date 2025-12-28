'use client';

import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/lib/colors';
import { formatDate, formatFileSize } from '@/lib/utils';
import { File as FileType } from '@/types';
import {
  Description,
  Folder,
  Image as ImageIcon,
  MoreVert,
  PictureAsPdf,
  Slideshow,
  Star,
  StarBorder,
  TableChart,
  VideoFile,
} from '@mui/icons-material';
import {
  Box,
  IconButton,
  TableCell,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';

interface FileListItemProps {
  file: FileType;
  onClick?: (file: FileType) => void;
  onMenuClick?: (file: FileType, event: React.MouseEvent) => void;
  onDoubleClick?: (file: FileType) => void;
  onStar?: (file: FileType) => void;
}

export function FileListItem({
  file,
  onClick,
  onMenuClick,
  onDoubleClick,
  onStar,
}: FileListItemProps) {
  const [hovered, setHovered] = useState(false);
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isStarred = user && file.starredBy?.includes(user._id);

  const handleClick = (e: React.MouseEvent) => {
    if (e.detail === 2 && onDoubleClick) {
      onDoubleClick(file);
    } else if (onClick) {
      onClick(file);
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
    const iconSize = isMobile ? 20 : 24;

    if (extension === 'folder' || !extension) {
      return <Folder sx={{ fontSize: iconSize, color: colors.fileType.folder }} />;
    }

    if (['pdf'].includes(extension)) {
      return <PictureAsPdf sx={{ fontSize: iconSize, color: colors.fileType.pdf }} />;
    }

    if (['doc', 'docx'].includes(extension)) {
      return <Description sx={{ fontSize: iconSize, color: colors.fileType.doc }} />;
    }

    if (['xls', 'xlsx'].includes(extension)) {
      return <TableChart sx={{ fontSize: iconSize, color: colors.fileType.sheet }} />;
    }

    if (['ppt', 'pptx'].includes(extension)) {
      return <Slideshow sx={{ fontSize: iconSize, color: colors.fileType.slide }} />;
    }

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return <ImageIcon sx={{ fontSize: iconSize, color: colors.fileType.image }} />;
    }

    if (['mp4', 'mov', 'avi', 'webm'].includes(extension)) {
      return <VideoFile sx={{ fontSize: iconSize, color: colors.fileType.video }} />;
    }

    return <Description sx={{ fontSize: iconSize, color: colors.fileType.default }} />;
  };

  return (
    <TableRow
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      onDoubleClick={() => onDoubleClick && onDoubleClick(file)}
      sx={{
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: colors.background.hover,
        },
        '& td': {
          borderBottom: `1px solid ${colors.border.light}`,
          py: { xs: 1, sm: 1.5 },
        },
      }}
    >
      <TableCell
        sx={{
          width: { xs: 'auto', sm: '50%' },
          minWidth: 0,
          maxWidth: { xs: 'none', sm: '50%' },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            {getFileIcon()}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                color: colors.text.primary,
                fontWeight: 400,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {file.originalName}
            </Typography>
            {isStarred && (
              <Star
                sx={{
                  fontSize: { xs: 14, sm: 16 },
                  color: colors.warning.main,
                  fill: colors.warning.main,
                  flexShrink: 0,
                }}
              />
            )}
          </Box>
        </Box>
      </TableCell>
      {!isMobile && (
        <TableCell
          sx={{
            width: '20%',
            color: colors.text.secondary,
            fontSize: { sm: '0.8125rem', md: '0.875rem' },
          }}
        >
          {formatFileSize(file.size)}
        </TableCell>
      )}
      {!isMobile && (
        <TableCell
          sx={{
            width: '20%',
            color: colors.text.secondary,
            fontSize: { sm: '0.8125rem', md: '0.875rem' },
          }}
        >
          {formatDate(file.updatedAt)}
        </TableCell>
      )}
      <TableCell
        align="right"
        sx={{
          width: { xs: 'auto', sm: '10%' },
          minWidth: { xs: 80, sm: 100 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: { xs: 0.5, sm: 1 },
          }}
        >
          {hovered && onStar && (
            <IconButton
              onClick={handleStarClick}
              sx={{
                color: isStarred ? colors.warning.main : colors.text.secondary,
                p: { xs: 0.5, sm: 0.75 },
                '&:hover': {
                  backgroundColor: isStarred ? colors.warning.light : colors.background.selected,
                },
              }}
              size="small"
            >
              {isStarred ? (
                <Star sx={{ fontSize: { xs: 16, sm: 18 }, fill: 'currentColor' }} />
              ) : (
                <StarBorder sx={{ fontSize: { xs: 16, sm: 18 } }} />
              )}
            </IconButton>
          )}
          <IconButton
            onClick={handleMenuClick}
            sx={{
              color: colors.text.secondary,
              p: { xs: 0.5, sm: 0.75 },
              '&:hover': {
                backgroundColor: colors.background.selected,
                color: colors.text.primary,
              },
            }}
            size="small"
          >
            <MoreVert sx={{ fontSize: { xs: 16, sm: 18 } }} />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
}

