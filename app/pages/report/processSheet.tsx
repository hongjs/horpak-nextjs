import React, { useEffect, useCallback } from 'react'
import {
  Avatar,
  Box,
  CircularProgress,
  Grid,
  Paper,
  LinearProgress,
  MenuItem,
  TextField,
  Typography,
  Card,
  CardContent,
  Container,
  Stack,
  Button,
  useTheme,
  alpha,
  Divider,
  Chip,
  Link as MuiLink
} from '@mui/material'
import {
  Place as PlaceIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayArrowIcon,
  Description as DescriptionIcon,
  AccessTime as AccessTimeIcon,
  Error as ErrorIcon
} from '@mui/icons-material'
import { format, parseISO } from 'date-fns'

import { useBranch, useDrive } from 'hooks'
import { BranchItemState, DriveSheetItem } from 'types/state'

const ProcessSheet: React.FC = () => {
  const theme = useTheme()
  const { fetchBranch, branches, loading, sheetSelect } = useBranch()
  const { fetchSheets, processData, loading: driveLoading } = useDrive()

  useEffect(() => {
    fetchBranch()
  }, [fetchBranch])

  useEffect(() => {
    if (branches.every((i) => !i.sheets || i.sheets.length === 0)) {
      fetchSheets(branches)
    }
  }, [fetchSheets, branches])

  const handleProcessClick = useCallback(
    (branch: BranchItemState) => {
      if (branch._id && branch.spreadSheetId && branch.sheetId) {
        processData(branch._id, branch.spreadSheetId, branch.sheetId)
      }
    },
    [processData]
  )

  const handleSheetChange = useCallback(
    (event: any, branch: BranchItemState) => {
      if (branch && branch._id) {
        sheetSelect(branch._id, event.target.value)
      }
    },
    [sheetSelect]
  )

  const isItemDisabled = (item: BranchItemState) => {
    return item.processing !== undefined || item.sheetId === undefined || !item.sheetId
  }

  const getButtonContent = (item: BranchItemState) => {
    if (item.processing === true) {
      return (
        <>
          <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
          Processing...
        </>
      )
    }
    if (item.processing === false) {
      return (
        <>
          <CheckCircleIcon sx={{ mr: 1 }} />
          Done
        </>
      )
    }
    return (
      <>
        <PlayArrowIcon sx={{ mr: 1 }} />
        Process
      </>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        {/* Header */}
        <Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 1,
              background:
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(45deg, #90CAF9 30%, #66BB6A 90%)'
                  : 'linear-gradient(45deg, #4285F4 30%, #34A853 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}
          >
            Process Sheet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
            Manage automation and spreadsheet processing across all branches.
          </Typography>
        </Box>

        {(loading || driveLoading) && (
          <LinearProgress
            sx={{
              borderRadius: 1,
              height: 8,
              backgroundColor: alpha(theme.palette.primary.main, 0.12),
              '& .MuiLinearProgress-bar': {
                borderRadius: 1
              }
            }}
          />
        )}

        {/* Using standard MUI Grid - assuming v6 or v2 adapter based on usage of 'size' prop */}
        <Grid container spacing={3}>
          {branches.map((branch) => (
            <Grid size={{ xs: 12 }} key={branch._id}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: theme.shadows[2],
                  backgroundColor: theme.palette.background.paper,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: theme.shadows[8],
                    transform: 'translateY(-2px)',
                    borderColor: alpha(theme.palette.primary.main, 0.3)
                  }
                }}
              >
                <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                  <Grid container spacing={3} alignItems="center">
                    {/* Icon Section */}
                    <Grid size={{ xs: 12, sm: 'auto' }} display="flex" justifyContent="center">
                      <Avatar
                        sx={{
                          width: 64,
                          height: 64,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          boxShadow: `0 0 0 8px ${alpha(theme.palette.primary.main, 0.05)}`
                        }}
                      >
                        <PlaceIcon fontSize="large" />
                      </Avatar>
                    </Grid>

                    {/* Info Section */}
                    <Grid size={{ xs: 12, sm: 'grow' }}>
                      <Stack spacing={1}>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{
                            color: 'secondary.main'
                          }}
                        >
                          {branch.name}
                        </Typography>

                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems="center"
                          flexWrap="wrap"
                          gap={1}
                        >
                          {/* Spreadsheet Link */}
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <DescriptionIcon fontSize="small" color="action" />
                            <MuiLink
                              href={`https://docs.google.com/spreadsheets/d/${branch.spreadSheetId}`}
                              target="_blank"
                              rel="noreferrer"
                              underline="hover"
                              color="primary"
                              sx={{ fontWeight: 600, fontSize: '0.875rem' }}
                            >
                              {branch.spreadSheetName || 'Open Spreadsheet'}
                            </MuiLink>
                          </Stack>

                          <Divider
                            orientation="vertical"
                            flexItem
                            sx={{ display: { xs: 'none', md: 'block' } }}
                          />

                          {/* Last Processed */}
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <AccessTimeIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              Last process:{' '}
                              {branch.lastProcessSheet
                                ? format(
                                    parseISO(branch.lastProcessSheet.toString()),
                                    'yyyy-MM-dd HH:mm'
                                  )
                                : 'Never'}
                            </Typography>
                          </Stack>
                        </Stack>

                        {/* Error Message */}
                        {branch.error && (
                          <Chip
                            icon={<ErrorIcon />}
                            label={branch.error}
                            color="error"
                            variant="outlined"
                            size="small"
                            sx={{ alignSelf: 'flex-start', mt: 1 }}
                          />
                        )}
                      </Stack>
                    </Grid>

                    {/* Actions Section */}
                    <Grid size={{ xs: 12, md: 'auto' }} sx={{ minWidth: 200 }}>
                      <Stack
                        spacing={2}
                        direction={{ xs: 'column', sm: 'row', md: 'column' }}
                        alignItems="stretch"
                      >
                        <TextField
                          select
                          label="Select Sheet"
                          value={branch.sheetId || ''}
                          onChange={(e) => handleSheetChange(e, branch)}
                          size="small"
                          fullWidth
                          sx={{ minWidth: 160 }}
                        >
                          {branch.sheets?.map((sheet: DriveSheetItem) => (
                            <MenuItem key={sheet.sheetId} value={sheet.sheetId}>
                              {sheet.title}
                            </MenuItem>
                          )) || (
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                          )}
                        </TextField>

                        <Button
                          variant="contained"
                          color={branch.processing === false ? 'success' : 'primary'}
                          onClick={() => handleProcessClick(branch)}
                          disabled={isItemDisabled(branch)}
                          fullWidth
                          sx={{
                            fontWeight: 700,
                            py: 1,
                            boxShadow:
                              branch.processing === false
                                ? '0 8px 16px 0 rgba(52, 168, 83, 0.24)'
                                : '0 8px 16px 0 rgba(66, 133, 244, 0.24)',
                            '&:disabled': {
                              // Maintain visibility even when disabled if it is "Done"
                              backgroundColor:
                                branch.processing === false
                                  ? alpha(theme.palette.success.main, 0.8)
                                  : undefined,
                              color: branch.processing === false ? '#fff' : undefined
                            }
                          }}
                        >
                          {getButtonContent(branch)}
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Container>
  )
}

export default ProcessSheet
