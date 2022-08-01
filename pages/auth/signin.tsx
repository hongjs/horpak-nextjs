import React from 'react';
import type { GetServerSideProps } from 'next';
import { getProviders, getSession, signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { Button, Grid, Typography } from 'components/mui';
import { SignInProps } from 'config/types';

const SignIn = ({ providers }: SignInProps) => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh' }}
    >
      {providers &&
        Object.values(providers).map((provider) => {
          return (
            <Grid
              key={provider.id}
              item
              xs={12}
              style={{ display: 'flex', justifyContent: 'flex-center' }}
            >
              <Button
                startIcon={<FcGoogle fontSize={30} />}
                onClick={() => signIn(provider.id)}
              >{`Signin with ${provider.name}`}</Button>
            </Grid>
          );
        })}
      {!providers && <Typography>No login provider found</Typography>}
    </Grid>
  );
};

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

export default SignIn;
