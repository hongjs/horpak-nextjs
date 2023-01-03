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
  Google as GoogleIcon,
} from '@mui/icons-material';
import { useAlert, useBranch, useDrive } from 'hooks';
import { BranchItemState, DriveItem } from 'types/state';
import ConfirmDialog from 'components/ConfirmDialog';
import SpreadsheetDialog from 'components/SpreadsheetDialog';

import styles from './BranchDetail.module.css';

type BranchDetailProps = {
  id: string | null;
};

export const FOLDER = 'application/vnd.google-apps.folder';

const BranchDetail: React.FC<BranchDetailProps> = ({ id }) => {
  const router = useRouter();
  const { openAlert } = useAlert();
  const { item, saved, getBranch, saveBranch } = useBranch();
  const { fetchDrive, checkToken, hasToken } = useDrive();
  const [data, setData] = useState<BranchItemState>({});
  const [open, setOpen] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);

  useEffect(() => {
    checkToken();
  }, [checkToken]);

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

  useEffect(() => {
    if (openSheet === true) fetchDrive('root');
  }, [openSheet, fetchDrive]);

  const handleTextChange = useCallback((name: string, value: string) => {
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  }, []);

  const handleSaveClick = useCallback(() => {
    if (!data.name) {
      openAlert('Name is required.', 'warning');
      return;
    } else if (!data.reportHeader) {
      openAlert('Header is required.', 'warning');
      return;
    } else if (!data.spreadSheetId) {
      openAlert('Spreadsheet is required.', 'warning');
      return;
    }

    setOpen(true);
  }, [data, openAlert]);

  const handleSave = useCallback(() => {
    saveBranch(data);
  }, [data, saveBranch]);

  const handleCancel = useCallback(() => {
    setOpen(false);
  }, []);

  const handleSheetSelected = useCallback((item: DriveItem) => {
    setOpenSheet(false);
    setData((prev) => {
      return {
        ...prev,
        spreadSheetId: item.id,
        spreadSheetName: item.name,
      };
    });
  }, []);

  const handleSheetClose = useCallback(() => {
    setOpenSheet(false);
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
            <a
              href={`https://docs.google.com/spreadsheets/d/${
                data?.spreadSheetId || ''
              }`}
              target="_blank"
              rel="noreferrer"
              style={{ color: 'blue', textDecoration: 'underline' }}
            >
              {data?.spreadSheetName || ''}
            </a>
            {hasToken && (
              <Button
                startIcon={<FolderIcon />}
                onClick={() => {
                  setOpenSheet(true);
                }}
              >
                Browse
              </Button>
            )}
            {!hasToken && (
              <Button
                startIcon={<GoogleIcon />}
                onClick={() => {
                  router.push('/admin/datasource');
                }}
              >
                Authorize
              </Button>
            )}
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
      <SpreadsheetDialog
        open={openSheet}
        onSave={handleSheetSelected}
        onClose={handleSheetClose}
      />
    </Box>
  );
};

export default BranchDetail;
