import React, { useCallback } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  useTheme,
  alpha,
} from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  onOk,
  onClose,
  open,
  title = "Confirm Action",
  content,
  okButtonText = "Confirm",
  cancelButtonText = "Cancel",
  disableBackdropClick,
  disableEscapeKeyDown,
  ...props
}) => {
  const theme = useTheme();

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleOk = useCallback(() => {
    onOk();
  }, [onOk]);

  const handleClose = useCallback(
    (reason: "backdropClick" | "escapeKeyDown") => {
      if (!disableBackdropClick && reason === "backdropClick") {
        onClose();
      }

      if (!disableEscapeKeyDown && reason === "escapeKeyDown") {
        onClose();
      }

      if (typeof onClose === "function") {
        onClose();
      }
    },
    [onClose, disableBackdropClick, disableEscapeKeyDown],
  );

  return (
    <Dialog
      maxWidth="xs"
      aria-labelledby="confirm-dialog"
      open={open}
      onClose={handleClose}
      PaperProps={{
        elevation: 24,
        sx: {
          borderRadius: 3,
          p: 2,
          backgroundImage: "none",
          boxShadow: theme.shadows[24],
        },
      }}
      {...props}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          pt: 1,
        }}
      >
        <Box
          sx={{
            bgcolor: alpha(theme.palette.warning.main, 0.1),
            color: theme.palette.warning.main,
            borderRadius: "50%",
            p: 2,
            mb: 2,
          }}
        >
          <WarningIcon fontSize="large" />
        </Box>
        <DialogTitle
          id="confirm-dialog-title"
          sx={{ p: 0, mb: 1, fontWeight: 700 }}
        >
          {title}
        </DialogTitle>
      </Box>

      {content && (
        <DialogContent sx={{ textAlign: "center", py: 1 }}>
          <Typography variant="body1" color="text.secondary">
            {content}
          </Typography>
        </DialogContent>
      )}

      <DialogActions
        sx={{ justifyContent: "center", px: 2, pb: 1, mt: 2, gap: 1 }}
      >
        <Button
          onClick={handleCancel}
          color="inherit"
          variant="outlined"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            flex: 1,
          }}
        >
          {cancelButtonText}
        </Button>
        <Button
          onClick={handleOk}
          color="primary"
          variant="contained"
          autoFocus
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            flex: 1,
            boxShadow: "0 8px 16px 0 rgba(66, 133, 244, 0.24)",
          }}
        >
          {okButtonText}
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
