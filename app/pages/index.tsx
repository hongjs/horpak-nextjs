import React, { useEffect } from 'react';
import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getSession, signOut } from 'next-auth/react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Receipt as ReceiptIcon,
  Settings as SettingsIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { HomePageProps } from 'types';
import styles from 'styles/Home.module.css';

const Home: NextPage<HomePageProps> = ({ session }) => {
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
    }
  }, [router, session]);

  if (!session) return null;

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <Box className={styles.heroSection}>
        <Box className={styles.heroContent}>
          <Typography variant="h1" className={styles.welcomeTitle}>
            Welcome back, {session?.user?.name || 'User'}
          </Typography>
          <Typography variant="body1" className={styles.welcomeSubtitle}>
            Manage your dormitory, track payments, and view reports all in one place.
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.grid}>
          {/* Summary Report Card */}
          <div className={styles.card} onClick={() => router.push('/report/viewSummaryReport')}>
            <div className={`${styles.cardIcon} ${styles.iconBlue}`}>
              <DescriptionIcon />
            </div>
            <Typography variant="h6" className={styles.cardTitle}>
              Summary Report
            </Typography>
            <Typography variant="body2" className={styles.cardDescription}>
              View comprehensive summaries of income, expenses, and occupancy rates.
            </Typography>
          </div>

          {/* Invoice Report Card */}
          <div className={styles.card} onClick={() => router.push('/report/viewInvoiceReport')}>
            <div className={`${styles.cardIcon} ${styles.iconGreen}`}>
              <ReceiptIcon />
            </div>
            <Typography variant="h6" className={styles.cardTitle}>
              Invoice Report
            </Typography>
            <Typography variant="body2" className={styles.cardDescription}>
              Track and manage all generated invoices and payment statuses.
            </Typography>
          </div>

          {/* Process Card */}
          <div className={styles.card} onClick={() => router.push('/report/processSheet')}>
            <div className={`${styles.cardIcon} ${styles.iconYellow}`}>
              <SettingsIcon />
            </div>
            <Typography variant="h6" className={styles.cardTitle}>
              Process
            </Typography>
            <Typography variant="body2" className={styles.cardDescription}>
              Manage system processes, batch operations, and workflow automation.
            </Typography>
          </div>

          {/* Users Card */}
          <div className={styles.card} onClick={() => router.push('/users')}>
            <div className={`${styles.cardIcon} ${styles.iconPurple}`}>
              <GroupIcon />
            </div>
            <Typography variant="h6" className={styles.cardTitle}>
              Users
            </Typography>
            <Typography variant="body2" className={styles.cardDescription}>
              Manage tenant profiles, contracts, and user access permissions.
            </Typography>
          </div>
        </div>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={() => signOut()}
            sx={{
              borderColor: 'rgba(145, 158, 171, 0.32)',
              color: '#637381',
              '&:hover': {
                borderColor: '#212b36',
                color: '#212b36',
                backgroundColor: 'rgba(33, 43, 54, 0.08)',
              },
            }}
          >
            Sign Out
          </Button>
        </Box>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <Typography variant="body2" className={styles.footerText}>
          © {new Date().getFullYear()} HongJSX • sompote.r@gmail.com
        </Typography>
      </footer>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const _props: HomePageProps = { session };
  return { props: _props };
};

export default Home;
