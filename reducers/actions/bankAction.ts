import axios from 'axios';
import { Dispatch } from 'react';
export const OPEN_ALERT = 'OPEN_ALERT';
export const LOADING_BANK = 'LOADING_BANK';
export const FETCH_BANKS = 'FETCH_BANKS';
export const GET_BANK = 'GET_BANK';
export const EDIT_BANK = 'EDIT_BANK';
export const DELETE_BANK = 'DELETE_BANK';

export const fetchBank = async (dispatch: Dispatch<any>) => {
  try {
    dispatch({ type: LOADING_BANK });
    const res = await axios.get('/api/bank/list');
    dispatch({ type: FETCH_BANKS, payload: res.data });
  } catch (err) {
    dispatch({
      type: OPEN_ALERT,
      payload: { message: 'Unknown error occurs.', severity: 'error' },
    });
  }
};

export const getBank = async (dispatch: Dispatch<any>, id: string | null) => {
  try {
    if (id) {
      dispatch({ type: LOADING_BANK });
      const res = await axios.get(`/api/bank/get?id=${id}`);
      dispatch({ type: GET_BANK, payload: res.data });
    } else {
      dispatch({ type: GET_BANK, payload: null });
    }
  } catch (err) {
    dispatch({
      type: OPEN_ALERT,
      payload: { message: 'Unknown error occurs.', severity: 'error' },
    });
  }
};

export const saveBank = async (dispatch: Dispatch<any>, data: object) => {
  try {
    dispatch({ type: LOADING_BANK });
    const res = await axios.post(`/api/bank/save`, data);
    dispatch({ type: EDIT_BANK, payload: res.data });
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

export const deleteBank = async (dispatch: Dispatch<any>, id: string) => {
  try {
    dispatch({ type: LOADING_BANK });
    const res = await axios.delete(`/api/bank/delete?id=${id}`);
    dispatch({ type: DELETE_BANK, payload: res.data });
  } catch (err) {
    dispatch({
      type: OPEN_ALERT,
      payload: { message: 'Unknown error occurs.', severity: 'error' },
    });
  }
};
