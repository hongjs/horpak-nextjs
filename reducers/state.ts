const initialState = {
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

export default initialState;
