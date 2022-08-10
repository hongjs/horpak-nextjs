import React, { useMemo } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Box, Button, Typography } from '@mui/material';
import {
  CheckBoxOutlined as CheckIcon,
  CheckBoxOutlineBlank as UncheckIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useUser, useSnackbar } from 'hooks';

const UserList = () => {
  const session = useSession();
  const { users, toggleUserStatus } = useUser();
  const { setAlert } = useSnackbar();

  const currentUser = useMemo(() => {
    if (session && session.data && session.data.user)
      return session.data.user.email;

    return null;
  }, [session]);

  const columns = useMemo(() => {
    return [
      {
        field: 'image',
        headerName: 'Image',
        sortable: false,
        width: 70,
        renderCell: (params: any) => (
          <Image
            src={params.row.image || ''}
            alt={'user-pic'}
            width={30}
            height={30}
          />
        ),
      },
      { field: 'name', headerName: 'Name', width: 250 },
      { field: 'email', headerName: 'Email', width: 250 },
      {
        field: 'active',
        headerName: 'Active',
        width: 70,
        renderCell: (params: any) => {
          return (
            <>
              {params.row.active ? (
                <CheckIcon color="primary" />
              ) : (
                <UncheckIcon color="primary" />
              )}
            </>
          );
        },
      },
      {
        field: 'action',
        headerName: 'Action',
        sortable: false,
        renderCell: (params: any) => {
          return (
            <Button
              disabled={!!params.row.admin || params.row.email === currentUser}
              onClick={() => {
                if (params.row.admin) return;
                toggleUserStatus(params.row.id);
                setAlert({
                  open: true,
                  message: 'Saved successful',
                  severity: 'success',
                });
              }}
            >
              {params.row.active ? 'Inactive' : 'Active'}
            </Button>
          );
        },
      },
    ];
  }, [currentUser, toggleUserStatus]);

  return (
    <>
      <Box sx={{ textAlign: 'left' }}>
        <Typography variant="h4" gutterBottom>
          User List
        </Typography>
      </Box>
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={users || []}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </div>
    </>
  );
};

export default UserList;
