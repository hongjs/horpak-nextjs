import React, { useMemo } from 'react';
import Image from 'next/image';
import { getSession } from 'next-auth/react';
import { Box, Button, Typography } from '@mui/material';
import {
  CheckBoxOutlined as CheckIcon,
  CheckBoxOutlineBlank as UncheckIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useUser, useSnackbar } from 'hooks';
import { getUser, checkAdmin } from 'lib/firebaseUtil';

type Props = {
  isAdmin: boolean;
  noAdmin: boolean;
  email: string;
};

const UserList = ({ isAdmin, noAdmin, email }: Props) => {
  const { users, toggleUserStatus } = useUser();
  const { setAlert } = useSnackbar();

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
        field: 'admin',
        headerName: 'admin',
        width: 70,
        renderCell: (params: any) => {
          return (
            <>
              {params.row.admin ? (
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
              // if there is no admin, allow any user to set active
              // First active user will be set ad Admin
              disabled={(!noAdmin && !isAdmin) || email === params.row.email}
              onClick={() => {
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
  }, [toggleUserStatus, setAlert, email, isAdmin, noAdmin]);

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

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx);
  if (session?.user?.email) {
    const user = await getUser(session?.user?.email);
    const noAdmin = await checkAdmin();
    return {
      props: {
        noAdmin: noAdmin,
        isAdmin: user?.admin ?? false,
        email: session?.user?.email,
      },
    };
  }

  return { props: { noAdmin: false, isAdmin: false, email: '' } };
}

export default UserList;
