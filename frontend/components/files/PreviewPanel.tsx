'use client';

import {
  Drawer,
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { getColors } from '@/lib/colors';
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
  const { mode } = useCustomTheme();
  const colors = getColors(mode);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  if (!isOpen || !file) return null;

  const getFileIcon = () => {
    const extension = file.originalName.split('.').pop()?.toLowerCase() || '';
    const iconSize = isMobile ? 48 : 64;

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
          borderLeft: `1px solid ${colors.border.default}`,
          backgroundColor: colors.background.paper,
          boxShadow: { xs: 'none', sm: 'none', md: colors.shadow.light },
        },
      }}
    >
      <Box sx={{ p: { xs: 2, sm: 2.5, md: 3 }, overflowY: 'auto', height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: { xs: 2, sm: 2.5, md: 3 } }}>
          <Typography variant="h6" sx={{ fontWeight: 400, color: colors.text.primary, fontSize: { xs: '1rem', sm: '1.125rem' } }}>
            Details
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: colors.text.secondary,
              '&:hover': { backgroundColor: colors.background.hover },
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
            bgcolor: colors.background.hover,
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
              color: colors.text.secondary,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'block',
              mb: 1,
            }}
          >
            Name
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.primary, wordBreak: 'break-word' }}>
            {file.originalName}
          </Typography>
        </Box>

        <Box sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.6875rem',
              fontWeight: 500,
              color: colors.text.secondary,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'block',
              mb: 1,
            }}
          >
            Size
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.primary }}>
            {formatFileSize(file.size)}
          </Typography>
        </Box>

        <Box sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.6875rem',
              fontWeight: 500,
              color: colors.text.secondary,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'block',
              mb: 1,
            }}
          >
            Modified
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.primary }}>
            {formatDate(file.updatedAt)}
          </Typography>
        </Box>

        <Box sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.6875rem',
              fontWeight: 500,
              color: colors.text.secondary,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'block',
              mb: 1,
            }}
          >
            Created
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.primary }}>
            {formatDate(file.createdAt)}
          </Typography>
        </Box>

        <Box sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.6875rem',
              fontWeight: 500,
              color: colors.text.secondary,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'block',
              mb: 1,
            }}
          >
            Owner
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.primary }}>
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
                color: colors.text.secondary,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'block',
                mb: 1,
              }}
            >
              Sharing
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.primary }}>
              Anyone with the link can view
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
