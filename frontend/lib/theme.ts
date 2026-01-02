'use client';

import { getColors } from '@/lib/colors';
import { createTheme } from '@mui/material/styles';

export function createAppTheme(mode: 'light' | 'dark' = 'light') {
  const colors = getColors(mode);
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.primary.main,
        light: colors.primary.light,
        dark: colors.primary.dark,
        contrastText: colors.primary.contrast,
      },
      secondary: {
        main: colors.secondary.main,
        light: colors.secondary.light,
        dark: colors.secondary.dark,
        contrastText: colors.secondary.contrast,
      },
      background: {
        default: colors.background.default,
        paper: colors.background.paper,
      },
      text: {
        primary: colors.text.primary,
        secondary: colors.text.secondary,
        disabled: colors.text.disabled,
      },
      divider: colors.border.default,
      action: {
        hover: colors.background.hover,
        selected: colors.background.selected,
        disabled: colors.background.hover,
      },
      error: {
        main: colors.error.main,
      },
      warning: {
        main: colors.warning.main,
      },
      info: {
        main: colors.info.main,
      },
      success: {
        main: colors.success.main,
      },
    },
    typography: {
      fontFamily: [
        'Roboto',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontSize: '2rem',
        fontWeight: 400,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: '1.5rem',
        fontWeight: 400,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: '1.25rem',
        fontWeight: 400,
        lineHeight: 1.4,
      },
      h4: {
        fontSize: '1.125rem',
        fontWeight: 400,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: 1.5,
      },
      h6: {
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: 1.5,
      },
      body1: {
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '0.75rem',
        fontWeight: 400,
        lineHeight: 1.5,
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    spacing: 8,
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 24,
            padding: '8px 16px',
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          contained: {
            boxShadow: isDark
              ? '0 1px 2px 0 rgba(0,0,0,.5), 0 1px 3px 1px rgba(0,0,0,.3)'
              : '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)',
            '&:hover': {
              boxShadow: isDark
                ? '0 1px 3px 0 rgba(0,0,0,.5), 0 4px 8px 3px rgba(0,0,0,.3)'
                : '0 1px 3px 0 rgba(60,64,67,.3), 0 4px 8px 3px rgba(60,64,67,.15)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            border: `1px solid ${colors.border.default}`,
            borderRadius: 8,
            '&:hover': {
              boxShadow: colors.shadow.medium,
              borderColor: 'transparent',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: colors.shadow.light,
            backgroundColor: isDark ? '#151515' : colors.background.default,
            color: colors.text.primary,
            borderBottom: isDark ? `1px solid ${colors.border.default}` : 'none',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: `1px solid ${colors.border.default}`,
            backgroundColor: colors.background.default,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 8,
            backgroundColor: colors.background.default,
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: colors.background.default,
            color: colors.text.primary,
          },
          html: {
            backgroundColor: colors.background.default,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
    },
  });
}

export const theme = createAppTheme('light');






