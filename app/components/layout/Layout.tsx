import React, { useState } from 'react';
import Router from 'next/router';
import CssBaseline from '@mui/material/CssBaseline';
import { CircularProgress } from '@mui/material';
import MainNavigation from './MainNavigation';
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
    <div className="relative w-full min-w-full h-full flex-auto m-0 p-0">
      <CssBaseline />
      <MainNavigation />
      <main className="w-full h-[calc(100%-64px)] mr-0 md:mr-16 px-4 md:px-16 pt-16 md:pt-16 text-center">
        {loadingPage && (
          <div className="flex justify-center items-center min-h-[calc(100vh-250px)]">
            <CircularProgress />
          </div>
        )}
        {!loadingPage && <>{children}</>}
      </main>
    </div>
  );
};

export default Layout;
