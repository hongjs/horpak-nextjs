import React, { useCallback } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  onOk,
  onClose,
  open,
  title,
  content,
  okButtonText,
  cancelButtonText,
  disableBackdropClick,
  disableEscapeKeyDown,
  ...props
}) => {
  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleOk = useCallback(() => {
    onOk();
  }, [onOk]);

  const handleClose = useCallback(
    (reason: 'backdropClick' | 'escapeKeyDown') => {
      if (!disableBackdropClick && reason === 'backdropClick') {
        onClose();
      }

      if (!disableEscapeKeyDown && reason === 'escapeKeyDown') {
        onClose();
      }

      if (typeof onClose === 'function') {
        onClose();
      }
    },
    [onClose, disableBackdropClick, disableEscapeKeyDown]
  );

  return (
    <Dialog
      maxWidth="xs"
      aria-labelledby="confirm-dialog"
      open={open}
      onClose={handleClose}
      {...props}
    >
      {title && <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>}
      {content && <DialogContent dividers>{content}</DialogContent>}
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary">
          {cancelButtonText || 'Cancel'}
        </Button>
        <Button onClick={handleOk} color="primary">
          {okButtonText || 'Ok'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

type ConfirmDialogProps = {
  onOk: Function;
  onClose: Function;
  open: boolean;
  title?: string;
  content?: React.ReactNode;
  okButtonText?: string;
  cancelButtonText?: string;
  disableBackdropClick?: boolean;
  disableEscapeKeyDown?: boolean;
};

export default React.memo(ConfirmDialog);
