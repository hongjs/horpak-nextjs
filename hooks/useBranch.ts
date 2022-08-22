import { useCallback } from 'react';
import { useAppContext } from 'hooks';
import {
  fetchBranch,
  getBranch,
  saveBranch,
  deleteBranch,
} from 'reducers/actions/branchAction';

const useBranch = () => {
  const { state, dispatch } = useAppContext();

  const handleFetchBranch = useCallback(() => {
    fetchBranch(dispatch);
  }, [dispatch]);

  const handleGetBranch = useCallback(
    (id: string | null) => {
      getBranch(dispatch, id);
    },
    [dispatch]
  );

  const handleSaveBranch = useCallback(
    (data: object) => {
      saveBranch(dispatch, data);
    },
    [dispatch]
  );

  const handleDeleteBranch = useCallback(
    (id: string) => {
      deleteBranch(dispatch, id);
    },
    [dispatch]
  );

  return {
    saved: state.branch.saved,
    loading: state.branch.loading,
    item: state.branch.item,
    branches: state.branch.branches,
    fetchBranch: handleFetchBranch,
    getBranch: handleGetBranch,
    saveBranch: handleSaveBranch,
    deleteBranch: handleDeleteBranch,
  };
};

export default useBranch;
