import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Typography,
  Tooltip
} from '@mui/material'
import {
  Print as PrintIcon,
  Refresh as RefreshIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material'
import { useReactToPrint } from 'react-to-print'
import DataSourceReport from 'components/report/DataSourceReport'
import { Props } from 'types'
import { useBranch, useDrive, useReport } from 'hooks'
import { BranchItemState } from 'types/state'
import styles from './viewSummaryReport.module.css'

const ViewSummaryReport: React.FC<Props> = (props) => {
  const { branches, fetchBranch, loading } = useBranch()
  const { fetchSheets, loading: driveLoading } = useDrive()
  const { items, errors, fetchReport, clearReport, ...report } = useReport()

  const [branch, setBranch] = useState<BranchItemState | undefined>(undefined)
  const [sheetId, setSheetId] = useState<number | undefined>(undefined)
  const [displaySummary, setDisplaySummary] = useState(false)

  const componentRef = useRef<any>(undefined)

  const handlePrintClick = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `summary_${branch?.name || 'report'}_${report.sheet?.title || 'report'}`
  })

  useEffect(() => {
    clearReport()
    fetchBranch()
  }, [clearReport, fetchBranch])

  const handleChange = useCallback(
    (event: any, name: string) => {
      if (name === 'branch') {
        setSheetId(undefined)

        const branch = branches.find((i) => i._id === event.target.value)
        if (branch) {
          setBranch(branch)
          fetchSheets([branch])
        }
      } else if (name === 'sheet') {
        setSheetId(event.target.value)
        if (branch && branch.spreadSheetId) {
          fetchReport(branch.spreadSheetId, event.target.value)
        }
      }
    },
    [branch, branches, fetchSheets, fetchReport]
  )

  useEffect(() => {
    if (branch && branch.sheets && branch.sheets.length > 0) {
      setSheetId(branch.sheets[0].sheetId)
      handleChange({ target: { value: branch.sheets[0].sheetId } }, 'sheet')
    }
  }, [branch, branch?.sheets, handleChange])

  const handleCheckChange = useCallback((event: any) => {
    setDisplaySummary(event.target.checked)
  }, [])

  const handleRefreshClick = useCallback(() => {
    if (branch && branch.spreadSheetId && sheetId) fetchReport(branch.spreadSheetId, sheetId)
  }, [fetchReport, branch, sheetId])

  const handleExportPdf = useCallback(async () => {
    if (!componentRef.current) return

    const html2pdf = (await import('html2pdf.js')).default
    const element = componentRef.current
    const sheetTitle = report.sheet?.title || 'report'
    const filename = `summary_${branch?.name || 'report'}_${sheetTitle}.pdf`

    // Add pdf-export class for white background styling
    element.classList.add('pdf-export')

    const opt = {
      margin: 0,
      filename,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'mm' as const, format: 'a4', orientation: 'landscape' as const }
    }

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        // Remove pdf-export class after save
        element.classList.remove('pdf-export')
      })
  }, [branch, report.sheet])

  const renderFilter = useCallback(() => {
    return (
      <Box className={styles.filter}>
        <Grid container alignItems="center">
          <Grid size={{ xs: 12, md: 6, lg: 3 }} className={styles.filterBox}>
            <FormControl fullWidth className={styles.formControl} variant="outlined">
              <InputLabel id="branch-select-label">Branch</InputLabel>
              <Select
                labelId="branch-select-label"
                id="branch-select"
                value={branch?._id || ''}
                label="Branch"
                onChange={(event) => handleChange(event, 'branch')}
              >
                {branches &&
                  branches.map((branch) => {
                    if (branch) {
                      return (
                        <MenuItem key={branch._id} value={branch._id}>
                          {branch.name}
                        </MenuItem>
                      )
                    }
                  })}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 3 }} className={styles.filterBox}>
            <FormControl fullWidth className={styles.formControl} variant="outlined">
              <InputLabel id="sheet-select-label">Sheet</InputLabel>
              <Select
                labelId="sheet-select-label"
                id="sheet-select"
                value={sheetId || ''}
                label="Sheet"
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
                    )
                  })}
              </Select>
            </FormControl>
          </Grid>
          <Grid
            size={{ xs: 6, md: 6, lg: 2 }}
            className={styles.filterBox}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
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
          </Grid>
          <Grid
            size={{ xs: 6, sm: 3, md: 3, lg: 2 }}
            className={styles.filterBox}
            sx={{ display: { xs: 'none', sm: 'block' } }}
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
                sx={{ height: '44px', minWidth: '44px' }}
              >
                <PrintIcon />
              </Button>
            </Tooltip>
          </Grid>
          {/* PDF Button - Hidden for now
          <Grid
            size={{ xs: 6, sm: 3, md: 3, lg: 2 }}
            className={styles.filterBox}
            sx={{ display: { xs: "none", sm: "block" } }}
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
          <Grid
            size={{ xs: 12, sm: 3, md: 3, lg: 2 }}
            className={styles.filterBox}
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}
          >
            <Box
              sx={{
                display: { xs: 'flex', sm: 'none' },
                width: '100%',
                gap: 1
              }}
            >
              <Tooltip title="Print">
                <Button
                  variant="outlined"
                  fullWidth
                  disabled={!sheetId || (errors && errors?.length > 0)}
                  onClick={handlePrintClick}
                  className={`${styles.button} ${styles.printButton}`}
                  sx={{ height: '44px', flex: 1, minWidth: '44px' }}
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
                  sx={{ height: '44px', flex: 1, minWidth: '44px' }}
                >
                  <RefreshIcon />
                </Button>
              </Tooltip>
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' }, width: '100%' }}>
              <Tooltip title="Refresh">
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  fullWidth
                  className={`${styles.button} ${styles.refreshButton}`}
                  disabled={sheetId === undefined}
                  onClick={handleRefreshClick}
                  sx={{ height: '44px', minWidth: '44px' }}
                >
                  <RefreshIcon />
                </Button>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Box>
    )
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
    handleExportPdf
  ])

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
      )
    }
  }, [items, branch, report.sheet, displaySummary])

  const renderError = useCallback(() => {
    if (branch && errors) {
      return (
        <Paper className={styles.paperError} elevation={0}>
          <Typography
            variant="h6"
            gutterBottom
            color="error"
            sx={{
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <i className="fa-solid fa-triangle-exclamation"></i> Sheet Error
          </Typography>
          <Typography variant="body2" gutterBottom>
            Error in:{' '}
            <a
              href={`https://docs.google.com/spreadsheets/d/${branch?.spreadSheetId}#gid=${report.sheet?.sheetId}`}
              target="_blank"
              rel="noreferrer"
              style={{
                color: 'inherit',
                textDecoration: 'underline',
                fontWeight: 600
              }}
            >
              {`${branch?.spreadSheetName} - ${report.sheet?.title}`}
            </a>
          </Typography>
          <List dense>
            {errors.map((err, index) => {
              return (
                <ListItem key={index} disablePadding>
                  <ListItemButton sx={{ borderRadius: 1 }}>
                    <ListItemText
                      primary={err}
                      primaryTypographyProps={{
                        color: 'error',
                        variant: 'body2'
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              )
            })}
          </List>
        </Paper>
      )
    }
  }, [branch, errors, report.sheet])

  return (
    <div className={styles.root}>
      <Typography variant="h4" className={styles.headerTitle}>
        Summary Report
      </Typography>
      <Paper className={styles.paper} elevation={0}>
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-end">
          <Grid size={{ xs: 12 }}>
            {renderFilter()}
            {(loading || report.loading || driveLoading) && (
              <Box sx={{ width: '100%', mt: 2 }}>
                <LinearProgress sx={{ borderRadius: 1 }} />
              </Box>
            )}
          </Grid>

          {errors && errors.length > 0 && <Grid size={{ xs: 12 }}>{renderError()}</Grid>}

          {(!errors || errors.length === 0) && <Grid size={{ xs: 12 }}>{renderReportData()}</Grid>}
        </Grid>
      </Paper>
    </div>
  )
}

export default ViewSummaryReport
