import { useMemo } from "react";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import Providers from "../Providers";
import constants from "config/constants";
import "../styles/globals.css";

const MyApp: React.FC<AppProps> = ({
  Component,
  pageProps,
  router: { route },
}) => {
  const publicAccess = useMemo(() => {
    return constants.PUBLIC_PATHS.some((path) => route.startsWith(path));
  }, [route]);

  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <title>C Place App</title>
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
