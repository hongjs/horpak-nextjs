import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  IconButton,
  Typography,
  Container,
  Stack,
  Button,
  Card,
  useTheme,
  alpha,
  Tooltip,
  Link as MuiLink
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Store as StoreIcon,
  Description as SheetIcon
} from '@mui/icons-material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { format as dateFormat, parseISO } from 'date-fns'
import { useBranch } from 'hooks'
import ConfirmDialog from 'components/ConfirmDialog'

const BranchList: React.FC = () => {
  const router = useRouter()
  const theme = useTheme()
  const { branches, fetchBranch, deleteBranch } = useBranch()
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState({ id: '', name: '' })

  useEffect(() => {
    fetchBranch()
  }, [fetchBranch])

  const handleDeleteClick = useCallback((event: any, row: any) => {
    setOpen(true)
    setCurrent(row)
    event.stopPropagation()
  }, [])

  const handleDelete = useCallback(() => {
    if (current) deleteBranch(current.id)

    setCurrent({ id: '', name: '' })
    setOpen(false)
  }, [current, deleteBranch])

  const handleCancel = useCallback(() => {
    setCurrent({ id: '', name: '' })
    setOpen(false)
  }, [])

  const columns: GridColDef[] = useMemo(() => {
    return [
      {
        field: 'name',
        headerName: 'Branch Name',
        width: 200,
        renderCell: (params: GridRenderCellParams) => (
          <Stack direction="row" spacing={1} alignItems="center">
            <StoreIcon color="primary" fontSize="small" />
            <Typography variant="body2" fontWeight="600">
              {params.row.name}
            </Typography>
          </Stack>
        )
      },
      {
        field: 'spreadSheetName',
        headerName: 'Spreadsheet',
        width: 250,
        renderCell: (params: any) => {
          return (
            <Stack direction="row" alignItems="center" spacing={1}>
              <SheetIcon fontSize="small" color="action" />
              <MuiLink
                href={`https://docs.google.com/spreadsheets/d/${params.row.spreadSheetId}`}
                target="_blank"
                rel="noreferrer"
                underline="hover"
                sx={{ fontWeight: 500 }}
              >
                {params.row.spreadSheetName || 'Open Spreadsheet'}
              </MuiLink>
            </Stack>
          )
        }
      },
      { field: 'modifiedBy', headerName: 'Modified by', width: 200 },
      {
        field: 'modifiedDate',
        headerName: 'Last Modified',
        width: 180,
        renderCell: (params: any) => {
          return (
            <Typography variant="body2" color="text.secondary">
              {dateFormat(parseISO(params.row.modifiedDate), 'yyyy-MM-dd HH:mm')}
            </Typography>
          )
        }
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        sortable: false,
        renderCell: (params: any) => {
          return (
            <Stack direction="row" spacing={1}>
              <Tooltip title="Edit">
                <IconButton
                  size="small"
                  onClick={() => router.push(`/branch/edit/${params.row._id}`)}
                  sx={{
                    color: theme.palette.info.main,
                    bgcolor: alpha(theme.palette.info.main, 0.1)
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  onClick={(event) => {
                    const data = {
                      id: params.row._id,
                      name: params.row.name
                    }
                    handleDeleteClick(event, data)
                  }}
                  sx={{
                    color: theme.palette.error.main,
                    bgcolor: alpha(theme.palette.error.main, 0.1)
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          )
        }
      }
    ]
  }, [router, handleDeleteClick, theme])

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        {/* Header */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'start', sm: 'center' }}
          spacing={2}
        >
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
              Branches
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage physical locations and their associated data.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/branch/new')}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontWeight: 700,
              boxShadow: '0 8px 16px 0 rgba(66, 133, 244, 0.24)'
            }}
          >
            New Branch
          </Button>
        </Stack>

        <Card
          sx={{
            borderRadius: 4,
            boxShadow: theme.shadows[4],
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            overflow: 'hidden'
          }}
        >
          <DataGrid
            rows={branches || []}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } }
            }}
            pageSizeOptions={[10, 20, 50]}
            getRowId={(row: any) => row._id}
            disableRowSelectionOnClick
            autoHeight
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': {
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 700,
                color: theme.palette.text.primary
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.02)
              },
              '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader': {
                px: 3
              }
            }}
          />
        </Card>
      </Stack>

      <ConfirmDialog
        open={open}
        onOk={handleDelete}
        onClose={handleCancel}
        content={
          <Box>
            <Typography variant="body1">
              Are you sure you want to delete{' '}
              <Typography component="span" fontWeight="bold" color="error">
                {current.name}
              </Typography>
              ?
            </Typography>
          </Box>
        }
        okButtonText="Delete"
      />
    </Container>
  )
}

export default BranchList
