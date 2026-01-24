import React, { useCallback } from 'react'
import type { GetServerSideProps } from 'next'
import { getProviders, getSession, signIn } from 'next-auth/react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
  useTheme,
  alpha,
  Container
} from '@mui/material'
import { Turnstile } from '@marsidev/react-turnstile'
import { SignInProps } from 'types/auth'
import constants from 'config/constants'
import { useTurnstile } from 'hooks'

import FacebookIcon from '@mui/icons-material/Facebook'
import { ThemeToggle } from 'components/ThemeToggle'

const SignIn: React.FC<SignInProps> = ({ providers }) => {
  const { valid, validateToken, failure } = useTurnstile()
  const theme = useTheme()

  const handleSignin = useCallback(() => {
    if (valid) {
      signIn('google')
    }
  }, [valid])

  const handleTurnstileSuccess = (token: string) => {
    validateToken(token)
  }

  const handleTurnstileFail = () => {
    failure()
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.05
        )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        p: 2,
        position: 'relative'
      }}
    >
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <ThemeToggle />
      </Box>
      <Container maxWidth="xs">
        <Card
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: `0 8px 40px -12px ${alpha(theme.palette.primary.main, 0.1)}`,
            backdropFilter: 'blur(20px)',
            bgcolor: alpha(theme.palette.background.paper, 0.8)
          }}
        >
          <Stack spacing={4} alignItems="center">
            {/* Branding */}
            <Box textAlign="center">
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 1.5,
                  borderRadius: '16px',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  color: '#fff',
                  mb: 2,
                  boxShadow: `0 8px 24px -4px ${alpha(theme.palette.primary.main, 0.3)}`
                }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 3V21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 9H9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  mb: 1,
                  letterSpacing: '-0.5px'
                }}
              >
                Hong.JS
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Welcome back! Please sign in to continue.
              </Typography>
            </Box>

            {/* Social Login Buttons */}
            <Stack spacing={2} width="100%">
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={
                  <Box component="svg" viewBox="0 0 24 24" sx={{ width: 20, height: 20 }}>
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.12c-.22-.66-.35-1.36-.35-2.12s.13-1.46.35-2.12V7.04H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.96l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84c.87-2.6 3.3-4.5 6.16-4.5z"
                      fill="#EA4335"
                    />
                  </Box>
                }
                onClick={handleSignin}
                disabled={!valid}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  borderColor: alpha(theme.palette.divider, 0.2),
                  color: 'text.primary',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    bgcolor: alpha(theme.palette.primary.main, 0.05)
                  }
                }}
              >
                Sign in with Google
              </Button>
              <Button
                fullWidth
                disabled
                variant="outlined"
                size="large"
                startIcon={<FacebookIcon />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              >
                Sign in with Facebook
              </Button>
            </Stack>

            <Divider flexItem>
              <Typography variant="caption" color="text.secondary">
                SECURITY CHECK
              </Typography>
            </Divider>

            {/* Turnstile */}
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                '& iframe': {
                  maxWidth: '100%'
                }
              }}
            >
              <Turnstile
                options={{
                  theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
                  size: 'normal'
                }}
                siteKey={constants.TURNSTILE_PUBLIC_KEY}
                onError={handleTurnstileFail}
                onExpire={handleTurnstileFail}
                onSuccess={handleTurnstileSuccess}
              />
            </Box>

            {/* Footer */}
            <Typography variant="caption" color="text.secondary" align="center">
              Powered by HongJS by sompote.r@gmail.com
            </Typography>
          </Stack>
        </Card>
      </Container>
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context
  const providers = await getProviders()
  const session = await getSession({ req })
  if (session && res) {
    res.statusCode = 302
    res.setHeader('Location', '/')
    return { props: { session, providers } }
  }
  return {
    props: { providers }
  }
}

export default SignIn
