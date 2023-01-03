import { useCallback, useEffect } from 'react';
import { useAppContext } from 'hooks';
import { fetchUsers, toggleUserStatus } from '../reducers/actions/userAction';

const useUser = () => {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    fetchUsers(dispatch);
  }, [dispatch]);

  const toggleUserStatusHandler = useCallback(
    (id: string) => {
      toggleUserStatus(dispatch, id);
    },
    [dispatch]
  );

  return { users: state.users, toggleUserStatus: toggleUserStatusHandler };
};

export default useUser;
