import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAppContext } from 'hooks';
import { fetchAuthUser } from '../reducers/actions/userAction';

export const useAuthUser = () => {
  const { state, dispatch } = useAppContext();
  const { data, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && data.user && data.user.email) {
      fetchAuthUser(dispatch, data.user.email);
    } else {
      fetchAuthUser(dispatch, '');
    }
  }, [dispatch, data, status]);

  return state.auth;
};
