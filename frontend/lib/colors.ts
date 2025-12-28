export const colors = {
  background: {
    default: '#ffffff',
    paper: '#ffffff',
    hover: '#f1f3f4',
    selected: '#e8eaed',
    light: '#f8f9fa',
    dark: '#1a1a1a',
    darkSecondary: '#2a2a2a',
    darkTertiary: '#3c3c3c',
  },
  text: {
    primary: '#202124',
    secondary: '#5f6368',
    disabled: '#80868b',
    white: '#ffffff',
  },
  border: {
    default: '#e5e5e5',
    light: '#dadce0',
    dark: '#3c3c3c',
  },
  primary: {
    main: '#1a73e8',
    light: '#4285f4',
    dark: '#174ea6',
    hover: '#1765cc',
    contrast: '#ffffff',
  },
  secondary: {
    main: '#5f6368',
    light: '#80868b',
    dark: '#3c4043',
    contrast: '#ffffff',
  },
  error: {
    main: '#ea4335',
    light: 'rgba(234,67,53,0.1)',
  },
  warning: {
    main: '#f4b400',
    light: '#feefc3',
    lighter: '#fde293',
  },
  success: {
    main: '#0f9d58',
  },
  info: {
    main: '#4285f4',
  },
  fileType: {
    pdf: '#ea4335',
    doc: '#4285f4',
    sheet: '#0f9d58',
    slide: '#f4b400',
    image: '#4285f4',
    video: '#ea4335',
    folder: '#5f6368',
    default: '#5f6368',
  },
  shadow: {
    light: '0 1px 2px 0 rgba(0,0,0,0.05)',
    medium: '0 1px 3px rgba(60,64,67,.3), 0 4px 8px 3px rgba(60,64,67,.15)',
    card: '0 1px 2px rgba(0,0,0,.3), 0 1px 3px 1px rgba(0,0,0,.15)',
    menu: '0 2px 6px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.3)',
    heavy: '0 8px 16px rgba(0,0,0,0.3)',
  },
  overlay: {
    white10: 'rgba(255,255,255,0.1)',
    white05: 'rgba(255,255,255,0.05)',
    white02: 'rgba(255,255,255,0.2)',
    black04: 'rgba(0,0,0,0.04)',
  },
} as const;

