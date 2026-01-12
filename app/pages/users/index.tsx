import React, { useCallback, useMemo, useState } from 'react';
import type { GetServerSideProps } from 'next';
import Image from 'next/image';
import { getSession } from 'next-auth/react';
import { Box, Button, Typography } from '@mui/material';
import {
  CheckBoxOutlined as CheckIcon,
  CheckBoxOutlineBlank as UncheckIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useUser, useAlert } from 'hooks';
import { getUser, checkAdmin } from 'lib/firebaseUtil';
import ConfirmDialog from 'components/ConfirmDialog';

import styles from './index.module.css';

type Props = {
  isAdmin: boolean;
  noAdmin: boolean;
  email: string;
};

const UserList: React.FC<Props> = ({ isAdmin, noAdmin, email }) => {
  const { users, toggleUserStatus } = useUser();
  const { openAlert } = useAlert();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState({ id: '', name: '', active: false });

  const handleToggleClick = useCallback((row: any) => {
    setOpen(true);
    setCurrent({ id: row.id, name: row.name, active: row.active });
  }, []);

  const handleSave = useCallback(() => {
    if (current) {
      toggleUserStatus(current.id);
      openAlert('Saved successful', 'success');
    }

    setCurrent({ id: '', name: '', active: false });
    setOpen(false);
  }, [current, openAlert, toggleUserStatus]);

  const handleCancel = useCallback(() => {
    setCurrent({ id: '', name: '', active: false });
    setOpen(false);
  }, []);

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
        headerName: 'Admin',
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
              disabled={!noAdmin && (!isAdmin || email === params.row.email)}
              onClick={() => {
                handleToggleClick(params.row);
              }}
            >
              {params.row.active ? 'Inactive' : 'Active'}
            </Button>
          );
        },
      },
    ];
  }, [handleToggleClick, email, isAdmin, noAdmin]);

  return (
    <>
      <Box sx={{ textAlign: 'left' }}>
        <Typography variant="h5" gutterBottom>
          User List
        </Typography>
      </Box>
      {noAdmin && (
        <Box className={styles.announcement}>
          <Typography>First active user will be assigned as Admin.</Typography>
        </Box>
      )}
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={users || []}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10, 20]}
        />
      </div>
      <ConfirmDialog
        open={open}
        onOk={handleSave}
        onClose={handleCancel}
        content={
          <Box>
            {`Are you sure to `}
            <Typography sx={{ fontWeight: 'bold' }} component="span">
              {current.active ? 'Inactive' : 'Active'}
            </Typography>
            {` ${current.name}?`}
          </Box>
        }
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session?.user?.email) {
    const user = await getUser(session?.user?.email);
    const noAdmin = await checkAdmin();
    return {
      props: {
        noAdmin,
        isAdmin: user?.admin ?? false,
        email: session?.user?.email,
      },
    };
  }

  return { props: { noAdmin: false, isAdmin: false, email: '' } };
};

export default UserList;
