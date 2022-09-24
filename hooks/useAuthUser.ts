import { useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useAppContext, usePrevious } from 'hooks';
import { fetchAuthUser } from '../reducers/actions/userAction';
import { Session } from 'next-auth';

const useAuthUser = () => {
  const { state, dispatch } = useAppContext();
  const { data, status } = useSession();

  const prevData = usePrevious(data);
  const prevStatus = usePrevious(status);

  const isUpdated = useMemo(() => {
    const prev = prevData ? (prevData as Session) : null;
    if (data === prev && status === prevStatus) return false;
    if ((!data && prev) || (data && !prevData)) return true;
    return data?.user?.email !== prev?.user?.email; // && data?.expires === prev?.expires
  }, [data, status, prevData, prevStatus]);

  useEffect(() => {
    if (isUpdated) {
      console.log('Changed!!');
      if (status === 'authenticated' && data.user && data.user.email) {
        fetchAuthUser(dispatch, data.user.email);
      } else {
        fetchAuthUser(dispatch, '');
      }
    }
  }, [dispatch, data, status, isUpdated]);

  return state.auth;
};

export default useAuthUser;
