import React, { useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Box, Fab, IconButton, Typography } from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { format as dateFormat, parseISO } from 'date-fns';
import { useBank } from 'hooks/useBank';

import styles from './index.module.css';

const BankList = () => {
  const router = useRouter();
  const { banks, fetchBank, deleteBank } = useBank();

  useEffect(() => {
    fetchBank();
  }, [fetchBank]);

  const handleDeleteClick = useCallback(
    (event: any, id: string) => {
      event.stopPropagation();
      deleteBank(id);
    },
    [deleteBank]
  );

  const columns = useMemo(() => {
    return [
      { field: 'bankId', headerName: 'Bank Id', width: 70 },
      {
        field: 'bankName',
        headerName: 'Bank',
        width: 150,
      },
      { field: 'accountNo', headerName: 'Account No', width: 150 },
      { field: 'accountName', headerName: 'Account Name', width: 250 },
      { field: 'remark', headerName: 'Remark', width: 150 },
      {
        field: 'modifiedDate',
        headerName: 'Modified Date',
        width: 200,
        renderCell: (params: any) => {
          return (
            <span>
              {dateFormat(
                parseISO(params.row.modifiedDate),
                'yyyy-MM-dd HH:mm'
              )}
            </span>
          );
        },
      },
      {
        field: 'edit',
        headerName: 'Edit',
        width: 70,
        renderCell: (params: any) => {
          return (
            <section>
              <Link href={`/bank/${params.row._id}`}>
                <EditIcon />
              </Link>
            </section>
          );
        },
      },
      {
        field: 'delete',
        headerName: 'Delete',
        width: 70,
        renderCell: (params: any) => {
          return (
            <section>
              <IconButton
                onClick={(event) => handleDeleteClick(event, params.row._id)}
              >
                <DeleteIcon />
              </IconButton>
            </section>
          );
        },
      },
    ];
  }, [handleDeleteClick]);

  return (
    <Box className={styles.root}>
      <Box sx={{ textAlign: 'left' }}>
        <Typography variant="h5" gutterBottom>
          Bank List
        </Typography>
      </Box>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={banks || []}
          columns={columns}
          pageSize={10}
          checkboxSelection={false}
          hideFooterSelectedRowCount={true}
          rowsPerPageOptions={[10, 20, 50]}
          getRowId={(row: any) => row._id}
        />
      </Box>
      <Fab
        color="primary"
        className={styles.fab}
        aria-label="add"
        onClick={() => {
          router.push('/bank/new');
        }}
      >
        <AddIcon className={styles.fabIcon} />
      </Fab>
    </Box>
  );
};

export default BankList;
