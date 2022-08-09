import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';
import MainNavigation from './MainNavigation';
import classes from './Layout.module.css';

interface Props {
  children?: React.ReactNode;
}

function Layout({ children }: Props) {
  return (
    <>
      <Container maxWidth="xl" disableGutters>
        <CssBaseline />
        <MainNavigation />
        <main className={classes.main}>{children}</main>
      </Container>
    </>
  );
}

export default Layout;
