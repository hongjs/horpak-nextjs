import React from 'react';
import type { GetServerSideProps } from 'next';
import { getProviders, getSession } from 'next-auth/react';
import { Grid, Typography } from '@mui/material';

const UserList = () => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh' }}
    >
      <Typography>Hello users</Typography>
    </Grid>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 302;
    res.setHeader('Location', '/');
    return { props: {} };
  }
  return {
    props: {},
  };
};

export default UserList;
