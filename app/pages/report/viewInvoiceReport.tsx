import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  Hidden,
  OutlinedInput,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  DesktopDatePicker,
  MobileDatePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format as dateFormat, addMonths } from 'date-fns';
import {
  Print as PrintIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useReactToPrint } from 'react-to-print';
import { useBank, useBranch, useDrive, useReport } from 'hooks';
import InvoiceReport from 'components/report/InvoiceReport';

import styles from './viewInvoiceReport.module.css';
import { BranchItemState } from 'types/state';

type Props = {};

const ViewInvoiceReport: React.FC<Props> = ({}) => {
  const { banks, fetchBank, loading: bankLoading } = useBank();
  const { branches, fetchBranch, loading } = useBranch();
  const { fetchSheets, loading: driveLoading } = useDrive();
  const { items, errors, fetchReport, clearReport, ...report } = useReport();
  const [hasName, setHasName] = useState(true);
  const [branch, setBranch] = useState<BranchItemState | undefined>(undefined);
  const [sheetId, setSheetId] = useState<number | undefined>(undefined);
  const [rooms, setRooms] = useState<number[]>([]);
  const [invoiceMonth, setInvoiceMonth] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());

  const componentRef = useRef();

  const handlePrintClick = useReactToPrint({
    content: () =>
      componentRef && componentRef.current ? componentRef.current : null,
  });

  useEffect(() => {
    setInvoiceMonth(
      new Date(`${dateFormat(addMonths(new Date(), 1), 'yyyy-MM')}-01`)
    );
    setDueDate(
      new Date(`${dateFormat(addMonths(new Date(), 1), 'yyyy-MM')}-05`)
    );
  }, []);

  useEffect(() => {
    clearReport();
    fetchBranch();
    fetchBank();
  }, [clearReport, fetchBank, fetchBranch]);

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
      } else if (name === 'rooms') {
        setRooms(event.target.value);
      } else if (name === 'hasName') {
        setHasName(event.target.checked);
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

  const itemsToDisplay = useMemo(() => {
    if (rooms === undefined || rooms.length === 0) {
      return items
        ? hasName === true
          ? items.filter((item) => {
              return item.name !== '';
            })
          : items
        : [];
    } else {
      return items
        ? hasName === true
          ? items.filter((item) => {
              return item.name !== '' && rooms.includes(item.room);
            })
          : items.filter((item) => {
              return rooms.includes(item.room);
            })
        : [];
    }
  }, [items, rooms, hasName]);

  const handleDateChange = useCallback((date: Date | null, name: string) => {
    if (!date) return;
    if (name === 'dueDate') {
      setDueDate(date);
    } else if (name === 'invoiceMonth') {
      setInvoiceMonth(date);
    }
  }, []);

  const handleRefreshClick = useCallback(() => {
    if (branch && branch.spreadSheetId && sheetId) {
      fetchReport(branch.spreadSheetId, sheetId);
    }
  }, [branch, sheetId, fetchReport]);

  const renderFilter = useCallback(() => {
    return (
      <Box className={styles.filter}>
        <Grid container>
          <Grid item xs={6} md={6} lg={3} xl={2} className={styles.filterBox}>
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
          <Grid item xs={6} md={6} lg={3} xl={2} className={styles.filterBox}>
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
          <Grid item xs={6} md={6} lg={3} xl={2} className={styles.filterBox}>
            <LocalizationProvider dateAdapter={AdapterDateFns as any}>
              <Hidden mdDown>
                <DesktopDatePicker
                  label="Invoice date"
                  inputFormat="yyyy-MM"
                  openTo="month"
                  views={['year', 'month']}
                  value={invoiceMonth}
                  onChange={(date) => handleDateChange(date, 'invoiceMonth')}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Hidden>
              <Hidden mdUp>
                <MobileDatePicker
                  label="Invoice date"
                  inputFormat="yyyy-MM"
                  openTo="month"
                  views={['year', 'month']}
                  value={invoiceMonth}
                  onChange={(date) => handleDateChange(date, 'invoiceMonth')}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  closeOnSelect
                />
              </Hidden>
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6} md={6} lg={3} xl={2} className={styles.filterBox}>
            <LocalizationProvider dateAdapter={AdapterDateFns as any}>
              <Hidden mdDown>
                <DesktopDatePicker
                  label="Due date"
                  inputFormat="yyyy-MM-dd"
                  value={dueDate}
                  onChange={(date) => handleDateChange(date, 'dueDate')}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Hidden>
              <Hidden mdUp>
                <MobileDatePicker
                  label="Due date"
                  inputFormat="yyyy-MM-dd"
                  value={dueDate}
                  onChange={(date) => handleDateChange(date, 'dueDate')}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  closeOnSelect
                />
              </Hidden>
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6} xl={4} className={styles.filterBox}>
            <FormControl fullWidth className={styles.formControl}>
              <InputLabel id="room-select-label">Rooms</InputLabel>
              <Select
                labelId="room-select-label"
                id="room-select"
                value={rooms || []}
                multiple
                size="medium"
                onChange={(event) => handleChange(event, 'rooms')}
                input={<OutlinedInput label="Rooms" />}
                renderValue={(selected) => (
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 0.5,
                      maxHeight: '100px',
                      overflow: 'scroll',
                    }}
                  >
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
                disabled={!items || items.length === 0}
              >
                {items &&
                  items.map((item) => {
                    return (
                      <MenuItem key={item.room} value={item.room}>
                        <Checkbox checked={rooms.indexOf(item.room) > -1} />
                        <ListItemText primary={item.room} />
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={0} xl={6}></Grid>
          <Grid item xs={6} sm={3} md={2} lg={2} className={styles.filterBox}>
            <FormControlLabel
              className={styles.formControl}
              control={
                <Checkbox
                  checked={hasName}
                  onChange={(event) => handleChange(event, 'hasName')}
                  name="checkedB"
                  color="primary"
                  size="small"
                />
              }
              label="has Name only"
            />
          </Grid>
          <Hidden mdDown>
            <Grid item xs={6} sm={3} md={2} lg={2} className={styles.filterBox}>
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
          <Hidden mdUp>
            <Grid
              item
              xs={12}
              sm={3}
              md={0}
              className={styles.filterBox}
              sx={{ display: 'flex', justifyContent: 'flex-end' }}
            >
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
            </Grid>
          </Hidden>
          <Hidden mdDown>
            <Grid item xs={0} md={2} className={styles.filterBox}>
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
            </Grid>
          </Hidden>
        </Grid>
      </Box>
    );
  }, [
    errors,
    branch,
    sheetId,
    branches,
    items,
    rooms,
    hasName,
    invoiceMonth,
    dueDate,
    handlePrintClick,
    handleRefreshClick,
    handleChange,
    handleDateChange,
  ]);

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
      <Box className={styles.title}>
        <Typography gutterBottom variant="h5">
          Invoice Report
        </Typography>
        {itemsToDisplay && items && (
          <Typography gutterBottom variant="body2">
            {`Total ${itemsToDisplay.length}/${items.length}`}
          </Typography>
        )}
      </Box>

      <Paper className={styles.paper}>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-end"
        >
          <Grid item xs={12}>
            {renderFilter()}
            {(loading || report.loading || driveLoading || bankLoading) && (
              <Box component="p">
                <LinearProgress />
              </Box>
            )}
          </Grid>

          {errors && errors.length > 0 && (
            <Grid item xs={12}>
              {renderError()}
            </Grid>
          )}

          {(!errors || errors.length === 0) && (
            <Grid item xs={12}>
              <InvoiceReport
                ref={componentRef as unknown as any}
                banks={banks}
                items={itemsToDisplay}
                branch={branch || {}}
                invoiceMonth={invoiceMonth}
                dueDate={dueDate}
              />
            </Grid>
          )}
        </Grid>
      </Paper>
    </div>
  );
};

export default ViewInvoiceReport;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 12 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
