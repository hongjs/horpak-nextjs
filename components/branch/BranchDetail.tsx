import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Folder as FolderIcon,
} from '@mui/icons-material';
import { useAlert, useBranch } from 'hooks';
import { BranchItemState } from 'types/state';
import ConfirmDialog from 'components/ConfirmDialog';

import styles from './BranchDetail.module.css';

type BranchDetailProps = {
  id: string | null;
};

const BranchDetail: React.FC<BranchDetailProps> = ({ id }) => {
  const router = useRouter();
  const { item, saved, getBranch, saveBranch } = useBranch();
  const { openAlert } = useAlert();
  const [data, setData] = useState<BranchItemState>({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getBranch(id);
  }, [id, getBranch]);

  useEffect(() => {
    if (item) setData(item);
    else setData({});
  }, [item]);

  useEffect(() => {
    if (saved) {
      router.push('/branch');
    }
  }, [router, saved]);

  const handleTextChange = useCallback((name: string, value: string) => {
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  }, []);

  const handleSaveClick = useCallback(() => {
    setOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    saveBranch(data);
  }, [data, saveBranch]);

  const handleCancel = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Box className={styles.root}>
      <Paper className={styles.paper}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              id="branch-name"
              label="Name"
              className={styles.textField}
              value={data?.name || ''}
              onChange={(e) => handleTextChange('name', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'left', marginLeft: '8px' }}>
            <i className="fa-brands fa-google" /> Speadsheet :{' '}
            {data?.spreadSheetName || ''}
            <Button startIcon={<FolderIcon />}>Browse</Button>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="report-header"
              label="Report Header"
              className={styles.textField}
              value={data?.reportHeader || ''}
              onChange={(e) => handleTextChange('reportHeader', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="report-address"
              label="Report Address"
              className={styles.textField}
              value={data?.reportAddress || ''}
              onChange={(e) =>
                handleTextChange('reportAddress', e.target.value)
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="report-contact"
              label="Report Contact"
              className={styles.textField}
              value={data?.reportContact || ''}
              onChange={(e) =>
                handleTextChange('reportContact', e.target.value)
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="report-remark"
              label="Report Remark"
              className={styles.textField}
              multiline
              rows={6}
              value={data?.reportRemark || ''}
              onChange={(e) => handleTextChange('reportRemark', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography>
              Remark Params: [@BANK], [@ACCOUNT_NAME], [@ACCOUNT_NO], use
              &quot;|&quot; (pipe) for new line
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              className={styles.button}
              startIcon={<SaveIcon />}
              onClick={handleSaveClick}
            >
              Save
            </Button>
            <Button
              variant="contained"
              className={styles.button}
              startIcon={<CancelIcon />}
              href="/branch"
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <ConfirmDialog
        open={open}
        onOk={handleSave}
        onClose={handleCancel}
        content={`Are you sure you want to save?`}
      />
      {/* <SelectFileDialog
        open={openDialog}
        loading={data.loadingFile || false}
        onItemClick={handleFileClick}
        onSave={handleFileSelected}
        onClose={handleDialogClose}
        items={data.driveList}
      /> */}
    </Box>
  );
};

export default BranchDetail;
