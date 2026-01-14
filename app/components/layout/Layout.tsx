import React, { useState } from "react";
import Router from "next/router";
import CssBaseline from "@mui/material/CssBaseline";
import { CircularProgress, Box } from "@mui/material";
import MainNavigation from "./MainNavigation";
import { Props } from "types";

const DRAWER_WIDTH = 280;

const Layout: React.FC<Props> = ({ children }) => {
  const [loadingPage, setLoadingPage] = useState(false);

  Router.events.on("routeChangeStart", (url) => {
    setLoadingPage(true);
  });
  Router.events.on("routeChangeComplete", (url) => {
    setLoadingPage(false);
  });
  Router.events.on("routeChangeError", (url) => {
    setLoadingPage(false);
  });

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <CssBaseline />
      <MainNavigation />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: "64px", // Height of AppBar
          width: "100%", // Ensure it takes available width
          overflowX: "hidden", // Prevent horizontal scroll
        }}
      >
        {loadingPage ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "calc(100vh - 128px)",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          children
        )}
      </Box>
    </Box>
  );
};

export default Layout;
