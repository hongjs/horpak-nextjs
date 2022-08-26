import axios, { AxiosResponse } from 'axios';
import { Dispatch } from 'react';
import { BranchItemState } from 'types/state';

export const OPEN_ALERT = 'OPEN_ALERT';
export const CHECK_TOKEN = 'CHECK_TOKEN';
export const LOADING_DRIVE = 'LOADING_DRIVE';
export const FETCH_DRIVE = 'FETCH_DRIVE';
export const GET_DRIVE_USER = 'GET_DRIVE_USER';
export const FETCH_SHEETS = 'FETCH_SHEETS';
export const PROCESS_DATA_DONE = 'PROCESS_DATA_DONE';
export const PROCESSING_DATA = 'PROCESSING_DATA';

export const fetchDrive = async (dispatch: Dispatch<any>, folderId: string) => {
  try {
    dispatch({ type: LOADING_DRIVE });
    const res = await axios.get(`/api/spreadsheet/list?folderId=${folderId}`);
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
    const res = await axios.get(`/api/spreadsheet/checkToken`);
    dispatch({ type: CHECK_TOKEN, payload: res.data });
  } catch (err) {
    dispatch({ type: CHECK_TOKEN, payload: false });
  }
};

export const getUser = async (dispatch: Dispatch<any>) => {
  try {
    dispatch({ type: LOADING_DRIVE });
    const res = await axios.get(`/api/spreadsheet/getUser`);
    dispatch({ type: GET_DRIVE_USER, payload: res.data });
  } catch (err) {
    dispatch({
      type: OPEN_ALERT,
      payload: { message: 'Unknown error occurs.', severity: 'error' },
    });
  }
};

export const fetchSheets = async (
  dispatch: Dispatch<any>,
  branches: BranchItemState[]
) => {
  try {
    dispatch({ type: LOADING_DRIVE });

    Promise.all(
      branches.map(async (branch) => {
        const res = await axios.get(
          `/api/spreadsheet/sheet/list?id=${branch.spreadSheetId}`
        );

        dispatch({
          type: FETCH_SHEETS,
          payload: {
            branchId: branch._id,
            sheets: res.data,
            sheetId: res.data.length > 0 ? res.data[0].sheetId : undefined,
          },
        });
      })
    );
  } catch (err) {
    dispatch({
      type: OPEN_ALERT,
      payload: { message: 'Unknown error occurs.', severity: 'error' },
    });
  }
};

export const processData = async (
  dispatch: Dispatch<any>,
  branchId: string,
  spreadsheetId: string,
  sheetId: number
) => {
  try {
    dispatch({ type: PROCESSING_DATA, payload: branchId });

    const res = await axios.get(
      `/api/spreadsheet/sheet/processSheet?branchId=${branchId}&spreadsheetId=${spreadsheetId}&sheetId=${sheetId}`
    );
    dispatch({ type: PROCESS_DATA_DONE, payload: res.data });
  } catch (err) {
    dispatch({
      type: OPEN_ALERT,
      payload: { message: 'Unknown error occurs.', severity: 'error' },
    });
  }
};

// export const changeSheet = async (
//   dispatch: Dispatch<any>,
//   branchId: string,
//   newSheetId: string
// ) => {
//   try {
//     dispatch({ type: LOADING_DRIVE });
//     const res = await axios.get(`/api/spreadsheet/getUser`);
//     dispatch({ type: CHANGE_SHEET, payload: { branchId, newSheetId } });
//   } catch (err) {
//     dispatch({
//       type: OPEN_ALERT,
//       payload: { message: 'Unknown error occurs.', severity: 'error' },
//     });
//   }
// };
