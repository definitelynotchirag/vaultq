'use client';

import { Box, Typography, CircularProgress } from '@mui/material';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { getColors } from '@/lib/colors';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function AuthSuccessPage() {
  const router = useRouter();
  const { refreshUser, user, loading } = useAuth();
  const { mode } = useCustomTheme();
  const colors = getColors(mode);
  const hasRedirected = useRef(false);

  useEffect(() => {
    const handleAuth = async () => {
      if (hasRedirected.current) return;
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        await refreshUser();
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (!hasRedirected.current) {
          hasRedirected.current = true;
          router.push('/');
        }
      } catch (error) {
        console.error('Auth refresh error:', error);
        setTimeout(() => {
          if (!hasRedirected.current) {
            hasRedirected.current = true;
            router.push('/');
          }
        }, 1000);
      }
    };

    handleAuth();
  }, [router, refreshUser]);

  useEffect(() => {
    if (user && !loading && !hasRedirected.current) {
      hasRedirected.current = true;
      router.push('/');
    }
  }, [user, loading, router]);

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
          Authentication successful!
        </Typography>
        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
          Redirecting to Drive...
        </Typography>
      </Box>
    </Box>
  );
}
