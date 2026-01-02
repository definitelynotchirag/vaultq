'use client';

import { Box, Button, Typography, CircularProgress, Container } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { getColors } from '@/lib/colors';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignInPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { mode } = useCustomTheme();
  const colors = getColors(mode);

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleSignIn = () => {
    api.auth.login();
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: colors.background.default,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ color: colors.primary.main, mb: 2 }} />
          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
            Loading...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (user) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: colors.background.default,
      }}
    >
      <Container maxWidth="sm" sx={{ px: { xs: 3, sm: 4 } }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <svg width="80" height="80" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 12C8 10.8954 8.89543 10 10 10H16.1716C16.702 10 17.2107 10.2107 17.5858 10.5858L21.4142 14.4142C21.7893 14.7893 22.298 15 22.8284 15H30C31.1046 15 32 15.8954 32 17V28C32 29.1046 31.1046 30 30 30H10C8.89543 30 8 29.1046 8 28V12Z" fill={colors.primary.light}/>
              <path d="M20 10V15C20 16.1046 20.8954 17 22 17H27L20 10Z" fill={mode === 'dark' ? colors.primary.main : '#AECBFA'}/>
            </svg>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 400, color: colors.text.primary, mb: 1 }}>
            Welcome to VaultQ
          </Typography>
          <Typography variant="body1" sx={{ color: colors.text.secondary }}>
            Your secure cloud storage solution
          </Typography>
        </Box>

        <Box
          sx={{
            backgroundColor: colors.background.paper,
            border: `1px solid ${colors.border.light}`,
            borderRadius: 2,
            p: 3,
            boxShadow: colors.shadow.light,
          }}
        >
          <Button
            onClick={handleSignIn}
            fullWidth
            variant="outlined"
            sx={{
              height: 48,
              borderColor: colors.border.light,
              color: colors.text.primary,
              backgroundColor: colors.background.paper,
              textTransform: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              '&:hover': {
                borderColor: colors.border.light,
                backgroundColor: colors.background.hover,
                boxShadow: colors.shadow.light,
              },
              '&:focus': {
                outline: `2px solid ${colors.primary.main}`,
                outlineOffset: 2,
              },
            }}
            startIcon={
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            }
          >
            Sign in with Google
          </Button>
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: colors.text.secondary, fontSize: '0.75rem' }}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
