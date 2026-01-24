import { createContext, useCallback, useReducer } from 'react'
import { Alert, Snackbar } from '@mui/material'
import { AppReducer } from 'reducers/AppReducer'
import initialState from 'reducers/state'
import { Props, AppContextProps } from 'types'

export const AppContext = createContext<AppContextProps>({
  state: initialState,
  dispatch: () => null
})

const AppContextWrapper: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState)

  const handleClose = useCallback(() => {
    dispatch({ type: 'CLOSE_ALERT' })
  }, [])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <> {children}</>
      <Snackbar
        open={state.alert.open || false}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={state.alert.severity || 'success'}>
          {state.alert.message || 'Hi there!'}
        </Alert>
      </Snackbar>
    </AppContext.Provider>
  )
}

export default AppContextWrapper
