import React, { useCallback, useRef, useState } from 'react';
import type { GetServerSideProps } from 'next';
import Image from 'next/image';
import { getProviders, getSession, signIn } from 'next-auth/react';
import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Divider,
  Paper,
  Toolbar,
  Typography,
  Grid,
} from '@mui/material';
import { Turnstile } from '@marsidev/react-turnstile';
import { SignInProps } from 'types/auth';
import constants from 'config/constants';
import { useTurnstile } from 'hooks';
import styles from './signin.module.css';

const SignIn: React.FC<SignInProps> = ({ providers }) => {
  const { valid, validateToken, failure } = useTurnstile();

  const handleSignin = useCallback(() => {
    if (valid) {
      signIn('google');
    }
  }, [valid]);

  const handleTurnstileSuccess = (token: string) => {
    validateToken(token);
  };

  const handleTurnstileFail = () => {
    failure();
  };

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
            <Box sx={{ display: { xs: 'none', md: 'none', lg: 'block' } }}>
              <Grid size={{ xs: 12, md: 7, lg: 8 }}>
                <Box className={styles.itemLeft}>
                  <Box component="div" className={styles.itemImage}>
                    <Image
                      src="/images/logo.png"
                      alt="logo"
                      width={350}
                      height={350}
                      priority
                    />
                  </Box>
                </Box>
              </Grid>
            </Box>
            <Grid size={{ xs: 12, md: 5, lg: 4 }}>
              <Box className={styles.itemRight}>
                <Grid container direction="column" rowSpacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="h4" gutterBottom>
                      Sign in
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button
                      variant="outlined"
                      startIcon={<i className="fa-brands fa-google" />}
                      className={styles.button}
                      onClick={handleSignin}
                      disabled={!valid}
                    >{`Signin with Google`}</Button>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button
                      disabled
                      variant="outlined"
                      startIcon={<i className="fa-brands fa-facebook" />}
                      className={styles.button}
                    >{`Signin with Facebook`}</Button>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Divider />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Turnstile
                        options={{
                          theme: 'light',
                          size: 'normal',
                        }}
                        siteKey={constants.TURNSTILE_PUBLIC_KEY}
                        onError={handleTurnstileFail}
                        onExpire={handleTurnstileFail}
                        onSuccess={handleTurnstileSuccess}
                        style={{ width: '100%' }}
                      />
                    </Box>
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
