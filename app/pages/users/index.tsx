import React, { useCallback, useMemo, useState } from 'react'
import type { GetServerSideProps } from 'next'
import Image from 'next/image'
import { getSession } from 'next-auth/react'
import {
  Box,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  Stack,
  useTheme,
  alpha,
  Chip,
  Avatar,
  Alert
} from '@mui/material'
import {
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  CheckCircle as CheckIcon,
  Cancel as UncheckIcon
} from '@mui/icons-material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useUser, useAlert } from 'hooks'
import { getUser, checkAdmin } from 'lib/firebaseUtil'
import ConfirmDialog from 'components/ConfirmDialog'

type Props = {
  isAdmin: boolean
  noAdmin: boolean
  email: string
}

const UserList: React.FC<Props> = ({ isAdmin, noAdmin, email }) => {
  const theme = useTheme()
  const { users, toggleUserStatus } = useUser()
  const { openAlert } = useAlert()
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState({ id: '', name: '', active: false })

  const handleToggleClick = useCallback((row: any) => {
    setOpen(true)
    setCurrent({ id: row.id, name: row.name, active: row.active })
  }, [])

  const handleSave = useCallback(() => {
    if (current) {
      toggleUserStatus(current.id)
      openAlert('Saved successful', 'success')
    }

    setCurrent({ id: '', name: '', active: false })
    setOpen(false)
  }, [current, openAlert, toggleUserStatus])

  const handleCancel = useCallback(() => {
    setCurrent({ id: '', name: '', active: false })
    setOpen(false)
  }, [])

  const columns: GridColDef[] = useMemo(() => {
    return [
      {
        field: 'image',
        headerName: 'User',
        sortable: false,
        width: 80,
        renderCell: (params: GridRenderCellParams) => (
          <Avatar
            src={params.row.image || ''}
            alt={params.row.name}
            sx={{
              width: 40,
              height: 40,
              border: `2px solid ${theme.palette.background.paper}`,
              boxShadow: theme.shadows[2]
            }}
          />
        )
      },
      {
        field: 'name',
        headerName: 'Name',
        width: 200,
        renderCell: (params: GridRenderCellParams) => (
          <Typography variant="body2" fontWeight="600" color="text.primary">
            {params.row.name}
          </Typography>
        )
      },
      { field: 'email', headerName: 'Email', width: 250 },

      {
        field: 'active',
        headerName: 'Status',
        width: 120,
        renderCell: (params: GridRenderCellParams) => {
          return (
            <Chip
              label={params.row.active ? 'Active' : 'Inactive'}
              size="small"
              color={params.row.active ? 'success' : 'default'}
              variant={params.row.active ? 'filled' : 'outlined'}
              icon={params.row.active ? <CheckIcon /> : <UncheckIcon />}
            />
          )
        }
      },
      {
        field: 'admin',
        headerName: 'Role',
        width: 120,
        renderCell: (params: GridRenderCellParams) => {
          return params.row.admin ? (
            <Chip
              label="Admin"
              size="small"
              color="primary"
              icon={<AdminIcon />}
              sx={{ fontWeight: 'bold' }}
            />
          ) : (
            <Chip label="User" size="small" variant="outlined" icon={<PersonIcon />} />
          )
        }
      },

      {
        field: 'action',
        headerName: 'Actions',
        sortable: false,
        width: 150,
        renderCell: (params: GridRenderCellParams) => {
          const isDisabled = !noAdmin && (!isAdmin || email === params.row.email)
          return (
            <Button
              variant="outlined"
              size="small"
              color={params.row.active ? 'warning' : 'success'}
              disabled={isDisabled}
              onClick={() => handleToggleClick(params.row)}
              sx={{ borderRadius: 2 }}
            >
              {params.row.active ? 'Deactivate' : 'Activate'}
            </Button>
          )
        }
      }
    ]
  }, [handleToggleClick, email, isAdmin, noAdmin, theme])

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
            Team Members
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage user access and administrative privileges.
          </Typography>
        </Box>

        {noAdmin && (
          <Alert severity="info" variant="filled" sx={{ borderRadius: 2 }}>
            System Notification: The first active user will automatically be assigned as Admin.
          </Alert>
        )}

        <Card
          sx={{
            borderRadius: 4,
            boxShadow: theme.shadows[4],
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            overflow: 'hidden'
          }}
        >
          <DataGrid
            rows={users || []}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } }
            }}
            pageSizeOptions={[5, 10, 20]}
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
        onOk={handleSave}
        onClose={handleCancel}
        content={
          <Box>
            <Typography variant="body1">
              Are you sure you want to change status for{' '}
              <Typography component="span" fontWeight="bold" color="primary">
                {current.name}
              </Typography>{' '}
              to{' '}
              <Typography
                component="span"
                fontWeight="bold"
                color={current.active ? 'warning.main' : 'success.main'}
              >
                {current.active ? 'Inactive' : 'Active'}
              </Typography>
              ?
            </Typography>
          </Box>
        }
      />
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  if (session?.user?.email) {
    const user = await getUser(session?.user?.email)
    const noAdmin = await checkAdmin()
    return {
      props: {
        noAdmin,
        isAdmin: user?.admin ?? false,
        email: session?.user?.email
      }
    }
  }

  return { props: { noAdmin: false, isAdmin: false, email: '' } }
}

export default UserList
