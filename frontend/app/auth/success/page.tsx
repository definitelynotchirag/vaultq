'use client';

import { Box, Typography, CircularProgress } from '@mui/material';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function AuthSuccessPage() {
  const router = useRouter();
  const { refreshUser, user, loading } = useAuth();
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
        backgroundColor: '#ffffff',
        color: '#202124',
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress sx={{ color: '#1a73e8', mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 400, mb: 1 }}>
          Authentication successful!
        </Typography>
        <Typography variant="body2" sx={{ color: '#5f6368' }}>
          Redirecting to Drive...
        </Typography>
      </Box>
    </Box>
  );
}
