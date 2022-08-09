import React, { useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Button, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  CheckBoxOutlined as CheckIcon,
  CheckBoxOutlineBlank as UncheckIcon,
} from '@mui/icons-material';
import { useAppContext } from 'contexts/AppContext';
import { fetchUsers, toggleUserStatus } from 'actions/userAction';
import { Box } from '@mui/system';

const UserList = () => {
  const { state, dispatch } = useAppContext();

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
              disabled={!!params.row.admin}
              onClick={() => {
                if (params.row.admin) return;
                toggleUserStatus(dispatch, params.row.id);
              }}
            >
              {params.row.active ? 'Inactive' : 'Active'}
            </Button>
          );
        },
      },
    ];
  }, []);

  useEffect(() => {
    fetchUsers(dispatch);
  }, [dispatch]);

  return (
    <>
      <Box sx={{ textAlign: 'left' }}>
        <Typography variant="h3" gutterBottom>
          User List
        </Typography>
      </Box>
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={state.users || []}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </div>
    </>
  );
};

export default UserList;
