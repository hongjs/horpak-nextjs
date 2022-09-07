import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Grid, Paper, TextField } from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useAlert, useBank } from 'hooks';
import { BankItemState } from 'types/state';
import ConfirmDialog from 'components/ConfirmDialog';

import styles from './BankDetail.module.css';

type BankDetailProps = {
  id: string | null;
};

const BankDetail: React.FC<BankDetailProps> = ({ id }) => {
  const router = useRouter();
  const { item, saved, getBank, saveBank } = useBank();
  const { openAlert } = useAlert();
  const [data, setData] = useState<BankItemState>({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getBank(id);
  }, [id, getBank]);

  useEffect(() => {
    if (item) setData(item);
    else setData({});
  }, [item]);

  useEffect(() => {
    if (saved) {
      router.push('/bank');
    }
  }, [router, saved]);

  const handleTextChange = useCallback((name: string, value: string) => {
    if (name === 'bankId') {
      setData((prev) => {
        return { ...prev, [name]: Number(value) };
      });
    } else {
      setData((prev) => {
        return { ...prev, [name]: value };
      });
    }
  }, []);

  const handleSaveClick = useCallback(() => {
    if (!data || !data.bankId || isNaN(data.bankId)) {
      openAlert('Bank ID must be an integer', 'warning');
    } else {
      setOpen(true);
    }
  }, [openAlert, data]);

  const handleSave = useCallback(() => {
    if (!data || !data.bankId || isNaN(data.bankId)) {
      openAlert('Bank ID must be an integer', 'warning');
    } else {
      saveBank(data);
    }
  }, [data, openAlert, saveBank]);

  const handleCancel = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Box className={styles.root}>
      <Paper className={styles.paper}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              id="bank-id"
              label="Bank ID"
              disabled={data && data._id !== undefined}
              className={styles.textField}
              value={data?.bankId || ''}
              onChange={(e) => {
                handleTextChange('bankId', e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="bank-name"
              label="Bank Bame"
              variant="outlined"
              type="text"
              className={styles.textField}
              value={data?.bankName || ''}
              onChange={(e) => handleTextChange('bankName', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="account-no"
              label="Account No"
              type="text"
              className={styles.textField}
              value={data?.accountNo || ''}
              onChange={(e) => handleTextChange('accountNo', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="account-name"
              label="Account Name"
              type="text"
              className={styles.textField}
              value={data?.accountName || ''}
              onChange={(e) => handleTextChange('accountName', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="remark"
              label="Remark"
              type="text"
              className={styles.textField}
              multiline
              rows={6}
              value={data?.remark || ''}
              onChange={(e) => handleTextChange('remark', e.target.value)}
            />
          </Grid>
          <Grid
            item
            xs={6}
            sx={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <Button
              variant="outlined"
              color="primary"
              className={styles.button}
              startIcon={<SaveIcon />}
              onClick={handleSaveClick}
            >
              Save
            </Button>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{ display: 'flex', justifyContent: 'flex-start' }}
          >
            <Button
              variant="outlined"
              className={styles.button}
              startIcon={<CancelIcon />}
              onClick={() => {
                router.push('/bank');
              }}
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
    </Box>
  );
};

export default BankDetail;
