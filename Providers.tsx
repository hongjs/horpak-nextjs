import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Loader from 'components/Loader';
import ThemeContextProvider from 'contexts/ThemeContext';
import AppContextWrapper from 'contexts/AppContext';
import { IUsers, Props } from 'config/types';

const Providers: React.FC<Props> = ({ children }: Props) => {
  return (
    <AppContextWrapper>
      <ThemeContextProvider>{children}</ThemeContextProvider>
    </AppContextWrapper>
  );
};

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const { data, status } = useSession();
  const isUser = useMemo(() => {
    return !!data?.user;
  }, [data]);
  const [user, setUser] = useState<IUsers | null>(null);

  useEffect(() => {
    if (data && data.user && data.user.email) {
      axios
        .get(`/api/users/getByEmail?email=${data.user.email}`)
        .then((res) => {
          setUser(res.data);
        });
    }
  }, [data]);

  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading
    if (!isUser) router.push('/auth/signin'); // If not authenticated, force log in
    if (isUser && user && !user.active) router.push('/forbidden');
  }, [router, isUser, status, user]);

  if (user && user.active) {
    return <>{children}</>;
  }
  return <Loader />;
};

export default Providers;
