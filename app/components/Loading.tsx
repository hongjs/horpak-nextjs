import React from 'react'
import { Box, CircularProgress, Typography, useTheme, alpha } from '@mui/material'

const Loading: React.FC = () => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        minHeight: '400px', // Ensure visibility on empty pages
        width: '100%',
        gap: 2,
        animation: 'fadeIn 0.3s ease-in-out',
        '@keyframes fadeIn': {
          '0%': {
            opacity: 0
          },
          '100%': {
            opacity: 1
          }
        }
      }}
    >
      <Box sx={{ position: 'relative', display: 'flex' }}>
        <CircularProgress
          variant="determinate"
          sx={{
            color: (theme) => alpha(theme.palette.primary.main, 0.2)
          }}
          size={50}
          thickness={4}
          value={100}
        />
        <CircularProgress
          variant="indeterminate"
          disableShrink
          sx={{
            color: (theme) => theme.palette.primary.main,
            animationDuration: '550ms',
            position: 'absolute',
            left: 0,
            [`& .MuiCircularProgress-circle`]: {
              strokeLinecap: 'round'
            }
          }}
          size={50}
          thickness={4}
        />
      </Box>
      <Typography
        variant="button"
        sx={{
          color: 'text.secondary',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          animation: 'pulse 1.5s infinite ease-in-out',
          '@keyframes pulse': {
            '0%': {
              opacity: 0.6
            },
            '50%': {
              opacity: 1
            },
            '100%': {
              opacity: 0.6
            }
          }
        }}
      >
        Loading
      </Typography>
    </Box>
  )
}

export default Loading
