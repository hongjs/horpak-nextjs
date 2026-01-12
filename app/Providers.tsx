import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { ThemeProvider } from '@mui/material/styles';
import { useTheme } from 'next-themes';
import Loader from 'components/Loader';
import ErrorBoundary from 'components/ErrorBoundary';
import Layout from 'components/layout/Layout';
import { DarkModeProvider } from 'contexts/DarkModeContext';
import AppContextWrapper from 'contexts/AppContext';
import { getMuiTheme } from 'styles/muiTheme';
import { useAuthUser } from 'hooks';
import { Props } from 'types';

const Providers: React.FC<Props> = ({ children }: Props) => {
  return (
    <DarkModeProvider>
      <AppContextWrapper>
        <AuthProvider>
          <MuiThemeProvider>
            <Layout>
              <ErrorBoundary>{children}</ErrorBoundary>
            </Layout>
          </MuiThemeProvider>
        </AuthProvider>
      </AppContextWrapper>
    </DarkModeProvider>
  );
};

const MuiThemeProvider: React.FC<Props> = ({ children }) => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const muiTheme = getMuiTheme(currentTheme === 'dark' ? 'dark' : 'light');

  return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
};

const AuthProvider: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const { data, status } = useSession();
  const { currentUser, noAdmin, loading } = useAuthUser();

  const isUser = useMemo(() => {
    return !!data?.user;
  }, [data]);

  useEffect(() => {
    if (status === 'loading' || loading) return; // Do nothing while loading
    if (!isUser) router.push('/auth/signin'); // If not authenticated, force log in

    // allow any users to login while no Admin are assigned.
    if (isUser && currentUser && currentUser.active === false && !noAdmin) {
      router.push('/unauthorized');
    }
  }, [router, isUser, status, currentUser, noAdmin, loading]);

  if (status === 'loading' || loading) {
    return <Loader />;
  } else if (
    isUser &&
    currentUser &&
    (currentUser.active || (currentUser.active === false && noAdmin === true))
  ) {
    return <>{children}</>;
  }
  return <Loader />;
};

export default Providers;
