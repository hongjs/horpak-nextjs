import { AppState } from 'types/state'

const initialState: AppState = {
  auth: {
    loading: false,
    currentUser: null,
    noAdmin: false
  },
  alert: {
    open: false,
    message: '',
    severity: 'success'
  },
  users: [],
  bank: {
    loading: false,
    saved: false,
    item: undefined,
    banks: []
  },
  branch: {
    loading: false,
    saved: false,
    item: undefined,
    branches: []
  },
  drive: {
    hasToken: false,
    loading: false,
    files: []
  },
  report: {
    loading: false
  }
}

export default initialState
