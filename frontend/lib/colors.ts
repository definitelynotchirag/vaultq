const lightColors = {
  background: {
    default: '#ffffff',
    paper: '#ffffff',
    hover: '#f1f3f4',
    selected: '#e8eaed',
    light: '#f8f9fa',
    dark: '#1a1a1a',
    darkSecondary: '#2a2a2a',
    darkTertiary: '#3c3c3c',
    darkBackground: '#fff',
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

const darkColors = {
  background: {
    default: '#1a1a1a',
    paper: '#1a1a1a',
    hover: '#1f1f1f',
    selected: '#252525',
    light: '#1d1d1d',
    dark: '#1a1a1a',
    darkSecondary: '#1f1f1f',
    darkTertiary: '#252525',
    darkBackground: '#000',
  },
  text: {
    primary: '#ffffff',
    secondary: '#b0b0b0',
    disabled: '#80868b',
    white: '#ffffff',
  },
  border: {
    default: '#2f2f2f',
    light: '#333333',
    dark: '#2f2f2f',
  },
  primary: {
    main: '#4285f4',
    light: '#5a95f5',
    dark: '#1a73e8',
    hover: '#5a95f5',
    contrast: '#ffffff',
  },
  secondary: {
    main: '#80868b',
    light: '#9aa0a6',
    dark: '#5f6368',
    contrast: '#ffffff',
  },
  error: {
    main: '#ea4335',
    light: 'rgba(234,67,53,0.2)',
  },
  warning: {
    main: '#f4b400',
    light: 'rgba(244,180,0,0.2)',
    lighter: 'rgba(244,180,0,0.3)',
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
    folder: '#80868b',
    default: '#80868b',
  },
  shadow: {
    light: '0 1px 2px 0 rgba(0,0,0,0.3)',
    medium: '0 1px 3px rgba(0,0,0,0.5), 0 4px 8px 3px rgba(0,0,0,0.3)',
    card: '0 1px 2px rgba(0,0,0,0.5), 0 1px 3px 1px rgba(0,0,0,0.3)',
    menu: '0 2px 6px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.5)',
    heavy: '0 8px 16px rgba(0,0,0,0.6)',
  },
  overlay: {
    white10: 'rgba(255,255,255,0.1)',
    white05: 'rgba(255,255,255,0.05)',
    white02: 'rgba(255,255,255,0.2)',
    black04: 'rgba(0,0,0,0.1)',
  },
} as const;

export function getColors(mode: 'light' | 'dark' = 'light') {
  return mode === 'dark' ? darkColors : lightColors;
}






