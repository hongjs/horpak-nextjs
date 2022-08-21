import { useCallback } from 'react';
import { useAppContext } from 'hooks';
import {
  fetchBank,
  getBank,
  saveBank,
  deleteBank,
} from 'reducers/actions/bankAction';

export const useBank = () => {
  const { state, dispatch } = useAppContext();

  const handleFetchBank = useCallback(() => {
    fetchBank(dispatch);
  }, [dispatch]);

  const handleGetBank = useCallback(
    (id: string) => {
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
