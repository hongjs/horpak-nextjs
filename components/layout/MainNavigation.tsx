import { useCallback, useState, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  PowerSettingsNew as LogoutIcon,
} from '@mui/icons-material';

import classes from './MainNavigation.module.css';

function MainNavigation() {
  const { data } = useSession();
  const router = useRouter();
  const [openDrawer, setOpenDrawer] = useState(false);

  const menuItems = useMemo(() => {
    return [
      { id: 'home', name: 'Home', icon: 'home', url: '/' },
      { id: 'users', name: 'Users', icon: 'user-group', url: '/users' },
    ];
  }, []);

  const menuClickHandler = useCallback(
    (id: string) => {
      const menu = menuItems.find((i) => i.id === id);
      if (menu) {
        router.push(menu.url);
      }
    },
    [router, menuItems]
  );

  const toggleDrawer = useCallback(() => {
    setOpenDrawer((prev) => !prev);
  }, []);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Hong.JS
          </Typography>

          {data && data.user && (
            <>
              <Image
                src={data.user?.image || ''}
                alt={'user-pic'}
                width={30}
                height={30}
              />
              <Typography style={{ padding: '15px' }}>
                {data.user.name}
              </Typography>
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
            </>
          )}
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={openDrawer} onClose={toggleDrawer}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer}
          onKeyDown={toggleDrawer}
        >
          <List>
            {menuItems.map((i) => {
              return (
                <ListItem key={i.id} disablePadding>
                  <ListItemButton onClick={() => menuClickHandler(i.id)}>
                    <ListItemIcon>
                      <i className={`fa-solid fa-${i.icon}`} />
                    </ListItemIcon>
                    <ListItemText primary={i.name} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default MainNavigation;
