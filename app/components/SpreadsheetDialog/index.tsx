import React, { useCallback, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  Tooltip,
} from '@mui/material';
import {
  Folder as FolderIcon,
  Description as FileIcon,
} from '@mui/icons-material';
import { useDrive } from 'hooks';

export const FOLDER = 'application/vnd.google-apps.folder';
import styles from './index.module.css';
import { DriveItem } from 'types/state';

type DialogProps = {
  open: boolean;
  onSave: (item: DriveItem) => void;
  onClose: () => void;
};

const SpreadsheetDialog: React.FC<DialogProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const { files, loading, fetchDrive } = useDrive();
  const [selectedItem, setSelectedItem] = useState<DriveItem | undefined>(
    undefined
  );
  const [error, setError] = useState(false);

  const handleItemClick = useCallback(
    (item: DriveItem) => {
      if (item.mimeType === FOLDER) {
        fetchDrive(item.id);
        setSelectedItem(undefined);
      } else {
        setSelectedItem(item);
      }
    },
    [fetchDrive]
  );

  const handleSaveClick = useCallback(() => {
    if (selectedItem) {
      onSave(selectedItem);
    } else {
      setError(true);
    }
  }, [selectedItem, onSave]);

  const handleCancelClick = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleCloseClick = useCallback(() => {
    onClose();
  }, [onClose]);

  const renderFileOrFilder = useCallback(
    (item: DriveItem) => {
      const isFolder = item.mimeType === FOLDER;
      const selected = selectedItem && selectedItem.id === item.id;
      return (
        <Box
          onClick={() => {
            handleItemClick(item);
          }}
          className={selected ? styles.selectedItem : styles.item}
        >
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{ height: '55px' }}
          >
            <Grid size={{ xs: 2, sm: 2, md: 3 }}>
              <Tooltip title={item.name}>
                <Avatar className={isFolder ? styles.folder : styles.file}>
                  {isFolder ? (
                    <FolderIcon fontSize="medium" />
                  ) : (
                    <FileIcon fontSize="medium" />
                  )}
                </Avatar>
              </Tooltip>
            </Grid>
            <Grid size={{ xs: 10, sm: 10, md: 9 }}>
              <Typography
                component="div"
                variant="caption"
                className={selected ? styles.labelSelected : styles.label}
              >
                {item.name}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      );
    },
    [selectedItem, handleItemClick]
  );

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleCloseClick}
        aria-labelledby="sharing-dialog"
      >
        <DialogTitle id="sharing-dialog">
          <Typography color="primary" variant="body1">
            Choose Spreadsheet
          </Typography>
        </DialogTitle>
        <DialogContent className={styles.loading}>
          <Grid container>
            {loading && (
              <Grid size={{ xs: 12 }}>
                <LinearProgress />
              </Grid>
            )}
            {files.map((item: DriveItem) => {
              return (
                <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  {renderFileOrFilder(item)}
                </Grid>
              );
            })}
          </Grid>
        </DialogContent>
        <DialogActions>
          {error && (
            <Typography color="error">No spreadsheet selected.</Typography>
          )}
          <Button
            className={styles.button}
            onClick={handleCancelClick}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            className={styles.button}
            onClick={handleSaveClick}
            variant="outlined"
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SpreadsheetDialog;
