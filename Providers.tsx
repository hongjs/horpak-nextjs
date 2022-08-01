import { SessionProvider } from 'next-auth/react';
import ThemeContextProvider from './contexts/ThemeContext';
import Layout from './components/layout/Layout';

interface Props {
  children: React.ReactNode;
  pageProps: any;
}

const Providers: React.FC<Props> = ({ children, pageProps }: Props) => {
  return (
    <ThemeContextProvider>
      <SessionProvider session={pageProps.session}>
        <Layout>{children}</Layout>
      </SessionProvider>
    </ThemeContextProvider>
  );
};

export default Providers;
