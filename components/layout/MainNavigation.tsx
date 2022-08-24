import { useCallback, useState, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import {
  AppBar,
  Box,
  ClickAwayListener,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Menu as MenuIcon,
  PowerSettingsNew as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';

import styles from './MainNavigation.module.css';

const MainNavigation: React.FC = () => {
  const { data } = useSession();
  const router = useRouter();
  const [openDrawer, setOpenDrawer] = useState(false);

  const menuItems = useMemo(() => {
    return [
      { id: 'home', name: 'Home', icon: 'home', url: '/', divider: true },
      { id: 'users', name: 'User', icon: 'user-group', url: '/users' },
      { id: 'banks', name: 'Bank', icon: 'building-columns', url: '/bank' },
      {
        id: 'branches',
        name: 'Branch',
        icon: 'building',
        url: '/branch',
      },
    ];
  }, []);

  const handleOpenDrawer = useCallback(() => {
    setOpenDrawer(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setOpenDrawer(false);
  }, []);

  const handleMenuClick = useCallback(
    (id: string) => {
      const menu = menuItems.find((i) => i.id === id);
      if (menu && menu.url) {
        router.push(menu.url);
        handleCloseDrawer();
      }
    },
    [router, menuItems, handleCloseDrawer]
  );

  const renderUser = useCallback((user: any) => {
    return (
      <>
        <Image src={user.image || ''} alt={'user-pic'} width={30} height={30} />
        <Typography style={{ padding: '15px' }}>{user.name}</Typography>
        <Hidden mdDown>
          <Tooltip title="Sign out">
            <IconButton
              color="inherit"
              size="medium"
              aria-label="logout"
              sx={{ mr: 2 }}
              onClick={() => signOut()}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Hidden>
      </>
    );
  }, []);

  const renderDrawer = useCallback(() => {
    return (
      <ClickAwayListener onClickAway={handleCloseDrawer} mouseEvent="onMouseUp">
        <Drawer
          variant="persistent"
          open={openDrawer}
          onClose={handleCloseDrawer}
          className={styles.drawer}
          classes={{ paper: styles.drawerPaper }}
        >
          <div className={styles.toolbar}>
            <Typography color="primary" variant="h6">
              My App
            </Typography>
            <Box className={styles.header}>
              <IconButton onClick={handleCloseDrawer}>
                {openDrawer ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            </Box>
          </div>
          <Divider />
          <List>
            {menuItems.map((i) => {
              return (
                <Box key={i.id}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleMenuClick(i.id)}>
                      <ListItemIcon>
                        <i className={`fa-solid fa-${i.icon}`} />
                      </ListItemIcon>
                      <ListItemText primary={i.name} />
                    </ListItemButton>
                  </ListItem>
                  {i.divider && <Divider />}
                </Box>
              );
            })}
            <Divider />
            <ListItem disablePadding>
              <ListItemButton onClick={() => signOut()}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Sign out" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
      </ClickAwayListener>
    );
  }, [openDrawer, menuItems, handleMenuClick, handleCloseDrawer]);

  return (
    <div className={styles.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleOpenDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Hidden mdDown>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              My App
            </Typography>
          </Hidden>
          <Hidden mdUp>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              &nbsp;
            </Typography>
          </Hidden>

          {data && data.user && renderUser(data.user)}
        </Toolbar>
      </AppBar>
      {renderDrawer()}
    </div>
  );
};

export default MainNavigation;
