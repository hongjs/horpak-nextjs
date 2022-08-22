import { useCallback } from 'react';
import { useAppContext } from 'hooks';
import {
  fetchBank,
  getBank,
  saveBank,
  deleteBank,
} from 'reducers/actions/bankAction';

const useBank = () => {
  const { state, dispatch } = useAppContext();

  const handleFetchBank = useCallback(() => {
    fetchBank(dispatch);
  }, [dispatch]);

  const handleGetBank = useCallback(
    (id: string | null) => {
      getBank(dispatch, id);
    },
    [dispatch]
  );

  const handleSaveBank = useCallback(
    (data: object) => {
      saveBank(dispatch, data);
    },
    [dispatch]
  );

  const handleDeleteBank = useCallback(
    (id: string) => {
      deleteBank(dispatch, id);
    },
    [dispatch]
  );

  return {
    saved: state.bank.saved,
    loading: state.bank.loading,
    item: state.bank.item,
    banks: state.bank.banks,
    fetchBank: handleFetchBank,
    getBank: handleGetBank,
    saveBank: handleSaveBank,
    deleteBank: handleDeleteBank,
  };
};

export default useBank;
