import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';
import MainNavigation from './MainNavigation';
import styles from './Layout.module.css';

interface Props {
  children?: React.ReactNode;
}

function Layout({ children }: Props) {
  return (
    <>
      <Container className={styles.container}>
        <CssBaseline />
        <MainNavigation />
        <main className={styles.main}>
          {children}
          <footer className={styles.footer}>
            <p>
              Powered by HongJS
              <br />
              sompote.r@gmail.com
            </p>
          </footer>
        </main>
      </Container>
    </>
  );
}

export default Layout;
