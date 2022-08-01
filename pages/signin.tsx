import React from 'react';
import type { GetServerSideProps } from 'next';
import { getProviders, getSession, signIn } from 'next-auth/react';
import { Button, Grid } from '@mui/material';

export default function SignIn({}) {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh' }}
    >
      <Grid item xs={3}>
        <Button onClick={() => signIn()}>Signin with Google</Button>
      </Grid>
    </Grid>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;
  const providers = await getProviders();
  const session = await getSession({ req });
  if (session && res) {
    res.statusCode = 302;
    res.setHeader('Location', '/');
    return { props: { session, providers } };
  }
  return {
    props: { providers },
  };
};
