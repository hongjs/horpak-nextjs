import type { GetServerSideProps } from 'next';
import Image from 'next/image';
import { signOut, getSession } from 'next-auth/react';
import { Box, Button, Grid, Typography } from '@mui/material';
import styles from 'styles/Home.module.css';

type Props = {
  user: any;
};

const Unauthorized = ({ user }: Props) => {
  return (
    <Box className={styles.container}>
      <Box className={styles.main}>
        <Grid container>
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" gutterBottom>
                Unauthorized
              </Typography>
            </Box>
          </Grid>
          {user && (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center' }}>
                <Image
                  src={user.image || ''}
                  alt={'user-pic'}
                  width={50}
                  height={50}
                />
                <Typography gutterBottom>{user.name}</Typography>
                <Button
                  variant="contained"
                  onClick={async () => {
                    const data = await signOut({
                      redirect: true,
                      callbackUrl: '/auth/signin',
                    });
                  }}
                >
                  Sign out
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
      <footer className={styles.footer}>
        <p>
          Powered by HongJS
          <br />
          sompote.r@gmail.com
        </p>
      </footer>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session && session.user) {
    return { props: { user: session.user } };
  }
  return { props: { user: null } };
};

export default Unauthorized;
