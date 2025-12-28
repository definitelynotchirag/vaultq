'use client';

import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#ffffff',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ color: '#1a73e8', mb: 2 }} />
          <Typography variant="body2" sx={{ color: '#5f6368' }}>
            Loading...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
