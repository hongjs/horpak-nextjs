import { Dispatch } from 'react';
import { AlertColor } from 'types/state';
export const OPEN_ALERT = 'OPEN_ALERT';
export const CLOSE_ALERT = 'CLOSE_ALERT';

export const openAlert = async (
  dispatch: Dispatch<any>,
  message: string,
  severity: AlertColor
) => {
  dispatch({ type: OPEN_ALERT, payload: { message, severity } });
};

export const closeAlert = async (dispatch: Dispatch<any>) => {
  dispatch({ type: CLOSE_ALERT });
};
