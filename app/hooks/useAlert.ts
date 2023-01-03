import { useCallback } from 'react';
import { useAppContext } from 'hooks';
import { openAlert, closeAlert } from 'reducers/actions/globalAction';
import { AlertColor } from 'types/state';

const useAlert = () => {
  const { dispatch } = useAppContext();

  const handleOpenAlert = useCallback(
    (message: string, severity: AlertColor) => {
      openAlert(dispatch, message, severity);
    },
    [dispatch]
  );

  const handleCloseAlert = useCallback(() => {
    closeAlert(dispatch);
  }, [dispatch]);

  return { openAlert: handleOpenAlert, closeAlert: handleCloseAlert };
};

export default useAlert;
