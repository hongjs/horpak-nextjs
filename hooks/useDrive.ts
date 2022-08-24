import { useCallback } from 'react';
import { useAppContext } from 'hooks';
import { fetchDrive, checkToken, getUser } from 'reducers/actions/driveAction';

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

  const handleGetUser = useCallback(() => {
    getUser(dispatch);
  }, [dispatch]);

  return {
    files: state.drive.files,
    loading: state.drive.loading,
    hasToken: state.drive.hasToken,
    user: state.drive.user,
    fetchDrive: handleFetchDrive,
    getUser: handleGetUser,
    checkToken: handleCheckToken,
  };
};

export default useDrive;
