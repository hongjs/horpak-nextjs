import React, { useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Button, Grid, Typography, Paper, LinearProgress } from '@mui/material';
import { Card, CardActions, CardHeader, CardContent } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { format as dateFormat } from 'date-fns';
import { toInteger } from 'lodash';
import { useDrive } from 'hooks';
import styles from './index.module.css';

const DataSource: React.FC = () => {
  const router = useRouter();
  const { loading, hasToken, checkToken, user, getUser } = useDrive();

  useEffect(() => {
    getUser();
    checkToken();
  }, [getUser, checkToken]);

  const handleAuthClick = useCallback(async () => {
    router.push('/auth/spreadsheet');
  }, [router]);

  const renderContent = useCallback(() => {
    return (
      <Card className={styles.card}>
        <CardHeader
          avatar={
            <div
              style={{
                borderRadius: '50%',
                overflow: 'hidden',
                width: '60px',
                height: '60px',
              }}
            >
              {user?.picture && (
                <Image
                  src={user?.picture}
                  alt={'user-pic'}
                  objectFit="cover"
                  width="60px"
                  height="60px"
                />
              )}
            </div>
          }
          title={`Authorized by ${user?.name}`}
          subheader={user?.email}
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            Updated by: {user?.updatedBy}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Updated:{' '}
            {user
              ? dateFormat(
                  toInteger(Date.parse(user?.updatedDate)),
                  'yyyy-MM-dd HH:mm'
                )
              : ''}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Expiry:{' '}
            {user
              ? dateFormat(
                  toInteger(Date.parse(user?.expiryDate)),
                  'yyyy-MM-dd HH:mm'
                )
              : ''}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleAuthClick}
            startIcon={<GoogleIcon />}
          >
            {hasToken ? 'Re-Authorize' : 'Authorize'}
          </Button>
        </CardActions>
      </Card>
    );
  }, [user, hasToken, handleAuthClick]);

  return (
    <div className={styles.root}>
      <Paper className={styles.paper} elevation={0}>
        {loading && <LinearProgress />}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5">
              Set Authorize for Google Spreadsheet access
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {!loading && renderContent()}
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default DataSource;
