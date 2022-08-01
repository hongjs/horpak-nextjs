import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import Providers, { AuthProvider } from '../Providers';

const PUBLIC_PATHS = ['/auth/signin'];

const MyApp = ({ Component, pageProps, router: { route } }: AppProps) => {
  const requireAuth = !PUBLIC_PATHS.some((path) => route.startsWith(path));
  console.log(route);
  return (
    <SessionProvider session={pageProps.session}>
      <Providers>
        {requireAuth && (
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        )}
        {!requireAuth && <Component {...pageProps} />}
      </Providers>
    </SessionProvider>
  );
};

export default MyApp;
