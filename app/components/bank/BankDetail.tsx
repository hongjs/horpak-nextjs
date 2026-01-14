import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Grid,
  TextField,
  Card,
  CardContent,
  Typography,
  Stack,
  InputAdornment,
  Avatar,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  AccountBalance as BankIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import { useAlert, useBank } from "hooks";
import { BankItemState } from "types/state";
import ConfirmDialog from "components/ConfirmDialog";

type BankDetailProps = {
  id: string | null;
};

const BankDetail: React.FC<BankDetailProps> = ({ id }) => {
  const router = useRouter();
  const theme = useTheme();
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
      router.push("/bank");
    }
  }, [router, saved]);

  const handleTextChange = useCallback((name: string, value: string) => {
    if (name === "bankId") {
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
      openAlert("Bank ID must be an integer", "warning");
    } else {
      setOpen(true);
    }
  }, [openAlert, data]);

  const handleSave = useCallback(() => {
    if (!data || !data.bankId || isNaN(data.bankId)) {
      openAlert("Bank ID must be an integer", "warning");
    } else {
      saveBank(data);
    }
  }, [data, openAlert, saveBank]);

  const handleCancel = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 800,
          borderRadius: 3,
          boxShadow: theme.shadows[3],
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={4}>
            {/* Header Section with Icon */}
            <Grid size={{ xs: 12 }}>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    width: 56,
                    height: 56,
                  }}
                >
                  <BankIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Bank Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enter the financial institution details below.
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                id="bank-id"
                label="Bank ID"
                fullWidth
                disabled={data && data._id !== undefined}
                value={data?.bankId || ""}
                onChange={(e) => handleTextChange("bankId", e.target.value)}
                variant="outlined"
                helperText="Unique identifier for the bank"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                id="bank-name"
                label="Bank Name"
                fullWidth
                value={data?.bankName || ""}
                onChange={(e) => handleTextChange("bankName", e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                id="account-no"
                label="Account Number"
                fullWidth
                value={data?.accountNo || ""}
                onChange={(e) => handleTextChange("accountNo", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                id="account-name"
                label="Account Name"
                fullWidth
                value={data?.accountName || ""}
                onChange={(e) =>
                  handleTextChange("accountName", e.target.value)
                }
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                id="remark"
                label="Remarks"
                fullWidth
                multiline
                rows={4}
                value={data?.remark || ""}
                onChange={(e) => handleTextChange("remark", e.target.value)}
                placeholder="Additional notes..."
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
                mt={2}
              >
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => router.push("/bank")}
                  size="large"
                  sx={{ borderRadius: 2, px: 4 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveClick}
                  size="large"
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    boxShadow: "0 8px 16px 0 rgba(66, 133, 244, 0.24)",
                  }}
                >
                  Save
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={open}
        onOk={handleSave}
        onClose={handleCancel}
        title="Save Changes?"
        content="Are you sure you want to save these bank details?"
        okButtonText="Save"
      />
    </Box>
  );
};

export default BankDetail;
