import { createTheme } from '@mui/material/styles'

export const getMuiTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#3b82f6', // Tailwind blue-500
      },
      background: {
        default: mode === 'dark' ? '#030712' : '#ffffff', // gray-950 : white
        paper: mode === 'dark' ? '#1f2937' : '#ffffff', // gray-800 : white
      },
      text: {
        primary: mode === 'dark' ? '#f9fafb' : '#111827', // gray-50 : gray-900
        secondary: mode === 'dark' ? '#d1d5db' : '#6b7280', // gray-300 : gray-500
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '0.5rem', // rounded-lg
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '0.5rem', // rounded-lg
          },
        },
      },
    },
  })
