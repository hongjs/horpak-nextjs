import _ from 'lodash';
import {
  FETCH_USERS,
  FETCH_AUTH_USER_PENDING,
  FETCH_AUTH_USER_SUCCESS,
} from 'reducers/actions/userAction';
import {
  LOADING_BANK,
  FETCH_BANKS,
  GET_BANK,
  EDIT_BANK,
  DELETE_BANK,
} from 'reducers/actions/bankAction';
import { OPEN_ALERT, CLOSE_ALERT } from 'reducers/actions/globalAction';
import { AppReducerType, AppState } from 'types/state';

export const AppReducer: AppReducerType = (state: AppState, action: any) => {
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

    //---------------- BANK ----------------
    case LOADING_BANK: {
      return {
        ...state,
        bank: { ...state.bank, loading: true },
      };
    }
    case FETCH_BANKS:
      return {
        ...state,
        bank: { ...state.bank, banks: action.payload, loading: false },
      };

    case GET_BANK:
      return {
        ...state,
        bank: {
          ...state.bank,
          item: action.payload,
          loading: false,
          saved: false,
        },
      };

    case EDIT_BANK:
      return {
        ...state,
        bank: {
          ...state.bank,
          item: action.payload,
          loading: false,
          saved: true,
        },
      };

    case DELETE_BANK:
      return {
        ...state,
        bank: {
          ...state.bank,
          banks: _.filter(state.bank.banks, (row: any) => {
            return row._id !== action.payload.id;
          }),
          loading: false,
        },
      };

    default: {
      return state;
    }
  }
};
