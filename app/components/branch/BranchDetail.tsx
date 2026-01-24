import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Card,
  CardContent,
  Stack,
  InputAdornment,
  Avatar,
  Chip,
  useTheme,
  alpha,
  Alert
} from '@mui/material'
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Store as StoreIcon,
  Description as SheetIcon,
  FolderOpen as BrowseIcon,
  Link as LinkIcon,
  Google as GoogleIcon
} from '@mui/icons-material'
import { useAlert, useBranch, useDrive } from 'hooks'
import { BranchItemState, DriveItem } from 'types/state'
import ConfirmDialog from 'components/ConfirmDialog'
import SpreadsheetDialog from 'components/SpreadsheetDialog'

export const FOLDER = 'application/vnd.google-apps.folder'

type BranchDetailProps = {
  id: string | null
}

const BranchDetail: React.FC<BranchDetailProps> = ({ id }) => {
  const router = useRouter()
  const theme = useTheme()
  const { openAlert } = useAlert()
  const { item, saved, getBranch, saveBranch } = useBranch()
  const { fetchDrive, checkToken, hasToken } = useDrive()
  const [data, setData] = useState<BranchItemState>({})
  const [open, setOpen] = useState(false)
  const [openSheet, setOpenSheet] = useState(false)

  useEffect(() => {
    checkToken()
  }, [checkToken])

  useEffect(() => {
    getBranch(id)
  }, [id, getBranch])

  useEffect(() => {
    if (item) setData(item)
    else setData({})
  }, [item])

  useEffect(() => {
    if (saved) {
      router.push('/branch')
    }
  }, [router, saved])

  useEffect(() => {
    if (openSheet === true) fetchDrive('root')
  }, [openSheet, fetchDrive])

  const handleTextChange = useCallback((name: string, value: string) => {
    setData((prev) => {
      return { ...prev, [name]: value }
    })
  }, [])

  const handleSaveClick = useCallback(() => {
    if (!data.name) {
      openAlert('Name is required.', 'warning')
      return
    } else if (!data.reportHeader) {
      openAlert('Header is required.', 'warning')
      return
    } else if (!data.spreadSheetId) {
      openAlert('Spreadsheet is required.', 'warning')
      return
    }

    setOpen(true)
  }, [data, openAlert])

  const handleSave = useCallback(() => {
    saveBranch(data)
  }, [data, saveBranch])

  const handleCancel = useCallback(() => {
    setOpen(false)
  }, [])

  const handleSheetSelected = useCallback((item: DriveItem) => {
    setOpenSheet(false)
    setData((prev) => {
      return {
        ...prev,
        spreadSheetId: item.id,
        spreadSheetName: item.name
      }
    })
  }, [])

  const handleSheetClose = useCallback(() => {
    setOpenSheet(false)
  }, [])

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Card
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 800,
          borderRadius: 3,
          boxShadow: theme.shadows[3],
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={4}>
            {/* Header Section */}
            <Grid size={{ xs: 12 }}>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main,
                    width: 56,
                    height: 56
                  }}
                >
                  <StoreIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Branch Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Configure branch information and reporting settings.
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                id="branch-name"
                label="Branch Name"
                fullWidth
                value={data?.name || ''}
                onChange={(e) => handleTextChange('name', e.target.value)}
                variant="outlined"
              />
            </Grid>

            {/* Spreadsheet Integration Section */}
            <Grid size={{ xs: 12 }}>
              <Card
                variant="outlined"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.02),
                  borderColor: alpha(theme.palette.primary.main, 0.2)
                }}
              >
                <CardContent sx={{ py: 2 }}>
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <SheetIcon color="action" />
                      <Typography variant="subtitle2" fontWeight="bold">
                        Google Spreadsheet Integration
                      </Typography>
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                      <TextField
                        fullWidth
                        size="small"
                        value={data?.spreadSheetName || ''}
                        placeholder="Select a spreadsheet..."
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <InputAdornment position="start">
                              <LinkIcon fontSize="small" />
                            </InputAdornment>
                          )
                        }}
                        helperText={
                          data?.spreadSheetId
                            ? `ID: ${data.spreadSheetId}`
                            : 'Link this branch to a Google Sheet'
                        }
                      />
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mt: { xs: 1, sm: 0 }, minHeight: 40 }}
                      >
                        {hasToken ? (
                          <Button
                            variant="outlined"
                            startIcon={<BrowseIcon />}
                            onClick={() => setOpenSheet(true)}
                            sx={{ whiteSpace: 'nowrap', height: 40 }}
                          >
                            Browse Drive
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="warning"
                            startIcon={<GoogleIcon />}
                            onClick={() => router.push('/admin/datasource')}
                            sx={{ whiteSpace: 'nowrap', height: 40 }}
                          >
                            Authorize
                          </Button>
                        )}
                        {data?.spreadSheetId && (
                          <Button
                            variant="outlined"
                            color="info"
                            href={`https://docs.google.com/spreadsheets/d/${data.spreadSheetId}`}
                            target="_blank"
                            rel="noreferrer"
                            sx={{ height: 40, minWidth: 40, px: 0 }}
                          >
                            <LinkIcon />
                          </Button>
                        )}
                      </Stack>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                Report Configuration
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                id="report-header"
                label="Report Header"
                fullWidth
                value={data?.reportHeader || ''}
                onChange={(e) => handleTextChange('reportHeader', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                id="report-contact"
                label="Report Contact Info"
                fullWidth
                value={data?.reportContact || ''}
                onChange={(e) => handleTextChange('reportContact', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                id="report-address"
                label="Report Address"
                fullWidth
                multiline
                rows={2}
                value={data?.reportAddress || ''}
                onChange={(e) => handleTextChange('reportAddress', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                id="report-remark"
                label="Report Footer Remarks"
                fullWidth
                multiline
                rows={4}
                value={data?.reportRemark || ''}
                onChange={(e) => handleTextChange('reportRemark', e.target.value)}
                helperText={
                  <Typography variant="caption" component="span">
                    Available parameters:{' '}
                    <Chip size="small" label="@BANK" sx={{ height: 20, fontSize: '0.7rem' }} />{' '}
                    <Chip
                      size="small"
                      label="@ACCOUNT_NAME"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />{' '}
                    <Chip
                      size="small"
                      label="@ACCOUNT_NO"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                    . Use "|" for new lines.
                  </Typography>
                }
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => router.push('/branch')}
                  size="large"
                  sx={{ borderRadius: 2, px: 4 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveClick}
                  size="large"
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    boxShadow: '0 8px 16px 0 rgba(66, 133, 244, 0.24)'
                  }}
                >
                  Save
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={open}
        onOk={handleSave}
        onClose={handleCancel}
        title="Save Branch?"
        content="Are you sure you want to save these branch settings?"
        okButtonText="Save Changes"
      />
      <SpreadsheetDialog open={openSheet} onSave={handleSheetSelected} onClose={handleSheetClose} />
    </Box>
  )
}

export default BranchDetail
