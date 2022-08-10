import { createContext, useCallback, useState } from 'react';
import { ContextProps } from 'config/types';
import { Alert, Snackbar } from '@mui/material';

type AlertColor = 'success' | 'info' | 'warning' | 'error';
const initialState = {
  open: false,
  message: '',
  severity: 'success' as AlertColor,
};

export const SnackbarContext = createContext({
  alert: initialState,
  setAlert: (alert: any) => {},
});

const SnackbarContextWrapper = (props: ContextProps) => {
  const [alert, setAlert] = useState(initialState);

  const handleClose = useCallback(() => {
    setAlert((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <SnackbarContext.Provider value={{ alert, setAlert }}>
      {props.children}
      <Snackbar
        open={alert.open || false}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={alert.severity || 'success'}>
          {alert.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export default SnackbarContextWrapper;
