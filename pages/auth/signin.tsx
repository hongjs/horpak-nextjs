import React from 'react';
import type { GetServerSideProps } from 'next';
import Image from 'next/image';
import { getProviders, getSession, signIn } from 'next-auth/react';

import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Toolbar,
  Typography,
} from '@mui/material';
import { Hidden } from '@mui/material';
import { SignInProps } from 'types/auth';

import styles from './signin.module.css';

const SignIn = ({ providers }: SignInProps) => {
  return (
    <>
      <main>
        <AppBar position="static">
          <Toolbar className={styles.toolbar}>
            <Image src="/images/logo64.png" width={32} height={32} alt="logo" />
            <Typography
              variant="h6"
              component="div"
              sx={{ marginLeft: '16px' }}
            >
              Hong.JS
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" className={styles.container}>
          <Grid container>
            <Hidden mdDown>
              <Grid item xs={12} md={7} lg={8}>
                <Box className={styles.itemLeft}>
                  <Box component="div" className={styles.itemImage}>
                    <Image
                      src={'/images/cover.jpg'}
                      alt="cover"
                      width={600}
                      height={400}
                      layout="responsive"
                    />
                  </Box>
                </Box>
              </Grid>
            </Hidden>
            <Grid item xs={12} md={5} lg={4}>
              <Box className={styles.itemRight}>
                <Grid container direction="column" rowSpacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h4" gutterBottom>
                      Sign in
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      startIcon={<i className="fa-brands fa-google" />}
                      className={styles.button}
                      onClick={() => signIn('google')}
                    >{`Signin with Google`}</Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      disabled
                      variant="outlined"
                      startIcon={<i className="fa-brands fa-facebook" />}
                      className={styles.button}
                    >{`Signin with Facebook`}</Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </main>
      <footer className={styles.footer}>
        <Divider />
        <p>
          Powered by HongJS
          <br />
          sompote.r@gmail.com
        </p>
      </footer>
    </>
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
