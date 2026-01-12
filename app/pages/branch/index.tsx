import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Fab, IconButton, Typography } from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { format as dateFormat, parseISO } from 'date-fns';
import { useBranch } from 'hooks';
import ConfirmDialog from 'components/ConfirmDialog';

import styles from './index.module.css';

const BranchList: React.FC = () => {
  const router = useRouter();
  const { branches, fetchBranch, deleteBranch } = useBranch();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState({ id: '', name: '' });

  useEffect(() => {
    fetchBranch();
  }, [fetchBranch]);

  const handleDeleteClick = useCallback((event: any, row: any) => {
    setOpen(true);
    setCurrent(row);
    event.stopPropagation();
  }, []);

  const handleDelete = useCallback(() => {
    if (current) deleteBranch(current.id);

    setCurrent({ id: '', name: '' });
    setOpen(false);
  }, [current, deleteBranch]);

  const handleCancel = useCallback(() => {
    setCurrent({ id: '', name: '' });
    setOpen(false);
  }, []);

  const columns = useMemo(() => {
    return [
      {
        field: 'name',
        headerName: 'Branch',
        width: 150,
      },
      {
        field: 'spreadSheetName',
        headerName: 'Spreadsheet',
        width: 150,
        renderCell: (params: any) => {
          return (
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://docs.google.com/spreadsheets/d/${params.row.spreadSheetId}`}
              style={{ color: 'blue', textDecoration: 'underline' }}
            >
              {params.row.spreadSheetName}
            </a>
          );
        },
      },
      { field: 'modifiedBy', headerName: 'Modified by', width: 150 },
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
              <IconButton
                onClick={() => {
                  router.push(`/branch/edit/${params.row._id}`);
                }}
              >
                <EditIcon />
              </IconButton>
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
                onClick={(event) => {
                  const data = {
                    id: params.row._id,
                    name: params.row.name,
                  };
                  handleDeleteClick(event, data);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </section>
          );
        },
      },
    ];
  }, [router, handleDeleteClick]);

  return (
    <Box className={styles.root}>
      <Box sx={{ textAlign: 'left' }}>
        <Typography variant="h5" gutterBottom>
          Branch List
        </Typography>
      </Box>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={branches || []}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 20, 50]}
          getRowId={(row: any) => row._id}
        />
      </Box>
      <Fab
        color="primary"
        className={styles.fab}
        aria-label="add"
        onClick={() => {
          router.push('/branch/new');
        }}
      >
        <AddIcon className={styles.fabIcon} />
      </Fab>
      <ConfirmDialog
        open={open}
        onOk={handleDelete}
        onClose={handleCancel}
        content={
          <Box>
            Are you sure you want to delete{' '}
            <Typography sx={{ fontWeight: 'bold' }} component="span">
              {current.name}
            </Typography>
            ?
          </Box>
        }
        okButtonText="Delete"
      />
    </Box>
  );
};

export default BranchList;
