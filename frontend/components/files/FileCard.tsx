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
  Card,
  CardContent,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';

interface FileCardProps {
  file: FileType;
  onClick?: (file: FileType) => void;
  onMenuClick?: (file: FileType, event: React.MouseEvent) => void;
  onDoubleClick?: (file: FileType) => void;
  onStar?: (file: FileType) => void;
}

export function FileCard({
  file,
  onClick,
  onMenuClick,
  onDoubleClick,
  onStar,
}: FileCardProps) {
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
    const iconSize = isMobile ? 36 : 48;

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
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      onDoubleClick={() => onDoubleClick && onDoubleClick(file)}
      sx={{
        cursor: 'pointer',
        border: `1px solid ${colors.border.default}`,
        boxShadow: 'none',
        transition: 'all 200ms ease',
        '&:hover': {
          boxShadow: colors.shadow.medium,
          borderColor: 'transparent',
        },
        p: { xs: 0.5, sm: 1, md: 2 },
      }}
    >
      <Box
        sx={{
          height: { xs: 140, sm: 160, md: 180 },
          bgcolor: colors.background.hover,
          borderRadius: '8px 8px 0 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Box sx={{ transform: { xs: 'scale(0.75)', sm: 'scale(0.9)', md: 'scale(1)' } }}>
          {getFileIcon()}
        </Box>

        {!hovered && onStar && isStarred && (
          <IconButton
            onClick={handleStarClick}
            sx={{
              position: 'absolute',
              top: { xs: 8, sm: 12 },
              left: { xs: 8, sm: 12 },
              color: colors.warning.main,
              p: { xs: 0.75, sm: 1 },
            }}
            size="small"
          >
            <Star sx={{ fontSize: { xs: 18, sm: 20 }, fill: 'currentColor' }} />
          </IconButton>
        )}

        {hovered && (
          <>
            {onStar && (
              <IconButton
                onClick={handleStarClick}
                sx={{
                  position: 'absolute',
                  top: { xs: 8, sm: 12 },
                  right: { xs: 56, sm: 54 },
                  backgroundColor: isStarred ? colors.warning.light : colors.background.default,
                  color: isStarred ? colors.warning.main : colors.text.primary,
                  boxShadow: colors.shadow.card,
                  '&:hover': {
                    backgroundColor: isStarred ? colors.warning.lighter : colors.background.hover,
                  },
                  p: { xs: 0.75, sm: 1 },
                }}
                size="small"
              >
                {isStarred ? (
                  <Star
                    sx={{
                      fontSize: { xs: 16, sm: 18 },
                      fill: 'currentColor',
                    }}
                  />
                ) : (
                  <StarBorder
                    sx={{
                      fontSize: { xs: 16, sm: 18 },
                      color: 'currentColor',
                    }}
                  />
                )}
              </IconButton>
            )}
            <IconButton
              onClick={handleMenuClick}
              sx={{
                position: 'absolute',
                top: { xs: 8, sm: 12 },
                right: { xs: 8, sm: 12 },
                backgroundColor: colors.background.default,
                color: colors.text.secondary,
                boxShadow: colors.shadow.card,
                '&:hover': {
                  backgroundColor: colors.background.hover,
                },
                p: { xs: 0.75, sm: 1 },
              }}
              size="small"
            >
              <MoreVert sx={{ fontSize: { xs: 16, sm: 18 } }} />
            </IconButton>
          </>
        )}
      </Box>

      <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 }, '&:last-child': { pb: { xs: 1.5, sm: 2, md: 2.5 } } }}>
        <Typography
          variant="body2"
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            color: colors.text.primary,
            fontWeight: 400,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            mb: { xs: 0.5, sm: 0.75 },
          }}
        >
          {file.originalName}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 0.75 }, flexWrap: 'wrap' }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: { xs: '0.6875rem', sm: '0.75rem' },
              color: colors.text.secondary,
            }}
          >
            {formatDate(file.updatedAt)}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: { xs: '0.6875rem', sm: '0.75rem' },
              color: colors.text.secondary,
            }}
          >
            •
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: { xs: '0.6875rem', sm: '0.75rem' },
              color: colors.text.secondary,
            }}
          >
            {formatFileSize(file.size)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
