import { useRouter } from 'next/router';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { Box, Button, Grid, Typography } from '@mui/material';

const Unauthorized = () => {
  const router = useRouter();
  const { data } = useSession();

  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        height: '80vh',
        width: '95vw',
      }}
    >
      <Grid container>
        <Grid item xs={12}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" gutterBottom>
              Unauthorized
            </Typography>
          </Box>
        </Grid>
        {data && data.user && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center' }}>
              <Image
                src={data.user.image || ''}
                alt={'user-pic'}
                width={50}
                height={50}
              />
              <Typography gutterBottom>{data.user.name}</Typography>
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
    </div>
  );
};

export default Unauthorized;
