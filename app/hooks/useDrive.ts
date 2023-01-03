import { useCallback } from 'react';
import { useAppContext } from 'hooks';
import {
  fetchDrive,
  fetchSheets,
  checkToken,
  getUser,
  processData,
} from 'reducers/actions/driveAction';
import { BranchItemState } from 'types/state';

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

  const handleChangeSheet = useCallback(() => {}, []);

  const handleFetchSheets = useCallback(
    (branches: BranchItemState[]) => {
      fetchSheets(dispatch, branches);
    },
    [dispatch]
  );

  const handleProcessData = useCallback(
    (branchId: string, spreadsheetId: string, sheetId: number) => {
      processData(dispatch, branchId, spreadsheetId, sheetId);
    },
    [dispatch]
  );

  return {
    files: state.drive.files,
    loading: state.drive.loading,
    hasToken: state.drive.hasToken,
    user: state.drive.user,
    fetchDrive: handleFetchDrive,
    getUser: handleGetUser,
    checkToken: handleCheckToken,
    changeSheet: handleChangeSheet,
    fetchSheets: handleFetchSheets,
    processData: handleProcessData,
  };
};

export default useDrive;
