'use client';

import { api } from '@/lib/api';
import { colors } from '@/lib/colors';
import { triggerDownload } from '@/lib/utils';
import { File } from '@/types';
import {
    Check,
    Close,
    Download,
    Link as LinkIcon,
} from '@mui/icons-material';
import {
    AppBar,
    Box,
    Button,
    CircularProgress,
    IconButton,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';

interface FileViewerProps {
  isOpen: boolean;
  file: File | null;
  onClose: () => void;
  isSharedView?: boolean;
}

export function FileViewer({ isOpen, file, onClose, isSharedView = false }: FileViewerProps) {
  const [viewUrl, setViewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (isOpen && file) {
      loadViewUrl();
    } else {
      setViewUrl(null);
      setError(null);
    }
  }, [isOpen, file, isSharedView]);

  const loadViewUrl = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const response = isSharedView
        ? await api.files.getSharedFileViewUrl(file._id)
        : await api.files.getViewUrl(file._id);
      if (response.success && response.viewUrl) {
        setViewUrl(response.viewUrl);
      }
    } catch (err: any) {
      console.error('FileViewer loadViewUrl error:', err);
      setError(err.message || 'Failed to load file');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!file) return;

    try {
      const response = isSharedView
        ? await api.files.getSharedFileDownloadUrl(file._id)
        : await api.files.downloadFile(file._id);
      if (response.success && response.downloadUrl) {
        await triggerDownload(response.downloadUrl, file.originalName);
      }
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const handleCopyLink = async () => {
    if (!file) return;
    const shareableUrl = api.files.getShareableUrl(file._id);
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const getFileExtension = (fileName: string) => {
    return fileName.split('.').pop()?.toLowerCase() || '';
  };

  const isImage = (fileName: string) => {
    const ext = getFileExtension(fileName);
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
  };

  const isPdf = (fileName: string) => {
    return getFileExtension(fileName) === 'pdf';
  };

  const isVideo = (fileName: string) => {
    const ext = getFileExtension(fileName);
    return ['mp4', 'mov', 'avi', 'webm'].includes(ext);
  };

  if (!isOpen || !file) return null;

  const canView = isImage(file.originalName) || isPdf(file.originalName) || isVideo(file.originalName);

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        backgroundColor: colors.background.dark,
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppBar
        position="static"
        sx={{
          backgroundColor: colors.background.darkSecondary,
          borderBottom: `1px solid ${colors.border.dark}`,
        }}
      >
        <Toolbar 
          sx={{ 
            gap: isMobile ? 0.5 : 1.5,
            minHeight: isMobile ? '44px !important' : '48px !important',
            height: isMobile ? '44px' : '48px',
            px: isMobile ? 1 : 2,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              flex: 1,
              color: colors.text.white,
              fontWeight: 400,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: isMobile ? '12px' : '14px',
            }}
          >
            {file.originalName}
          </Typography>
          {!isMobile && (
            <Button
              onClick={handleCopyLink}
              startIcon={copied ? <Check sx={{ fontSize: 18 }} /> : <LinkIcon sx={{ fontSize: 18 }} />}
              sx={{
                color: colors.text.white,
                backgroundColor: copied ? colors.success.main : 'transparent',
                textTransform: 'none',
                fontSize: '14px',
                px: 1.5,
                py: 0.75,
                minWidth: 'auto',
                '&:hover': {
                  backgroundColor: copied ? colors.success.main : colors.overlay.white10,
                },
              }}
            >
              {copied ? 'Copied' : 'Copy link'}
            </Button>
          )}
          <Button
            onClick={handleDownload}
            startIcon={<Download sx={{ fontSize: isMobile ? 16 : 18 }} />}
            sx={{
              color: colors.text.white,
              textTransform: 'none',
              fontSize: isMobile ? '12px' : '14px',
              px: isMobile ? 1 : 1.5,
              py: isMobile ? 0.5 : 0.75,
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: colors.overlay.white10,
              },
            }}
          >
            {isMobile ? '' : 'Download'}
          </Button>
          <IconButton
            onClick={onClose}
            sx={{
              color: colors.text.white,
              ml: 0.5,
              '&:hover': {
                backgroundColor: colors.overlay.white10,
              },
            }}
          >
            <Close sx={{ fontSize: 20 }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          p: isMobile ? 1 : 2,
        }}
      >
        {loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isMobile ? 1.5 : 2 }}>
            <CircularProgress sx={{ color: colors.primary.main }} size={isMobile ? 40 : 48} />
            <Typography variant={isMobile ? 'body1' : 'h6'} sx={{ color: colors.text.white, fontWeight: 500, fontSize: isMobile ? '14px' : 'inherit' }}>
              Loading...
            </Typography>
          </Box>
        )}

        {error && (
          <Typography
            variant={isMobile ? 'body1' : 'h6'}
            sx={{
              color: colors.error.main,
              fontWeight: 500,
              backgroundColor: colors.error.light,
              px: isMobile ? 2 : 3,
              py: isMobile ? 1 : 1.5,
              borderRadius: 2,
              border: `1px solid ${colors.error.main}`,
              fontSize: isMobile ? '14px' : 'inherit',
            }}
          >
            {error}
          </Typography>
        )}

        {!loading && !error && viewUrl && canView && (
          <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isPdf(file.originalName) ? (
              <iframe
                src={viewUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: 8,
                  backgroundColor: colors.background.default,
                  boxShadow: colors.shadow.heavy,
                }}
                title={file.originalName}
              />
            ) : isImage(file.originalName) ? (
              <Box
                component="img"
                src={viewUrl}
                alt={file.originalName}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: 2,
                  boxShadow: colors.shadow.heavy,
                }}
              />
            ) : isVideo(file.originalName) ? (
              <Box
                component="video"
                src={viewUrl}
                controls
                sx={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: colors.shadow.heavy,
                  backgroundColor: colors.background.dark,
                }}
              />
            ) : null}
          </Box>
        )}

        {!loading && !error && viewUrl && !canView && (
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                width: isMobile ? 60 : 80,
                height: isMobile ? 60 : 80,
                backgroundColor: colors.overlay.white05,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: isMobile ? 2 : 3,
              }}
            >
              <Close sx={{ fontSize: isMobile ? 30 : 40, color: colors.overlay.white02 }} />
            </Box>
            <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ color: colors.text.white, fontWeight: 500, mb: 1, fontSize: isMobile ? '18px' : 'inherit' }}>
              No preview available
            </Typography>
            <Typography variant="body1" sx={{ color: colors.text.disabled, mb: isMobile ? 3 : 4, fontSize: isMobile ? '14px' : 'inherit', px: isMobile ? 2 : 0 }}>
              This file type cannot be viewed in the browser.
            </Typography>
            <Button
              onClick={handleDownload}
              variant="contained"
              startIcon={<Download sx={{ fontSize: isMobile ? 18 : 24 }} />}
              sx={{
                backgroundColor: colors.primary.main,
                '&:hover': {
                  backgroundColor: colors.primary.hover,
                },
                px: isMobile ? 3 : 4,
                py: isMobile ? 1 : 1.5,
                boxShadow: colors.shadow.heavy,
                fontSize: isMobile ? '14px' : 'inherit',
              }}
            >
              Download to view
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
