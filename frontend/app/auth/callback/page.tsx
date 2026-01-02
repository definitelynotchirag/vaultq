'use client';

import { Box, Typography, CircularProgress } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { getColors } from '@/lib/colors';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { user, loading, refreshUser } = useAuth();
  const { mode } = useCustomTheme();
  const colors = getColors(mode);

  useEffect(() => {
    const checkAuth = async () => {
      await refreshUser();
      if (user) {
        router.push('/');
      } else {
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    };

    checkAuth();
  }, [user, router, refreshUser]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: colors.background.default,
        color: colors.text.primary,
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress sx={{ color: colors.primary.main, mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 400, mb: 1, color: colors.text.primary }}>
          Authenticating...
        </Typography>
        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
          Please wait while we verify your account.
        </Typography>
      </Box>
    </Box>
  );
}
