'use client';

import {
  Toolbar,
  Typography,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Share as ShareIcon,
  Download,
  Folder,
  Star,
  Delete,
  MoreVert,
} from '@mui/icons-material';
import { File } from '@/types';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  if (selectedCount === 0) return null;

  return (
    <Toolbar
      sx={{
        position: 'fixed',
        top: 64,
        left: { xs: 0, md: 'var(--sidebar-width, 256px)' },
        right: 0,
        height: { xs: 56, sm: 64 },
        backgroundColor: '#e8f0fe',
        borderBottom: '1px solid #c2e7ff',
        zIndex: 30,
        transition: 'left 300ms ease',
        px: { xs: 1.5, sm: 2, md: 3 },
        gap: { xs: 1.5, sm: 2, md: 3 },
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
          color: '#001d35',
          whiteSpace: 'nowrap',
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
        }}
      >
        {selectedCount} {selectedCount === 1 ? 'item' : 'items'}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 0.5, sm: 1 },
          flex: 1,
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
        }}
      >
        {onShare && (
          <IconButton
            onClick={onShare}
            sx={{
              color: '#001d35',
              '&:hover': { backgroundColor: 'rgba(1,87,155,0.08)' },
              px: { xs: 1.25, sm: 1.5, md: 2 },
              minWidth: { xs: 40, sm: 'auto' },
            }}
            size="small"
          >
            <ShareIcon fontSize={isMobile ? 'small' : 'medium'} />
            {!isMobile && (
              <Typography
                variant="body2"
                sx={{ ml: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                Share
              </Typography>
            )}
          </IconButton>
        )}

        {onDownload && (
          <IconButton
            onClick={onDownload}
            sx={{
              color: '#001d35',
              '&:hover': { backgroundColor: 'rgba(1,87,155,0.08)' },
              px: { xs: 1.25, sm: 1.5, md: 2 },
              minWidth: { xs: 40, sm: 'auto' },
            }}
            size="small"
          >
            <Download fontSize={isMobile ? 'small' : 'medium'} />
            {!isMobile && (
              <Typography
                variant="body2"
                sx={{ ml: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                Download
              </Typography>
            )}
          </IconButton>
        )}

        {onMove && (
          <IconButton
            onClick={onMove}
            sx={{
              color: '#001d35',
              '&:hover': { backgroundColor: 'rgba(1,87,155,0.08)' },
              px: { xs: 1.25, sm: 1.5, md: 2 },
              display: { xs: 'none', md: 'flex' },
            }}
            size="small"
          >
            <Folder fontSize="medium" />
            <Typography variant="body2" sx={{ ml: 1 }}>
              Move
            </Typography>
          </IconButton>
        )}

        {onStar && (
          <IconButton
            onClick={onStar}
            sx={{
              color: '#001d35',
              '&:hover': { backgroundColor: 'rgba(1,87,155,0.08)' },
              px: { xs: 1.25, sm: 1.5, md: 2 },
              minWidth: { xs: 40, sm: 'auto' },
            }}
            size="small"
          >
            <Star fontSize={isMobile ? 'small' : 'medium'} />
            {!isMobile && (
              <Typography
                variant="body2"
                sx={{ ml: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                Star
              </Typography>
            )}
          </IconButton>
        )}

        {onDelete && (
          <IconButton
            onClick={onDelete}
            sx={{
              color: '#001d35',
              '&:hover': { backgroundColor: 'rgba(1,87,155,0.08)' },
              px: { xs: 1.25, sm: 1.5, md: 2 },
              minWidth: { xs: 40, sm: 'auto' },
            }}
            size="small"
          >
            <Delete fontSize={isMobile ? 'small' : 'medium'} />
            {!isMobile && (
              <Typography
                variant="body2"
                sx={{ ml: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                Delete
              </Typography>
            )}
          </IconButton>
        )}

        {onMore && (
          <IconButton
            onClick={onMore}
            sx={{
              color: '#001d35',
              '&:hover': { backgroundColor: 'rgba(1,87,155,0.08)' },
              px: { xs: 1.25, sm: 1.5, md: 2 },
              display: { xs: 'none', md: 'flex' },
            }}
            size="small"
          >
            <MoreVert fontSize="medium" />
            <Typography variant="body2" sx={{ ml: 1 }}>
              More
            </Typography>
          </IconButton>
        )}
      </Box>
    </Toolbar>
  );
}
