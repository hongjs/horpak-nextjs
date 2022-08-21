import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Grid, Paper, TextField } from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useAlert, useBank } from 'hooks';
import { BankItemState } from 'types/state';

import styles from './BankDetail.module.css';

type BankDetailProps = {
  id: string;
};

const BankDetail: React.FC<BankDetailProps> = ({ id }) => {
  const router = useRouter();
  const { item, saved, getBank, saveBank } = useBank();
  const { openAlert } = useAlert();
  const [data, setData] = useState<BankItemState>({});

  useEffect(() => {
    if (id) getBank(id);
  }, [id, getBank]);

  useEffect(() => {
    if (item) setData(item);
    else setData({});
  }, [item]);

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
      saveBank(data);
    }
  }, [openAlert, saveBank, data]);

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
              value={data?.bankId || 0}
              onChange={(e) => {
                handleTextChange('bankId', e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="bank-name"
              label="Bank Bame"
              type="text"
              className={styles.textField}
              value={data?.bankName}
              onChange={(e) => handleTextChange('bankName', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="account-no"
              label="Account No"
              type="text"
              className={styles.textField}
              value={data?.accountNo}
              onChange={(e) => handleTextChange('accountNo', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="account-name"
              label="Account Name"
              type="text"
              className={styles.textField}
              value={data?.accountName}
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
              value={data?.remark}
              onChange={(e) => handleTextChange('remark', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              color="primary"
              className={styles.button}
              startIcon={<SaveIcon />}
              onClick={handleSaveClick}
            >
              Save
            </Button>
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
    </Box>
  );
};

export default BankDetail;
