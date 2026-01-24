import { useMemo } from 'react'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import Head from 'next/head'
import { MuiThemeProvider, AuthProvider } from '../Providers'
import { DarkModeProvider } from '../contexts/DarkModeContext'
import AppContextWrapper from '../contexts/AppContext'
import ErrorBoundary from '../components/ErrorBoundary'
import Layout from '../components/layout/Layout'
import constants from 'config/constants'
import '../styles/globals.css'

const MyApp: React.FC<AppProps> = ({ Component, pageProps, router: { route } }) => {
  const publicAccess = useMemo(() => {
    return constants.PUBLIC_PATHS.some((path) => route.startsWith(path))
  }, [route])

  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <title>C Place App</title>
      </Head>
      <DarkModeProvider>
        <AppContextWrapper>
          <MuiThemeProvider>
            {!publicAccess ? (
              <AuthProvider>
                <Layout>
                  <ErrorBoundary>
                    <Component {...pageProps} />
                  </ErrorBoundary>
                </Layout>
              </AuthProvider>
            ) : (
              <Component {...pageProps} />
            )}
          </MuiThemeProvider>
        </AppContextWrapper>
      </DarkModeProvider>
    </SessionProvider>
  )
}

export default MyApp
