import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@mui/material';
import {
  Print as PrintIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
// import { useReactToPrint } from 'react-to-print';

import styles from './index.module.css';
import { Props } from 'types';
import { useBranch, useDrive } from 'hooks';
import { BranchItemState } from 'types/state';

const ViewDataSource: React.FC<Props> = (props) => {
  const { branches, fetchBranch, loading } = useBranch();
  const { fetchSheets } = useDrive();

  const [branch, setBranch] = useState<BranchItemState | undefined>(undefined);
  const [sheetId, setSheetId] = useState<number | undefined>(undefined);
  const [displaySummary, setDisplaySummary] = useState(false);

  const componentRef = useRef();
  // const handlePrintClick = useReactToPrint({
  //   content: () => componentRef.current,
  // });

  useEffect(() => {
    fetchBranch();
  }, [fetchBranch]);

  const handleChange = useCallback(
    (event: any, name: string) => {
      if (name === 'branch') {
        setSheetId(undefined);
        // action.current.clearSheets(dispatch);
        // action.current.clearReport(dispatch);
        const branch = branches.find((i) => i._id === event.target.value);
        if (branch) {
          setBranch(branch);
          fetchSheets([branch]);
        }
      } else if (name === 'sheet') {
        setSheetId(event.target.value);
        // action.current.clearReport(dispatch);
        // action.current.fetchReportData(
        //   dispatch,
        //   branch.spreadSheetId,
        //   event.target.value
        // );
      }
    },
    [branches, fetchSheets]
  );

  useEffect(() => {
    if (branch && branch.sheets && branch.sheets.length > 0) {
      setSheetId(branch.sheets[0].sheetId);
      handleChange({ target: { value: branch.sheets[0].sheetId } }, 'sheet');
    }
  }, [branch, branch?.sheets, handleChange]);

  const handleCheckChange = useCallback((event: any) => {
    setDisplaySummary(event.target.checked);
  }, []);

  const handleRefreshClick = useCallback((event: any) => {
    // action.current.clearReport(dispatch);
    // action.current.fetchReportData(dispatch, branch.spreadSheetId, sheetId);
  }, []);

  const renderFilter = useCallback(() => {
    return (
      <Grid item xs={12}>
        <FormControl className={styles.formControl}>
          <InputLabel id="branch-select-label">Branch</InputLabel>
          <Select
            labelId="branch-select-label"
            id="branch-select"
            value={branch?._id || ''}
            onChange={(event) => handleChange(event, 'branch')}
          >
            {branches &&
              branches.map((branch) => {
                if (branch) {
                  return (
                    <MenuItem key={branch._id} value={branch._id}>
                      {branch.name}
                    </MenuItem>
                  );
                }
              })}
          </Select>
        </FormControl>
        <FormControl className={styles.formControl}>
          <InputLabel id="sheet-select-label">Sheet</InputLabel>
          <Select
            labelId="sheet-select-label"
            id="sheet-select"
            value={sheetId || ''}
            onChange={(event) => handleChange(event, 'sheet')}
            disabled={!branch || !branch.sheets}
          >
            {branch &&
              branch.sheets &&
              branch.sheets.map((sheet) => {
                return (
                  <MenuItem key={sheet.sheetId} value={sheet.sheetId}>
                    {sheet.title}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>

        <FormControlLabel
          className={styles.formControl}
          control={
            <Checkbox
              checked={displaySummary || false}
              onChange={handleCheckChange}
              name="checkedB"
              color="primary"
            />
          }
          label="Summary"
        />

        <Button
          variant="contained"
          color="primary"
          className={styles.formControl}
          startIcon={<PrintIcon />}
          // onClick={handlePrintClick}
        >
          Print
        </Button>
        <Button
          className={styles.refreshButton}
          disabled={sheetId === undefined}
          onClick={handleRefreshClick}
        >
          <RefreshIcon />
        </Button>
      </Grid>
    );
  }, [
    branch,
    displaySummary,
    sheetId,
    branches,
    handleChange,
    handleCheckChange,
    handleRefreshClick,
    // handlePrintClick,
  ]);

  const renderReportData = useCallback(() => {
    return <div>Report</div>;
    //   <Grid item xs={12}>
    //   <DataSourceReport
    //     ref={componentRef}
    //     data={data.report}
    //     branch={branch}
    //     displaySummary={displaySummary}
    //   />
    // </Grid>
  }, []);

  const renderError = useCallback(() => {
    return <div>error</div>;
    {
      /* <Grid item xs={12}>
<Typography variant="h3" gutterBottom color="error">
  Sheet Error
</Typography>
<List component="nav">
  {data.report.errors.map((error) => {
    return (
      <ListItem button>
        <ListItemText
          primary={error.room}
          secondary={error.message}
        />
      </ListItem>
    );
  })}
</List>
</Grid> */
    }
  }, []);

  return (
    <div className={styles.root}>
      <Paper className={styles.paper}>
        {loading && (
          <p>
            <LinearProgress />
          </p>
        )}
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-end"
        >
          {renderFilter()}
          {renderReportData()}
          {renderError()}
        </Grid>
      </Paper>
      <p>loading={loading ? 'Y' : 'N'}</p>
    </div>
  );
};

export default ViewDataSource;
