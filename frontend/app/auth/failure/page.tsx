'use client';

import { Box, Typography } from '@mui/material';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { getColors } from '@/lib/colors';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthFailurePage() {
  const router = useRouter();
  const { mode } = useCustomTheme();
  const colors = getColors(mode);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

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
        <Typography variant="h6" sx={{ fontWeight: 400, color: colors.error.main, mb: 2 }}>
          Authentication failed
        </Typography>
        <Typography variant="body1" sx={{ color: colors.text.secondary, mb: 2 }}>
          Please try again later.
        </Typography>
        <Typography variant="body2" sx={{ color: colors.text.disabled, fontSize: '0.875rem' }}>
          Redirecting to home...
        </Typography>
      </Box>
    </Box>
  );
}
