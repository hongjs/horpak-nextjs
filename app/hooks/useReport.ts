import { useCallback } from "react";
import { useAppContext } from "hooks";
import { clearReport, fetchSheetContent } from "reducers/actions/driveAction";

const useReport = () => {
  const { state, dispatch } = useAppContext();

  const handleFetchReport = useCallback(
    (spreadsheetId: string, sheetId: number) => {
      fetchSheetContent(dispatch, spreadsheetId, sheetId);
    },
    [dispatch],
  );

  const handleClearReport = useCallback(() => {
    clearReport(dispatch);
  }, [dispatch]);

  return {
    loading: state.report.loading,
    items: state.report.items,
    sheet: state.report.sheet,
    errors: state.report.errors,
    fetchReport: handleFetchReport,
    clearReport: handleClearReport,
  };
};

export default useReport;
