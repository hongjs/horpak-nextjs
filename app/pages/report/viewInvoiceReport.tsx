import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
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
  ListItemButton,
} from "@mui/material";
import {
  DesktopDatePicker,
  MobileDatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format as dateFormat, addMonths } from "date-fns";
import {
  Print as PrintIcon,
  Refresh as RefreshIcon,
  PictureAsPdf as PdfIcon,
} from "@mui/icons-material";
import { useReactToPrint } from "react-to-print";
import html2pdf from "html2pdf.js";
import { useBank, useBranch, useDrive, useReport } from "hooks";
import InvoiceReport from "components/report/InvoiceReport";

import styles from "./viewInvoiceReport.module.css";
import { BranchItemState } from "types/state";

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

  const componentRef = useRef<any>(undefined);

  const handlePrintClick = useReactToPrint({
    contentRef: componentRef,
  });

  useEffect(() => {
    setInvoiceMonth(
      new Date(`${dateFormat(addMonths(new Date(), 1), "yyyy-MM")}-01`),
    );
    setDueDate(
      new Date(`${dateFormat(addMonths(new Date(), 1), "yyyy-MM")}-05`),
    );
  }, []);

  useEffect(() => {
    clearReport();
    fetchBranch();
    fetchBank();
  }, [clearReport, fetchBank, fetchBranch]);

  const handleChange = useCallback(
    (event: any, name: string) => {
      if (name === "branch") {
        setSheetId(undefined);

        const branch = branches.find((i) => i._id === event.target.value);
        if (branch) {
          setBranch(branch);
          fetchSheets([branch]);
        }
      } else if (name === "sheet") {
        setSheetId(event.target.value);
        if (branch && branch.spreadSheetId) {
          fetchReport(branch.spreadSheetId, event.target.value);
        }
      } else if (name === "rooms") {
        setRooms(event.target.value);
      } else if (name === "hasName") {
        setHasName(event.target.checked);
      }
    },
    [branch, branches, fetchSheets, fetchReport],
  );

  useEffect(() => {
    if (branch && branch.sheets && branch.sheets.length > 0) {
      setSheetId(branch.sheets[0].sheetId);
      handleChange({ target: { value: branch.sheets[0].sheetId } }, "sheet");
    }
  }, [branch, branch?.sheets, handleChange]);

  const itemsToDisplay = useMemo(() => {
    if (rooms === undefined || rooms.length === 0) {
      return items
        ? hasName === true
          ? items.filter((item) => {
              return item.name !== "";
            })
          : items
        : [];
    } else {
      return items
        ? hasName === true
          ? items.filter((item) => {
              return item.name !== "" && rooms.includes(item.room);
            })
          : items.filter((item) => {
              return rooms.includes(item.room);
            })
        : [];
    }
  }, [items, rooms, hasName]);

  const handleDateChange = useCallback((date: Date | null, name: string) => {
    if (!date) return;
    if (name === "dueDate") {
      setDueDate(date);
    } else if (name === "invoiceMonth") {
      setInvoiceMonth(date);
    }
  }, []);

  const handleRefreshClick = useCallback(() => {
    if (branch && branch.spreadSheetId && sheetId) {
      fetchReport(branch.spreadSheetId, sheetId);
    }
  }, [branch, sheetId, fetchReport]);

  const handleExportPdf = useCallback(() => {
    if (!componentRef.current) return;

    const element = componentRef.current;
    const sheetTitle = report.sheet?.title || "invoice";
    const filename = `invoice_${branch?.name || "report"}_${sheetTitle}.pdf`;

    // Add pdf-export class for white background styling
    element.classList.add("pdf-export");

    const opt = {
      margin: 0,
      filename,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
      jsPDF: { unit: "mm" as const, format: "a4", orientation: "landscape" as const },
    };

    html2pdf().set(opt).from(element).save().then(() => {
      // Remove pdf-export class after save
      element.classList.remove("pdf-export");
    });
  }, [branch, report.sheet]);

  const renderFilter = useCallback(() => {
    return (
      <Box className={styles.filter}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
            <FormControl
              fullWidth
              className={styles.formControl}
              variant="outlined"
            >
              <InputLabel id="branch-select-label">Branch</InputLabel>
              <Select
                labelId="branch-select-label"
                id="branch-select"
                value={branch?._id || ""}
                label="Branch"
                onChange={(event) => handleChange(event, "branch")}
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
          <Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
            <FormControl
              fullWidth
              className={styles.formControl}
              variant="outlined"
            >
              <InputLabel id="sheet-select-label">Sheet</InputLabel>
              <Select
                labelId="sheet-select-label"
                id="sheet-select"
                value={sheetId || ""}
                label="Sheet"
                onChange={(event) => handleChange(event, "sheet")}
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
          <Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns as any}>
              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <DesktopDatePicker
                  label="Invoice date"
                  format="yyyy-MM"
                  openTo="month"
                  views={["year", "month"]}
                  value={invoiceMonth}
                  onChange={(date) => handleDateChange(date, "invoiceMonth")}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      className: styles.formControl,
                    },
                  }}
                />
              </Box>
              <Box sx={{ display: { xs: "block", md: "none" } }}>
                <MobileDatePicker
                  label="Invoice date"
                  format="yyyy-MM"
                  openTo="month"
                  views={["year", "month"]}
                  value={invoiceMonth}
                  onChange={(date) => handleDateChange(date, "invoiceMonth")}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      className: styles.formControl,
                    },
                  }}
                  closeOnSelect
                />
              </Box>
            </LocalizationProvider>
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns as any}>
              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <DesktopDatePicker
                  label="Due date"
                  format="yyyy-MM-dd"
                  value={dueDate}
                  onChange={(date) => handleDateChange(date, "dueDate")}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      className: styles.formControl,
                    },
                  }}
                />
              </Box>
              <Box sx={{ display: { xs: "block", md: "none" } }}>
                <MobileDatePicker
                  label="Due date"
                  format="yyyy-MM-dd"
                  value={dueDate}
                  onChange={(date) => handleDateChange(date, "dueDate")}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      className: styles.formControl,
                    },
                  }}
                  closeOnSelect
                />
              </Box>
            </LocalizationProvider>
          </Grid>
          <Grid size={{ xs: 12, md: 4, lg: 6, xl: 4 }}>
            <Autocomplete
              multiple
              id="room-select"
              options={items ? items.map((item) => item.room) : []}
              disableCloseOnSelect
              value={rooms || []}
              onChange={(event, newValue) => {
                setRooms(newValue as any[]);
              }}
              getOptionLabel={(option) => option.toString()}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox style={{ marginRight: 8 }} checked={selected} />
                  {option}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Rooms"
                  variant="outlined"
                  fullWidth
                  className={styles.formControl}
                />
              )}
              disabled={!items || items.length === 0}
            />
          </Grid>
          <Grid
            size={{ xs: 6, sm: 6, md: 4, lg: 2 }}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <FormControlLabel
              className={styles.formControl}
              control={
                <Checkbox
                  checked={hasName}
                  onChange={(event) => handleChange(event, "hasName")}
                  name="checkedB"
                  color="primary"
                />
              }
              label="has Name only"
            />
          </Grid>

          <Grid
            size={{ xs: 6, sm: 3, md: 2, lg: 2 }}
            sx={{ display: { xs: "none", md: "block" } }}
          >
            <Tooltip title="Print">
              <Button
                variant="outlined"
                color="primary"
                size="large"
                fullWidth
                className={`${styles.button} ${styles.printButton}`}
                disabled={!sheetId || (errors && errors?.length > 0)}
                onClick={handlePrintClick}
                sx={{ height: "44px", minWidth: "44px" }}
              >
                <PrintIcon />
              </Button>
            </Tooltip>
          </Grid>
          <Grid
            size={{ xs: 0, sm: 3, md: 2, lg: 2 }}
            sx={{ display: { xs: "none", md: "block" } }}
          >
            <Tooltip title="Refresh">
              <Button
                variant="outlined"
                color="primary"
                size="large"
                fullWidth
                className={`${styles.button} ${styles.refreshButton}`}
                disabled={sheetId === undefined}
                onClick={handleRefreshClick}
                sx={{ height: "44px", minWidth: "44px" }}
              >
                <RefreshIcon />
              </Button>
            </Tooltip>
          </Grid>
          {/* PDF Button - Hidden for now
          <Grid
            size={{ xs: 0, sm: 3, md: 2, lg: 2 }}
            sx={{ display: { xs: "none", md: "block" } }}
          >
            <Tooltip title="Export PDF">
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                fullWidth
                className={`${styles.button} ${styles.pdfButton}`}
                disabled={!sheetId || (errors && errors?.length > 0)}
                onClick={handleExportPdf}
                sx={{ height: "44px", minWidth: "44px" }}
              >
                <PdfIcon />
              </Button>
            </Tooltip>
          </Grid>
          */}

          {/* Mobile Buttons */}
          <Grid
            size={{ xs: 12 }}
            sx={{
              display: { xs: "flex", md: "none" },
              justifyContent: "flex-end",
              gap: 1,
            }}
          >
            <Tooltip title="Print">
              <Button
                variant="outlined"
                fullWidth
                disabled={!sheetId || (errors && errors?.length > 0)}
                onClick={handlePrintClick}
                className={`${styles.button} ${styles.printButton}`}
                sx={{ height: "44px", flex: 1, minWidth: "44px" }}
              >
                <PrintIcon />
              </Button>
            </Tooltip>
            {/* PDF Button - Hidden for now
            <Tooltip title="Export PDF">
              <Button
                variant="outlined"
                fullWidth
                disabled={!sheetId || (errors && errors?.length > 0)}
                onClick={handleExportPdf}
                className={`${styles.button} ${styles.pdfButton}`}
                sx={{ height: "44px", flex: 1, minWidth: "44px" }}
              >
                <PdfIcon />
              </Button>
            </Tooltip>
            */}
            <Tooltip title="Refresh">
              <Button
                variant="outlined"
                fullWidth
                disabled={sheetId === undefined}
                onClick={handleRefreshClick}
                className={`${styles.button} ${styles.refreshButton}`}
                sx={{ height: "44px", flex: 1, minWidth: "44px" }}
              >
                <RefreshIcon />
              </Button>
            </Tooltip>
          </Grid>
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
    handleExportPdf,
  ]);

  const renderError = useCallback(() => {
    if (branch && errors) {
      return (
        <Paper className={styles.paperError} elevation={0}>
          <Typography
            variant="h6"
            gutterBottom
            color="error"
            sx={{
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <i className="fa-solid fa-triangle-exclamation"></i> Sheet Error
          </Typography>
          <Typography variant="body2" gutterBottom>
            Error in:{" "}
            <a
              href={`https://docs.google.com/spreadsheets/d/${branch?.spreadSheetId}#gid=${report.sheet?.sheetId}`}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "inherit",
                textDecoration: "underline",
                fontWeight: 600,
              }}
            >
              {`${branch?.spreadSheetName} - ${report.sheet?.title}`}
            </a>
          </Typography>
          <List dense>
            {errors.map((error, index) => {
              return (
                <ListItem key={index} disablePadding>
                  <ListItemButton sx={{ borderRadius: 1 }}>
                    <ListItemText
                      primary={error}
                      primaryTypographyProps={{
                        color: "error",
                        variant: "body2",
                      }}
                    />
                  </ListItemButton>
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
      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          width: "100%",
          mb: 0,
        }}
      >
        <Typography variant="h4" className={styles.headerTitle}>
          Invoice Report
        </Typography>
        {itemsToDisplay && items && (
          <Typography
            variant="body1"
            sx={{ color: "text.secondary", fontWeight: 500 }}
          >
            {`Total ${itemsToDisplay.length}/${items.length}`}
          </Typography>
        )}
      </Box>

      <Paper className={styles.paper} elevation={0}>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-end"
        >
          <Grid size={{ xs: 12 }}>
            {renderFilter()}
            {(loading || report.loading || driveLoading || bankLoading) && (
              <Box sx={{ width: "100%", mt: 2 }}>
                <LinearProgress sx={{ borderRadius: 1 }} />
              </Box>
            )}
          </Grid>

          {errors && errors.length > 0 && (
            <Grid size={{ xs: 12 }}>{renderError()}</Grid>
          )}

          {(!errors || errors.length === 0) && (
            <Grid size={{ xs: 12 }}>
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
