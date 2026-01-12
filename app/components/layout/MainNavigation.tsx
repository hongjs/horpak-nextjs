import { useCallback, useState, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import {
  AppBar,
  ClickAwayListener,
  Divider,
  Drawer,
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
import { ThemeToggle } from 'components/ThemeToggle';

const MainNavigation: React.FC = () => {
  const { data } = useSession();
  const router = useRouter();
  const [openDrawer, setOpenDrawer] = useState(false);

  const menuItems = useMemo(() => {
    return [
      { id: 'home', name: 'Home', icon: 'home', url: '/', divider: true },
      {
        id: 'summaryReport',
        name: 'Summary Report',
        icon: 'table-list',
        url: '/report/viewSummaryReport',
      },
      {
        id: 'invoiceReport',
        name: 'Invoice Report',
        icon: 'receipt',
        url: '/report/viewInvoiceReport',
      },
      {
        id: 'process',
        name: 'Process',
        icon: 'gear',
        url: '/report/processSheet',
        divider: true,
      },
      { id: 'users', name: 'User', icon: 'user-group', url: '/users' },
      { id: 'banks', name: 'Bank', icon: 'building-columns', url: '/bank' },
      {
        id: 'branches',
        name: 'Branch',
        icon: 'building',
        url: '/branch',
      },
      {
        id: 'datasource',
        name: 'Data Source',
        icon: 'database',
        url: '/admin/datasource',
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
        <Image src={user.image || ''} alt={'user-pic'} width={30} height={30} className="rounded-full" />
        <Typography className="px-4">{user.name}</Typography>
        <ThemeToggle />
        <div className="hidden md:block">
          <Tooltip title="Sign out">
            <IconButton
              color="inherit"
              size="medium"
              aria-label="logout"
              className="mr-4"
              onClick={() => signOut()}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </div>
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
          className="flex-shrink-0 whitespace-nowrap"
          classes={{ paper: 'w-[280px]' }}
        >
          <div className="flex items-center justify-between p-4">
            <Typography color="primary" variant="h6">
              C Place App
            </Typography>
            <IconButton onClick={handleCloseDrawer}>
              {openDrawer ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>
          <Divider />
          <List>
            {menuItems.map((i) => {
              return (
                <div key={i.id}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleMenuClick(i.id)}>
                      <ListItemIcon>
                        <i className={`fa-solid fa-${i.icon}`} />
                      </ListItemIcon>
                      <ListItemText primary={i.name} />
                    </ListItemButton>
                  </ListItem>
                  {i.divider && <Divider />}
                </div>
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
    <div className="flex">
      <AppBar position="static" className="bg-primary-600 dark:bg-gray-800">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            className="mr-4"
            onClick={handleOpenDrawer}
          >
            <MenuIcon />
          </IconButton>
          <div className="hidden md:block flex-grow">
            <Typography variant="h6" className="flex-grow">
              C Place App
            </Typography>
          </div>
          <div className="block md:hidden flex-grow">
            <Typography variant="h6" className="flex-grow">
              &nbsp;
            </Typography>
          </div>

          {data && data.user && renderUser(data.user)}
        </Toolbar>
      </AppBar>
      {renderDrawer()}
    </div>
  );
};

export default MainNavigation;
