import { useCallback, useEffect } from 'react';
import { useAppContext } from 'contexts/AppContext';
import { fetchUsers, toggleUserStatus } from '../reducers/actions/userAction';

const useUser = () => {
  const { state, dispatch } = useAppContext();

  const toggleUserStatusHandler = useCallback(
    (id: string) => {
      toggleUserStatus(dispatch, id);
    },
    [dispatch]
  );

  useEffect(() => {
    fetchUsers(dispatch);
  }, [dispatch]);

  return { users: state.users, toggleUserStatus: toggleUserStatusHandler };
};

export default useUser;
