import {
  FETCH_USERS,
  FETCH_AUTH_USER_PENDING,
  FETCH_AUTH_USER_SUCCESS,
} from 'reducers/actions/userAction';

import { OPEN_ALERT, CLOSE_ALERT } from 'reducers/actions/globalAction';

export const initialState = {
  users: [],
  auth: {
    loading: null,
    currentUser: null,
    noAdmin: null,
  },
  alert: {
    open: false,
    message: '',
    severity: 'success',
  },
} as any;

export const AppReducer = (state: any, action: any) => {
  switch (action.type) {
    case FETCH_USERS: {
      return {
        ...state,
        users: action.payload,
      };
    }
    case FETCH_AUTH_USER_PENDING: {
      return {
        ...state,
        auth: {
          ...state.auth,
          loading: true,
        },
      };
    }
    case FETCH_AUTH_USER_SUCCESS: {
      const { currentUser, noAdmin } = action.payload;
      return {
        ...state,
        auth: {
          ...state.auth,
          loading: false,
          currentUser,
          noAdmin,
        },
      };
    }

    case OPEN_ALERT: {
      const { message, severity } = action.payload;
      return {
        ...state,
        alert: {
          ...state.alert,
          open: true,
          message,
          severity,
        },
      };
    }
    case CLOSE_ALERT: {
      return {
        ...state,
        alert: {
          ...state.alert,
          open: false,
        },
      };
    }

    default: {
      return state;
    }
  }
};
