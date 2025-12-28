'use client';

import { Box, Typography, CircularProgress } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { user, loading, refreshUser } = useAuth();

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
        backgroundColor: '#ffffff',
        color: '#202124',
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress sx={{ color: '#1a73e8', mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 400, mb: 1 }}>
          Authenticating...
        </Typography>
        <Typography variant="body2" sx={{ color: '#5f6368' }}>
          Please wait while we verify your account.
        </Typography>
      </Box>
    </Box>
  );
}
