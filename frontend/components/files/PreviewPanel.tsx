'use client';

import {
  Drawer,
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Close,
  Folder,
  Description,
  TableChart,
  Slideshow,
  PictureAsPdf,
  Image as ImageIcon,
  VideoFile,
} from '@mui/icons-material';
import { File as FileType } from '@/types';
import { formatFileSize, formatDate } from '@/lib/utils';

interface PreviewPanelProps {
  file: FileType | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PreviewPanel({ file, isOpen, onClose }: PreviewPanelProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  if (!isOpen || !file) return null;

  const getFileIcon = () => {
    const extension = file.originalName.split('.').pop()?.toLowerCase() || '';
    const iconSize = isMobile ? 48 : 64;

    if (extension === 'folder' || !extension) {
      return <Folder sx={{ fontSize: iconSize, color: '#5f6368' }} />;
    }

    if (['pdf'].includes(extension)) {
      return <PictureAsPdf sx={{ fontSize: iconSize, color: '#ea4335' }} />;
    }

    if (['doc', 'docx'].includes(extension)) {
      return <Description sx={{ fontSize: iconSize, color: '#4285f4' }} />;
    }

    if (['xls', 'xlsx'].includes(extension)) {
      return <TableChart sx={{ fontSize: iconSize, color: '#0f9d58' }} />;
    }

    if (['ppt', 'pptx'].includes(extension)) {
      return <Slideshow sx={{ fontSize: iconSize, color: '#f4b400' }} />;
    }

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return <ImageIcon sx={{ fontSize: iconSize, color: '#4285f4' }} />;
    }

    if (['mp4', 'mov', 'avi', 'webm'].includes(extension)) {
      return <VideoFile sx={{ fontSize: iconSize, color: '#ea4335' }} />;
    }

    return <Description sx={{ fontSize: iconSize, color: '#5f6368' }} />;
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      variant="persistent"
      sx={{
        width: isOpen ? { xs: '100%', sm: 340, md: 360 } : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 340, md: 360 },
          top: 64,
          height: 'calc(100vh - 64px)',
          borderLeft: '1px solid #e5e5e5',
          boxShadow: { xs: 'none', sm: 'none', md: '0 2px 8px rgba(0,0,0,0.1)' },
        },
      }}
    >
      <Box sx={{ p: { xs: 2, sm: 2.5, md: 3 }, overflowY: 'auto', height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: { xs: 2, sm: 2.5, md: 3 } }}>
          <Typography variant="h6" sx={{ fontWeight: 400, color: '#202124', fontSize: { xs: '1rem', sm: '1.125rem' } }}>
            Details
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: '#5f6368',
              '&:hover': { backgroundColor: '#f1f3f4' },
            }}
            size="small"
          >
            <Close />
          </IconButton>
        </Box>

        <Box
          sx={{
            width: '100%',
            height: { xs: 160, sm: 180, md: 200 },
            bgcolor: '#f1f3f4',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: { xs: 2, sm: 2.5, md: 3 },
          }}
        >
          <Box sx={{ transform: { xs: 'scale(0.9)', sm: 'scale(1)' } }}>
            {getFileIcon()}
          </Box>
        </Box>

        <Box sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.6875rem',
              fontWeight: 500,
              color: '#5f6368',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'block',
              mb: 1,
            }}
          >
            Name
          </Typography>
          <Typography variant="body2" sx={{ color: '#202124', wordBreak: 'break-word' }}>
            {file.originalName}
          </Typography>
        </Box>

        <Box sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.6875rem',
              fontWeight: 500,
              color: '#5f6368',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'block',
              mb: 1,
            }}
          >
            Size
          </Typography>
          <Typography variant="body2" sx={{ color: '#202124' }}>
            {formatFileSize(file.size)}
          </Typography>
        </Box>

        <Box sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.6875rem',
              fontWeight: 500,
              color: '#5f6368',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'block',
              mb: 1,
            }}
          >
            Modified
          </Typography>
          <Typography variant="body2" sx={{ color: '#202124' }}>
            {formatDate(file.updatedAt)}
          </Typography>
        </Box>

        <Box sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.6875rem',
              fontWeight: 500,
              color: '#5f6368',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'block',
              mb: 1,
            }}
          >
            Created
          </Typography>
          <Typography variant="body2" sx={{ color: '#202124' }}>
            {formatDate(file.createdAt)}
          </Typography>
        </Box>

        <Box sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.6875rem',
              fontWeight: 500,
              color: '#5f6368',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'block',
              mb: 1,
            }}
          >
            Owner
          </Typography>
          <Typography variant="body2" sx={{ color: '#202124' }}>
            You
          </Typography>
        </Box>

        {file.public && (
          <Box>
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.6875rem',
                fontWeight: 500,
                color: '#5f6368',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'block',
                mb: 1,
              }}
            >
              Sharing
            </Typography>
            <Typography variant="body2" sx={{ color: '#202124' }}>
              Anyone with the link can view
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
