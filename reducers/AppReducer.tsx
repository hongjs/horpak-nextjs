import {
  FETCH_USERS,
  FETCH_AUTH_USER_PENDING,
  FETCH_AUTH_USER_SUCCESS,
} from 'reducers/actions/userAction';
export const initialState = {
  users: [],
  auth: {
    loading: null,
    currentUser: null,
    noAdmin: null,
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

    default: {
      return state;
    }
  }
};
