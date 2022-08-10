import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import Layout from 'components/layout/Layout';
import Providers, { AuthProvider } from '../Providers';

const PUBLIC_PATHS = ['/auth/signin', '/unauthorized'];

const MyApp = ({ Component, pageProps, router: { route } }: AppProps) => {
  const publicAccess = PUBLIC_PATHS.some((path) => route.startsWith(path));

  return (
    <SessionProvider session={pageProps.session}>
      <Providers>
        <Head>
          <title>Hong.JS</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css"
          />
        </Head>
        {!publicAccess && (
          <AuthProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </AuthProvider>
        )}
        {publicAccess && <Component {...pageProps} />}
      </Providers>
    </SessionProvider>
  );
};

export default MyApp;
