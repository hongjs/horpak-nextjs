import { AppState } from 'types/state';

const initialState = {
  auth: {
    loading: false,
    currentUser: null,
    noAdmin: false,
  },
  alert: {
    open: false,
    message: '',
    severity: 'success',
  },
  users: [],
  bank: {
    loading: false,
    saved: false,
    item: undefined,
    banks: [],
  },
} as AppState;

export default initialState;
