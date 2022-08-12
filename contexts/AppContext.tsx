import { createContext, useCallback, useReducer } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { AppReducer, initialState } from 'reducers/AppReducer';
import { ContextProps, AlertColor } from 'config/types';

export const AppContext = createContext(initialState);

const AppContextWrapper = (props: ContextProps) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  const handleClose = useCallback(() => {
    dispatch({ type: 'CLOSE_ALERT' });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {props.children}
      <Snackbar
        open={state.alert.open || false}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={state.alert.severity || 'success'}
        >
          {state.alert.message}
        </Alert>
      </Snackbar>
    </AppContext.Provider>
  );
};

export default AppContextWrapper;
