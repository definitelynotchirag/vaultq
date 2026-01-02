'use client';

import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { getColors } from '@/lib/colors';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FileViewer } from '@/components/files/FileViewer';
import { api } from '@/lib/api';
import { File } from '@/types';

export default function SharedFilePage() {
  const params = useParams();
  const router = useRouter();
  const { mode } = useCustomTheme();
  const colors = getColors(mode);
  const fileId = params.fileId as string;
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fileId) return;

    const loadFile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.files.getSharedFile(fileId);
        if (response.success && response.file) {
          setFile(response.file);
        }
      } catch (err: any) {
        if (err.status === 401) {
          setError('Please log in to view this file');
        } else if (err.status === 403) {
          setError('You do not have permission to view this file');
        } else if (err.status === 404) {
          setError('File not found');
        } else {
          setError(err.message || 'Failed to load file');
        }
      } finally {
        setLoading(false);
      }
    };

    loadFile();
  }, [fileId]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: colors.background.default,
          color: colors.text.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ color: colors.primary.main, mb: 2 }} />
          <Typography variant="h6" sx={{ color: colors.text.primary }}>Loading...</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: colors.background.default,
          color: colors.text.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2, color: colors.error.main }}>
            {error}
          </Typography>
          {error.includes('log in') && (
            <Button
              onClick={() => {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
                window.location.href = `${API_URL}/auth/google`;
              }}
              variant="contained"
              sx={{
                backgroundColor: colors.primary.main,
                '&:hover': { backgroundColor: colors.primary.hover },
                textTransform: 'none',
                mb: 2,
              }}
            >
              Log In
            </Button>
          )}
          <Button
            onClick={() => router.push('/')}
            variant="outlined"
            sx={{
              borderColor: colors.border.light,
              color: colors.text.primary,
              '&:hover': {
                borderColor: colors.border.light,
                backgroundColor: colors.background.hover,
              },
              textTransform: 'none',
            }}
          >
            Go Home
          </Button>
        </Box>
      </Box>
    );
  }

  if (!file) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: colors.background.default,
          color: colors.text.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h6" sx={{ color: colors.text.primary }}>File not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.background.default }}>
      <FileViewer
        isOpen={true}
        file={file}
        onClose={() => router.push('/')}
        isSharedView={true}
      />
    </Box>
  );
}
