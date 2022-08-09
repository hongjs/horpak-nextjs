import React, { useEffect } from 'react';
import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { Typography } from 'components/mui';

import { HomePageProps } from 'config/types';
import styles from 'styles/Home.module.css';

const Home: NextPage<HomePageProps> = ({ session }) => {
  const router = useRouter();
  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
    }
  }, [router, session]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Typography variant="h3">{`Hello ${session?.user?.name}`}</Typography>
      </main>

      <footer className={styles.footer}>
        <a target="_blank" rel="noopener noreferrer">
          Powered by HongJS
        </a>
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
