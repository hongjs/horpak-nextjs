import React, { useState } from 'react';
import Router from 'next/router';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, CircularProgress } from '@mui/material';
import MainNavigation from './MainNavigation';
import styles from './Layout.module.css';
import { Props } from 'types';

const Layout: React.FC<Props> = ({ children }) => {
  const [loadingPage, setLoadingPage] = useState(false);

  Router.events.on('routeChangeStart', (url) => {
    setLoadingPage(true);
  });
  Router.events.on('routeChangeComplete', (url) => {
    setLoadingPage(false);
  });
  Router.events.on('routeChangeError', (url) => {
    setLoadingPage(false);
  });

  return (
    <>
      <Container className={styles.container}>
        <CssBaseline />
        <MainNavigation />
        <main className={styles.main}>
          {loadingPage && (
            <Box className={styles.pageLoading}>
              <CircularProgress />
            </Box>
          )}
          {!loadingPage && <>{children}</>}
        </main>
      </Container>
    </>
  );
};

export default Layout;
