import { createTheme } from '@mui/material/styles'

export const getMuiTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#4285F4', // Google Blue
        light: '#e8f0fe',
        dark: '#3367d6',
      },
      secondary: {
        main: '#34A853', // Google Green
      },
      text: {
        primary: mode === 'dark' ? '#FFFFFF' : '#212b36',
        secondary: mode === 'dark' ? '#919eab' : '#637381',
      },
      background: {
        default: mode === 'dark' ? '#121212' : '#f9fafb',
        paper: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
      },
      divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(145, 158, 171, 0.12)',
    },
    typography: {
      fontFamily: '"Public Sans", sans-serif',
      h1: { fontWeight: 800 },
      h2: { fontWeight: 800 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      subtitle1: { fontWeight: 600 },
      subtitle2: { fontWeight: 600 },
      body1: { lineHeight: 1.5, fontSize: '1rem' },
      body2: { lineHeight: 1.5, fontSize: '0.875rem' },
      button: { fontWeight: 700, textTransform: 'capitalize' },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '8px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          contained: {
            boxShadow: '0 8px 16px 0 rgba(66, 133, 244, 0.24)',
            '&:hover': {
              boxShadow: '0 8px 16px 0 rgba(66, 133, 244, 0.24)',
            }
          },
          sizeLarge: {
            height: 48,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
            backgroundImage: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)',
            borderRadius: '16px',
            position: 'relative',
            zIndex: 0, // Ensure content is above background
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRadius: 0, // Drawer should be square
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
          },
        },
      },
    },
    shape: {
      borderRadius: 8,
    },
  })
