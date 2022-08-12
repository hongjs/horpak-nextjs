import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useAppContext } from 'hooks';
import { IUser } from 'config/types';
import { fetchUsers, toggleUserStatus } from '../reducers/actions/userAction';

export const useUser = () => {
  const { state, dispatch } = useAppContext();
  const { data, status } = useSession();

  useEffect(() => {
    fetchUsers(dispatch);
  }, [dispatch]);

  // useEffect(() => {
  //   if (status === 'authenticated' && data && data.user && data.user.email) {
  //     axios
  //       .get(`/api/users/getUser?email=${data.user.email}`)
  //       .then((res) => {
  //         setUser(res.data);
  //       })
  //       .catch(() => {
  //         setUser(null);
  //       });
  //   } else {
  //     setUser(null);
  //   }
  // }, [data, status]);

  const toggleUserStatusHandler = useCallback(
    (id: string) => {
      toggleUserStatus(dispatch, id);
    },
    [dispatch]
  );

  return { users: state.users, toggleUserStatus: toggleUserStatusHandler };
};
