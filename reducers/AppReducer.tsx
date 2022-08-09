import { FETCH_USERS } from 'reducers/actions/userAction';

export const initialState = {
  users: [],
  number: 0,
} as any;

export const AppReducer = (state: any, action: any) => {
  switch (action.type) {
    case FETCH_USERS: {
      return {
        ...state,
        users: action.payload,
      };
    }
  }
};
