import axios from 'axios';
export const FETCH_USERS = 'FETCH_USERS';

export const fetchUsers = async (dispatch: any) => {
  const res = await axios.get('/api/users');
  dispatch({ type: FETCH_USERS, payload: res.data });
};

export const toggleUserStatus = async (dispatch: any, id: string) => {
  const res1 = await axios.post('/api/users/toggleStatus', { id });
  if (res1.data) {
    const res2 = await axios.get('/api/users');
    dispatch({ type: FETCH_USERS, payload: res2.data });
  }
};
