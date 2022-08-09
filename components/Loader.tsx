import React from 'react';
import { CircularProgress } from '@mui/material';

const Loader = () => {
  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
      }}
    >
      <CircularProgress color="primary" />
    </div>
  );
};

export default Loader;
