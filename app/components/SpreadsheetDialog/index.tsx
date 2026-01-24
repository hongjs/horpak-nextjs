import React, { useCallback, useState } from 'react'
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
  Paper,
  useTheme,
  alpha,
  Fade,
  Stack,
  IconButton
} from '@mui/material'
import {
  Folder as FolderIcon,
  Description as FileIcon,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material'
import { useDrive } from 'hooks'
import { DriveItem } from 'types/state'

export const FOLDER = 'application/vnd.google-apps.folder'

type DialogProps = {
  open: boolean
  onSave: (item: DriveItem) => void
  onClose: () => void
}

const SpreadsheetDialog: React.FC<DialogProps> = ({ open, onClose, onSave }) => {
  const theme = useTheme()
  const { files, loading, fetchDrive } = useDrive()
  const [selectedItem, setSelectedItem] = useState<DriveItem | undefined>(undefined)
  const [error, setError] = useState(false)

  // Simple history stack to allow "Back" navigation if desired,
  // currently just a placeholder/idea since the original code didn't handle "Up" explicitly
  // other than what 'fetchDrive' provides.
  // If 'fetchDrive' behaves like a browser, we might assume user wants to go back.
  // For now, retaining original logic.

  const handleItemClick = useCallback(
    (item: DriveItem) => {
      if (item.mimeType === FOLDER) {
        fetchDrive(item.id)
        setSelectedItem(undefined)
      } else {
        setSelectedItem(item)
        setError(false)
      }
    },
    [fetchDrive]
  )

  const handleSaveClick = useCallback(() => {
    if (selectedItem) {
      onSave(selectedItem)
    } else {
      setError(true)
    }
  }, [selectedItem, onSave])

  const handleCloseClick = useCallback(() => {
    onClose()
    setSelectedItem(undefined)
    setError(false)
  }, [onClose])

  const renderFileOrFolder = useCallback(
    (item: DriveItem) => {
      const isFolder = item.mimeType === FOLDER
      const selected = selectedItem && selectedItem.id === item.id

      return (
        <Paper
          elevation={selected ? 4 : 0}
          onClick={() => handleItemClick(item)}
          sx={{
            p: 1.5,
            height: '100%',
            cursor: 'pointer',
            border: `1px solid ${selected ? theme.palette.primary.main : alpha(theme.palette.divider, 0.5)}`,
            bgcolor: selected
              ? alpha(theme.palette.primary.main, 0.08)
              : theme.palette.background.paper,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              bgcolor: selected
                ? alpha(theme.palette.primary.main, 0.12)
                : alpha(theme.palette.action.hover, 0.04),
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[2]
            },
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            borderRadius: 2
          }}
        >
          <Avatar
            sx={{
              bgcolor: isFolder
                ? alpha(theme.palette.text.secondary, 0.1)
                : alpha(theme.palette.success.main, 0.1),
              color: isFolder ? theme.palette.text.secondary : theme.palette.success.main,
              width: 40,
              height: 40
            }}
          >
            {isFolder ? <FolderIcon /> : <FileIcon />}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="body2"
              noWrap
              fontWeight={selected ? 600 : 400}
              color={selected ? 'primary.main' : 'text.primary'}
            >
              {item.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {isFolder ? 'Folder' : 'Spreadsheet'}
            </Typography>
          </Box>
        </Paper>
      )
    },
    [selectedItem, handleItemClick, theme]
  )

  return (
    <Dialog
      open={open}
      onClose={handleCloseClick}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '60vh',
          maxHeight: '80vh',
          boxShadow: theme.shadows[24]
        }
      }}
    >
      <DialogTitle
        sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight="800">
            Browse Files
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select a Google Spreadsheet to link
          </Typography>
        </Box>
        <IconButton onClick={handleCloseClick} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, bgcolor: alpha(theme.palette.background.default, 0.4) }}>
        {loading && <LinearProgress sx={{ height: 2 }} />}

        <Box sx={{ p: 3, minHeight: 300 }}>
          {files.length === 0 && !loading ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 300,
                gap: 2,
                opacity: 0.6
              }}
            >
              <FolderIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
              <Typography color="text.secondary">Empty Folder</Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {files.map((item: DriveItem) => (
                <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  {renderFileOrFolder(item)}
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          gap: 1
        }}
      >
        {error && (
          <Fade in={error}>
            <Typography color="error" variant="body2" sx={{ mr: 'auto', fontWeight: 500 }}>
              Please select a spreadsheet file first.
            </Typography>
          </Fade>
        )}

        <Button onClick={handleCloseClick} color="inherit" sx={{ fontWeight: 600 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSaveClick}
          variant="contained"
          disabled={!selectedItem}
          sx={{
            px: 4,
            borderRadius: 2,
            boxShadow: !selectedItem ? 'none' : '0 8px 16px 0 rgba(66, 133, 244, 0.24)'
          }}
        >
          Select File
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SpreadsheetDialog
