import axios from "axios";
import { Dispatch } from "react";
export const OPEN_ALERT = "OPEN_ALERT";
export const FETCH_USERS = "FETCH_USERS";
export const FETCH_AUTH_USER_PENDING = "FETCH_CURRENT_USER_PENDING";
export const FETCH_AUTH_USER_SUCCESS = "FETCH_CURRENT_USER_SUCCESS";

export const fetchUsers = async (dispatch: Dispatch<any>) => {
  try {
    const res = await axios.get("/api/users");
    dispatch({ type: FETCH_USERS, payload: res.data });
  } catch (err) {
    dispatch({
      type: OPEN_ALERT,
      payload: { message: "Unknown error occurs.", severity: "error" },
    });
  }
};

export const fetchAuthUser = async (dispatch: Dispatch<any>, email: string) => {
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
      dispatch({
        type: OPEN_ALERT,
        payload: { message: "Unknown error occurs.", severity: "error" },
      });
    }
  }
};

export const toggleUserStatus = async (dispatch: Dispatch<any>, id: string) => {
  try {
    const res1 = await axios.post("/api/users/toggleStatus", { id });
    if (res1.data) {
      const res2 = await axios.get("/api/users");
      dispatch({ type: FETCH_USERS, payload: res2.data });
    }
  } catch (err) {
    dispatch({
      type: OPEN_ALERT,
      payload: { message: "Unknown error occurs.", severity: "error" },
    });
  }
};
