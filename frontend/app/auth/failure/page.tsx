'use client';

import { Box, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthFailurePage() {
  const router = useRouter();

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
        backgroundColor: '#ffffff',
        color: '#202124',
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 400, color: '#ea4335', mb: 2 }}>
          Authentication failed
        </Typography>
        <Typography variant="body1" sx={{ color: '#5f6368', mb: 2 }}>
          Please try again later.
        </Typography>
        <Typography variant="body2" sx={{ color: '#80868b', fontSize: '0.875rem' }}>
          Redirecting to home...
        </Typography>
      </Box>
    </Box>
  );
}
