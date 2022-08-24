import { useCallback } from 'react';
import { useAppContext } from 'hooks';
import { fetchDrive, checkToken } from 'reducers/actions/driveAction';

const useDrive = () => {
  const { state, dispatch } = useAppContext();

  const handleFetchDrive = useCallback(
    (folderId: string) => {
      fetchDrive(dispatch, folderId);
    },
    [dispatch]
  );

  const handleCheckToken = useCallback(() => {
    checkToken(dispatch);
  }, [dispatch]);

  return {
    files: state.drive.files,
    loading: state.drive.loading,
    hasToken: state.drive.hasToken,
    fetchDrive: handleFetchDrive,
    checkToken: handleCheckToken,
  };
};

export default useDrive;
