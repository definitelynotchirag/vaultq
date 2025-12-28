'use client';

import {
  Box,
  IconButton,
  Typography,
  CircularProgress,
  Button,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Close,
  Download,
  Link as LinkIcon,
  Check,
} from '@mui/icons-material';
import { api } from '@/lib/api';
import { colors } from '@/lib/colors';
import { File } from '@/types';
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
        window.open(response.downloadUrl, '_blank');
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

  if (!isOpen || !file) return null;

  const canView = isImage(file.originalName) || isPdf(file.originalName);

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
            gap: 1.5,
            minHeight: '48px !important',
            height: '48px',
            px: 2,
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
              fontSize: '14px',
            }}
          >
            {file.originalName}
          </Typography>
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
          <Button
            onClick={handleDownload}
            startIcon={<Download sx={{ fontSize: 18 }} />}
            sx={{
              color: colors.text.white,
              textTransform: 'none',
              fontSize: '14px',
              px: 1.5,
              py: 0.75,
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: colors.overlay.white10,
              },
            }}
          >
            Download
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
          p: 2,
        }}
      >
        {loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CircularProgress sx={{ color: colors.primary.main }} size={48} />
            <Typography variant="h6" sx={{ color: colors.text.white, fontWeight: 500 }}>
              Loading...
            </Typography>
          </Box>
        )}

        {error && (
          <Typography
            variant="h6"
            sx={{
              color: colors.error.main,
              fontWeight: 500,
              backgroundColor: colors.error.light,
              px: 3,
              py: 1.5,
              borderRadius: 2,
              border: `1px solid ${colors.error.main}`,
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
            ) : null}
          </Box>
        )}

        {!loading && !error && viewUrl && !canView && (
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                backgroundColor: colors.overlay.white05,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <Close sx={{ fontSize: 40, color: colors.overlay.white02 }} />
            </Box>
            <Typography variant="h5" sx={{ color: colors.text.white, fontWeight: 500, mb: 1 }}>
              No preview available
            </Typography>
            <Typography variant="body1" sx={{ color: colors.text.disabled, mb: 4 }}>
              This file type cannot be viewed in the browser.
            </Typography>
            <Button
              onClick={handleDownload}
              variant="contained"
              startIcon={<Download />}
              sx={{
                backgroundColor: colors.primary.main,
                '&:hover': {
                  backgroundColor: colors.primary.hover,
                },
                px: 4,
                py: 1.5,
                boxShadow: colors.shadow.heavy,
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
