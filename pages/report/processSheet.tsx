import React, { useEffect, useCallback } from 'react';
import {
  Avatar,
  Box,
  CircularProgress,
  Grid,
  Hidden,
  IconButton,
  Paper,
  LinearProgress,
  MenuItem,
  Tooltip,
  TextField,
  Typography,
} from '@mui/material';
import {
  Place as PlaceIcon,
  Cached as CachedIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';

import { useBranch, useDrive } from 'hooks';

import styles from './processSheet.module.css';
import { BranchItemState, DriveSheetItem } from 'types/state';

const ProcessSheet: React.FC = () => {
  const { fetchBranch, branches, loading, sheetSelect } = useBranch();
  const { fetchSheets, processData } = useDrive();

  useEffect(() => {
    fetchBranch();
  }, [fetchBranch]);

  useEffect(() => {
    if (branches.every((i) => !i.sheets || i.sheets.length === 0)) {
      fetchSheets(branches);
    }
  }, [fetchSheets, branches]);

  const handleProcessClick = useCallback(
    (branch: BranchItemState) => {
      if (branch._id && branch.spreadSheetId && branch.sheetId) {
        processData(branch._id, branch.spreadSheetId, branch.sheetId);
      }
    },
    [processData]
  );

  const handleSheetChange = useCallback(
    (event: any, branch: BranchItemState) => {
      if (branch && branch._id) {
        sheetSelect(branch._id, event.target.value);
      }
    },
    [sheetSelect]
  );

  const renderIcon = useCallback(
    (item: BranchItemState) => {
      let tooltip =
        item.processing === true
          ? 'processing'
          : item.processing === false
          ? 'done'
          : 'start process';
      return (
        <Tooltip title={tooltip} placement="bottom">
          <div>
            <IconButton
              edge="end"
              aria-label="process"
              color="primary"
              onClick={() => handleProcessClick(item)}
              disabled={
                item.processing !== undefined || item.sheetId === undefined
              }
            >
              {item.processing === true ? (
                <CircularProgress size={20} />
              ) : item.processing === false ? (
                <CheckIcon sx={{ color: 'green' }} />
              ) : (
                <CachedIcon />
              )}
            </IconButton>
          </div>
        </Tooltip>
      );
    },
    [handleProcessClick]
  );

  const renderSheetSelect = useCallback(
    (branch: BranchItemState) => {
      return (
        <TextField
          id="select-sheet"
          select
          value={branch.sheetId || -1}
          onChange={(event) => handleSheetChange(event, branch)}
          className={styles.selectSheet}
        >
          {branch &&
            branch.sheets &&
            branch.sheets.map((sheet: DriveSheetItem) => (
              <MenuItem key={sheet.sheetId} value={sheet.sheetId}>
                {sheet.title}
              </MenuItem>
            ))}

          {(!branch || !branch.sheets) && <MenuItem value={''}>Empty</MenuItem>}
        </TextField>
      );
    },
    [handleSheetChange]
  );

  const renderError = useCallback((item: BranchItemState) => {
    if (item.error) {
      return (
        <>
          <Hidden mdDown>
            <Grid item xs={1}></Grid>
          </Hidden>
          <Grid item xs={12} md={11} className={styles.error}>
            <Typography variant="body1" gutterBottom>
              {item.error}
            </Typography>
          </Grid>
        </>
      );
    }
    return <></>;
  }, []);

  return (
    <div className={styles.root}>
      <Typography gutterBottom variant="h5">
        Process Sheet
      </Typography>
      <Paper className={styles.paper}>
        {loading && <LinearProgress />}

        {branches.map((branch) => {
          return (
            <div key={branch._id}>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                className={styles.list}
              >
                <Hidden mdDown>
                  <Grid item xs={1}>
                    <Avatar>
                      <PlaceIcon />
                    </Avatar>
                  </Grid>
                </Hidden>
                <Grid item xs={11} md={6}>
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography
                      gutterBottom
                      component="div"
                      variant="body1"
                      className={styles.text}
                    >
                      {branch.name}
                    </Typography>
                    <Typography
                      gutterBottom
                      component="span"
                      variant="caption"
                      className={styles.text}
                    >
                      Spreadsheet:{' '}
                      <a
                        href={`https://docs.google.com/spreadsheets/d/${branch.spreadSheetId}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'blue', textDecoration: 'underline' }}
                      >
                        {branch.spreadSheetName}
                      </a>
                    </Typography>
                    {' | '}
                    <Typography
                      gutterBottom
                      component="span"
                      variant="caption"
                      className={styles.text}
                    >
                      Last process:{' '}
                      {branch.lastProcessSheet
                        ? format(
                            parseISO(branch.lastProcessSheet.toString()),
                            'yyyy-MM-dd HH:mm'
                          )
                        : 'never'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={6}
                  md={3}
                  sx={{ textAlign: 'left', paddingLeft: '32px' }}
                >
                  {renderSheetSelect(branch)}
                </Grid>
                <Grid item xs={6} md={2}>
                  {renderIcon(branch)}
                </Grid>
                {renderError(branch)}
              </Grid>
            </div>
          );
        })}
      </Paper>
    </div>
  );
};

export default ProcessSheet;
