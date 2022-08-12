import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Loader from 'components/Loader';
import ErrorBoundary from 'components/ErrorBoundary';
import Layout from 'components/layout/Layout';
import ThemeContextProvider from 'contexts/ThemeContext';
import AppContextWrapper from 'contexts/AppContext';
import { useAuthUser } from 'hooks';
import { Props } from 'config/types';

const Providers: React.FC<Props> = ({ children }: Props) => {
  return (
    <AppContextWrapper>
      <AuthProvider>
        <ThemeContextProvider>
          <Layout>
            <ErrorBoundary>{children}</ErrorBoundary>
          </Layout>
        </ThemeContextProvider>
      </AuthProvider>
    </AppContextWrapper>
  );
};

const AuthProvider: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const { data, status } = useSession();
  const { currentUser, noAdmin, loading } = useAuthUser();
  const isUser = useMemo(() => {
    return !!data?.user;
  }, [data]);

  useEffect(() => {
    if (data && data.user && data.user.email) {
    }
  }, [data, status]);

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
