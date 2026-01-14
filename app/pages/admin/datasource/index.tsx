import React, { useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
  Avatar,
  Box,
  Stack,
  Container,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Google as GoogleIcon,
  CloudSync as CloudSyncIcon,
} from "@mui/icons-material";
import { format as dateFormat } from "date-fns";
import { toInteger } from "lodash";
import { useDrive } from "hooks";

const DataSource: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const { loading, hasToken, checkToken, user, getUser } = useDrive();

  useEffect(() => {
    getUser();
    checkToken();
  }, [getUser, checkToken]);

  const handleAuthClick = useCallback(async () => {
    router.push("/auth/spreadsheet");
  }, [router]);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack spacing={6} alignItems="center">
        {/* Header Section */}
        <Box sx={{ textAlign: "center", maxWidth: 600 }}>
          <CloudSyncIcon
            sx={{ fontSize: 64, color: "primary.main", mb: 2, opacity: 0.8 }}
          />
          <Typography
            variant="h3"
            fontWeight={800}
            gutterBottom
            sx={{
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(45deg, #90CAF9 30%, #66BB6A 90%)"
                  : "linear-gradient(45deg, #4285F4 30%, #34A853 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Data Synchronization
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage the connection to Google Drive and Spreadsheets for data
            storage.
          </Typography>
        </Box>

        {loading && (
          <Box sx={{ width: "100%", maxWidth: 500 }}>
            <LinearProgress sx={{ borderRadius: 1, height: 6 }} />
          </Box>
        )}

        {!loading && (
          <Card
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: 500,
              borderRadius: 4,
              boxShadow: theme.shadows[4],
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              overflow: "visible",
            }}
          >
            <CardContent
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* User Avatar */}
              <Box sx={{ position: "relative", mb: 3 }}>
                <Avatar
                  src={user?.picture}
                  alt={user?.name || "User"}
                  sx={{
                    width: 96,
                    height: 96,
                    boxShadow: theme.shadows[3],
                    border: `4px solid ${theme.palette.background.paper}`,
                  }}
                />
                {hasToken && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      bgcolor: "success.main",
                      border: `3px solid ${theme.palette.background.paper}`,
                    }}
                  />
                )}
              </Box>

              {/* User Details */}
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {user?.name || "Not Authorized"}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user?.email || "Please authorize access to Google Drive."}
              </Typography>

              {user && (
                <Box
                  sx={{
                    mt: 3,
                    width: "100%",
                    p: 2,
                    bgcolor: alpha(theme.palette.background.default, 0.5),
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid size={12}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        LAST UPDATED BY
                      </Typography>
                      <Typography variant="body2" fontWeight="500">
                        {user.updatedBy}
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        UPDATED ON
                      </Typography>
                      <Typography variant="body2" fontWeight="500">
                        {dateFormat(
                          toInteger(Date.parse(user.updatedDate)),
                          "yyyy-MM-dd HH:mm",
                        )}
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        EXPIRES ON
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="500"
                        color={
                          new Date(toInteger(Date.parse(user.expiryDate))) <
                          new Date()
                            ? "error.main"
                            : "text.primary"
                        }
                      >
                        {dateFormat(
                          toInteger(Date.parse(user.expiryDate)),
                          "yyyy-MM-dd HH:mm",
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>

            <CardActions sx={{ p: 3, justifyContent: "center" }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleAuthClick}
                startIcon={<GoogleIcon />}
                sx={{
                  px: 4,
                  borderRadius: 2,
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: hasToken
                    ? "0 8px 16px 0 rgba(66, 133, 244, 0.24)" // Blue shadow for re-auth
                    : "0 8px 16px 0 rgba(219, 68, 55, 0.24)", // Red-ish for initial auth (Google color)
                  bgcolor: hasToken ? "primary.main" : "#DB4437",
                  "&:hover": {
                    bgcolor: hasToken ? "primary.dark" : "#C53929",
                  },
                }}
              >
                {hasToken ? "Re-Authorize Access" : "Authorize with Google"}
              </Button>
            </CardActions>
          </Card>
        )}
      </Stack>
    </Container>
  );
};

export default DataSource;
