import axios from 'axios';
import { Dispatch } from 'react';

export const OPEN_ALERT = 'OPEN_ALERT';
export const CHECK_TOKEN = 'CHECK_TOKEN';
export const LOADING_DRIVE = 'LOADING_DRIVE';
export const FETCH_DRIVE = 'FETCH_DRIVE';

export const fetchDrive = async (dispatch: Dispatch<any>, folderId: string) => {
  try {
    dispatch({ type: LOADING_DRIVE });
    const res = await axios.get(`/api/sheet/list?folderId=${folderId}`);
    dispatch({ type: FETCH_DRIVE, payload: res.data });
  } catch (err) {
    dispatch({
      type: OPEN_ALERT,
      payload: { message: 'Unknown error occurs.', severity: 'error' },
    });
  }
};

export const checkToken = async (dispatch: Dispatch<any>) => {
  try {
    const res = await axios.get(`/api/sheet/checkToken`);
    dispatch({ type: CHECK_TOKEN, payload: res.data });
  } catch (err) {
    dispatch({ type: CHECK_TOKEN, payload: false });
  }
};
