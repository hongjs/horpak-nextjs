import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import ThemeContextProvider from 'contexts/ThemeContext';
import Layout from './components/layout/Layout';

interface Props {
  children: React.ReactNode;
}

const Providers: React.FC<Props> = ({ children }: Props) => {
  return (
    <ThemeContextProvider>
      <Layout>{children}</Layout>
    </ThemeContextProvider>
  );
};

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const { data, status } = useSession();
  const isUser = !!data?.user;

  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading
    if (!isUser) router.push('/auth/signin'); // If not authenticated, force log in
  }, [router, isUser, status]);

  if (isUser) {
    return <>{children}</>;
  }

  return <div>Loading...</div>;
};

export default Providers;
