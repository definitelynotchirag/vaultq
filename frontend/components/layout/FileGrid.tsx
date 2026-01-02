'use client';

import { FileCard } from '@/components/files/FileCard';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { getColors } from '@/lib/colors';
import { File } from '@/types';
import { Box, Grid, Skeleton, Typography, useMediaQuery, useTheme } from '@mui/material';

interface FileGridProps {
  files: File[];
  onFileClick?: (file: File) => void;
  onFileMenuClick?: (file: File, event: React.MouseEvent) => void;
  onFileDoubleClick?: (file: File) => void;
  onFileStar?: (file: File) => void;
  loading?: boolean;
}

export function FileGrid({
  files,
  onFileClick,
  onFileMenuClick,
  onFileDoubleClick,
  onFileStar,
  loading = false,
}: FileGridProps) {
  const theme = useTheme();
  const { mode } = useCustomTheme();
  const colors = getColors(mode);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  if (loading) {
    return (
      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3, lg: 3.75 }}>
        {[...Array(10)].map((_, i) => (
          <Grid item xs={6} sm={4} md={3} lg={2.4} key={i}>
            <Box
              sx={{
                border: `1px solid ${colors.border.default}`,
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <Skeleton
                variant="rectangular"
                sx={{
                  bgcolor: colors.background.hover,
                  height: { xs: 140, sm: 160, md: 180 },
                }}
              />
              <Box sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                <Skeleton variant="text" width="80%" height={16} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="60%" height={12} />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (files.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 8, md: 10 },
          color: colors.text.secondary,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: '3rem', md: '3.75rem' },
            mb: 2,
          }}
        >
          📁
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mb: 1,
            color: colors.text.primary,
            fontSize: { xs: '1rem', md: '1.125rem' },
          }}
        >
          No files yet
        </Typography>
        <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
          Upload files to get started
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={{ xs: 2, sm: 2.5, md: 3, lg: 3.75 }}>
      {files.map((file) => (
        <Grid item xs={6} sm={4} md={3} lg={2.4} key={file._id}>
          <FileCard
            file={file}
            onClick={onFileClick}
            onMenuClick={onFileMenuClick}
            onDoubleClick={onFileDoubleClick}
            onStar={onFileStar}
          />
        </Grid>
      ))}
    </Grid>
  );
}
