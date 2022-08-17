import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import Providers from '../Providers';
import keys from 'config/keys';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps, router: { route } }: AppProps) => {
  const publicAccess = keys.PUBLIC_PATHS.some((path) => route.startsWith(path));

  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <title>Hong.JS</title>
      </Head>
      {!publicAccess && (
        <Providers>
          <Component {...pageProps} />
        </Providers>
      )}
      {publicAccess && <Component {...pageProps} />}
    </SessionProvider>
  );
};

export default MyApp;
