import axios from 'axios';
import { Dispatch } from 'react';
export const OPEN_ALERT = 'OPEN_ALERT';
export const LOADING_BRANCH = 'LOADING_BRANCH';
export const FETCH_BRANCHS = 'FETCH_BRANCHS';
export const GET_BRANCH = 'GET_BRANCH';
export const EDIT_BRANCH = 'EDIT_BRANCH';
export const DELETE_BRANCH = 'DELETE_BRANCH';
export const DRIVE_LIST = 'DRIVE_LIST';

export const fetchBranch = async (dispatch: Dispatch<any>) => {
  try {
    dispatch({ type: LOADING_BRANCH });
    const res = await axios.get('/api/branch/list');
    dispatch({ type: FETCH_BRANCHS, payload: res.data });
  } catch (err) {
    dispatch({
      type: OPEN_ALERT,
      payload: { message: 'Unknown error occurs.', severity: 'error' },
    });
  }
};

export const getBranch = async (dispatch: Dispatch<any>, id: string | null) => {
  try {
    if (id) {
      dispatch({ type: LOADING_BRANCH });
      const res = await axios.get(`/api/branch/get?id=${id}`);
      dispatch({ type: GET_BRANCH, payload: res.data });
    } else {
      dispatch({ type: GET_BRANCH, payload: null });
    }
  } catch (err) {
    dispatch({
      type: OPEN_ALERT,
      payload: { message: 'Unknown error occurs.', severity: 'error' },
    });
  }
};

export const saveBranch = async (dispatch: Dispatch<any>, data: object) => {
  try {
    dispatch({ type: LOADING_BRANCH });
    const res = await axios.post(`/api/branch/save`, data);
    dispatch({ type: EDIT_BRANCH, payload: res.data });
    dispatch({
      type: OPEN_ALERT,
      payload: { message: 'Saved Successfully', severity: 'success' },
    });
  } catch (err) {
    dispatch({
      type: OPEN_ALERT,
      payload: { message: 'Unknown error occurs.', severity: 'error' },
    });
  }
};

export const deleteBranch = async (dispatch: Dispatch<any>, id: string) => {
  try {
    dispatch({ type: LOADING_BRANCH });
    const res = await axios.delete(`/api/branch/delete?id=${id}`);
    dispatch({ type: DELETE_BRANCH, payload: res.data });
    dispatch({
      type: OPEN_ALERT,
      payload: { message: 'Deleted Successfully', severity: 'success' },
    });
  } catch (err) {
    dispatch({
      type: OPEN_ALERT,
      payload: { message: 'Unknown error occurs.', severity: 'error' },
    });
  }
};
