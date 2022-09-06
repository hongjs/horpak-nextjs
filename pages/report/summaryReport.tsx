import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Hidden,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Typography,
  Tooltip,
} from '@mui/material';
import {
  Print as PrintIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useReactToPrint } from 'react-to-print';
import DataSourceReport from 'components/report/DataSourceReport';
import { Props } from 'types';
import { useBranch, useDrive, useReport } from 'hooks';
import { BranchItemState } from 'types/state';
import styles from './summaryReport.module.css';

const SummaryReport: React.FC<Props> = (props) => {
  const { branches, fetchBranch, loading } = useBranch();
  const { fetchSheets } = useDrive();
  const { items, errors, fetchReport, clearReport, ...report } = useReport();

  const [branch, setBranch] = useState<BranchItemState | undefined>(undefined);
  const [sheetId, setSheetId] = useState<number | undefined>(undefined);
  const [displaySummary, setDisplaySummary] = useState(false);

  const componentRef = useRef();

  const handlePrintClick = useReactToPrint({
    content: () =>
      componentRef && componentRef.current ? componentRef.current : null,
  });

  useEffect(() => {
    clearReport();
    fetchBranch();
  }, [clearReport, fetchBranch]);

  const handleChange = useCallback(
    (event: any, name: string) => {
      if (name === 'branch') {
        setSheetId(undefined);

        const branch = branches.find((i) => i._id === event.target.value);
        if (branch) {
          setBranch(branch);
          fetchSheets([branch]);
        }
      } else if (name === 'sheet') {
        setSheetId(event.target.value);
        if (branch && branch.spreadSheetId) {
          fetchReport(branch.spreadSheetId, event.target.value);
        }
      }
    },
    [branch, branches, fetchSheets, fetchReport]
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

  const handleRefreshClick = useCallback(() => {
    if (branch && branch.spreadSheetId && sheetId)
      fetchReport(branch.spreadSheetId, sheetId);
  }, [fetchReport, branch, sheetId]);

  const renderFilter = useCallback(() => {
    return (
      <Box className={styles.filter}>
        <Grid container>
          <Grid item xs={6} md={6} lg={3} className={styles.filterBox}>
            <FormControl fullWidth className={styles.formControl}>
              <InputLabel id="branch-select-label">Branch</InputLabel>
              <Select
                labelId="branch-select-label"
                id="branch-select"
                value={branch?._id || ''}
                label="Branch"
                size="medium"
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
          </Grid>
          <Grid item xs={6} md={6} lg={3} className={styles.filterBox}>
            <FormControl fullWidth className={styles.formControl}>
              <InputLabel id="sheet-select-label">Sheet</InputLabel>
              <Select
                labelId="sheet-select-label"
                id="sheet-select"
                value={sheetId || ''}
                label="Sheet"
                size="medium"
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
          </Grid>
          <Grid item xs={6} md={6} lg={2} className={styles.filterBox}>
            <FormControlLabel
              className={styles.formControl}
              control={
                <Checkbox
                  checked={displaySummary || false}
                  onChange={handleCheckChange}
                  name="checkedB"
                  color="primary"
                  size="small"
                />
              }
              label="Summary"
            />
          </Grid>
          <Hidden smDown>
            <Grid item xs={6} sm={3} md={3} lg={2} className={styles.filterBox}>
              <Button
                variant="outlined"
                color="primary"
                size="medium"
                fullWidth
                className={styles.button}
                startIcon={<PrintIcon />}
                disabled={!sheetId || (errors && errors?.length > 0)}
                onClick={handlePrintClick}
              >
                Print
              </Button>
            </Grid>
          </Hidden>
          <Grid item xs={6} sm={3} md={3} lg={2} className={styles.filterBox}>
            <Hidden smUp>
              <Tooltip title="Print">
                <Button
                  className={styles.iconButton}
                  disabled={!sheetId || (errors && errors?.length > 0)}
                  onClick={handlePrintClick}
                >
                  <PrintIcon />
                </Button>
              </Tooltip>
              <Tooltip title="Refresh">
                <Button
                  className={styles.iconButton}
                  disabled={sheetId === undefined}
                  onClick={handleRefreshClick}
                >
                  <RefreshIcon />
                </Button>
              </Tooltip>
            </Hidden>
            <Hidden smDown>
              <Button
                variant="outlined"
                color="primary"
                size="medium"
                fullWidth
                className={styles.button}
                startIcon={<RefreshIcon />}
                disabled={sheetId === undefined}
                onClick={handleRefreshClick}
              >
                Refresh
              </Button>
            </Hidden>
          </Grid>
        </Grid>
      </Box>
    );
  }, [
    branch,
    displaySummary,
    sheetId,
    branches,
    errors,
    handleChange,
    handleCheckChange,
    handleRefreshClick,
    handlePrintClick,
  ]);

  const renderReportData = useCallback(() => {
    if (branch && items && report.sheet) {
      return (
        <div className={styles.printArea}>
          <DataSourceReport
            ref={componentRef as unknown as any}
            items={items}
            branch={branch}
            sheet={report.sheet}
            displaySummary={displaySummary}
          />
        </div>
      );
    }
  }, [items, branch, report.sheet, displaySummary]);

  const renderError = useCallback(() => {
    if (branch && errors) {
      return (
        <Paper className={styles.paperError}>
          <Typography variant="body1" gutterBottom color="error">
            Sheet Error
          </Typography>
          <Typography variant="body2" gutterBottom>
            <a
              href={`https://docs.google.com/spreadsheets/d/${branch?.spreadSheetId}#gid=${report.sheet?.sheetId}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: 'blue', textDecoration: 'underline' }}
            >
              {`${branch?.spreadSheetName} - ${report.sheet?.title}`}
            </a>
          </Typography>
          <List component="nav">
            {errors.map((error) => {
              return (
                <ListItem button key={error}>
                  <ListItemText primary={error} />
                </ListItem>
              );
            })}
          </List>
        </Paper>
      );
    }
  }, [branch, errors, report.sheet]);

  return (
    <div className={styles.root}>
      <Typography gutterBottom variant="h5">
        Summary Report
      </Typography>
      <Paper className={styles.paper}>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-end"
        >
          <Grid item xs={12}>
            {renderFilter()}
            {(loading || report.loading) && (
              <Box component="p">
                <LinearProgress />
              </Box>
            )}
          </Grid>

          <Grid item xs={12}>
            {renderError()}
          </Grid>
          <Grid item xs={12}>
            {renderReportData()}
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default SummaryReport;
