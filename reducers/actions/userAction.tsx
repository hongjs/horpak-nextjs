import axios from 'axios';
export const FETCH_USERS = 'FETCH_USERS';
export const FETCH_AUTH_USER_PENDING = 'FETCH_CURRENT_USER_PENDING';
export const FETCH_AUTH_USER_SUCCESS = 'FETCH_CURRENT_USER_SUCCESS';

export const fetchUsers = async (dispatch: any) => {
  const res = await axios.get('/api/users');

  dispatch({ type: FETCH_USERS, payload: res.data });
};

export const fetchAuthUser = async (dispatch: any, email: string) => {
  if (email) {
    try {
      dispatch({ type: FETCH_AUTH_USER_PENDING });
      const [res1, res2] = await Promise.all([
        axios.get(`/api/users/getUser?email=${email}`),
        axios.get(`/api/users/checkAdmin`),
      ]);

      if (res1.data) {
        res1.data.active = res1.data.active ?? false;
      }
      const payload = { currentUser: res1.data, noAdmin: res2.data };
      dispatch({ type: FETCH_AUTH_USER_SUCCESS, payload });
      return;
    } catch (err) {
      console.log(err);
    }
  }
};

export const toggleUserStatus = async (dispatch: any, id: string) => {
  const res1 = await axios.post('/api/users/toggleStatus', { id });
  if (res1.data) {
    const res2 = await axios.get('/api/users');
    dispatch({ type: FETCH_USERS, payload: res2.data });
  }
};
