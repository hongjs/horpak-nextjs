import { useCallback, useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
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
  useTheme,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Description as DescriptionIcon,
  Receipt as ReceiptIcon,
  Settings as SettingsIcon,
  Group as GroupIcon,
  AccountBalance as BankIcon,
  Business as BusinessIcon,
  Storage as StorageIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  Apartment as ApartmentIcon,
} from "@mui/icons-material";
import { ThemeToggle } from "components/ThemeToggle";

const DRAWER_WIDTH = 280;

const MainNavigation: React.FC = () => {
  const { data } = useSession();
  const router = useRouter();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const theme = useTheme();

  const menuItems = useMemo(() => {
    return [
      { id: "home", name: "Dashboard", icon: <DashboardIcon />, url: "/" },
      {
        id: "summaryReport",
        name: "Summary Report",
        icon: <DescriptionIcon />,
        url: "/report/viewSummaryReport",
      },
      {
        id: "invoiceReport",
        name: "Invoice Report",
        icon: <ReceiptIcon />,
        url: "/report/viewInvoiceReport",
      },
      {
        id: "process",
        name: "Process",
        icon: <SettingsIcon />,
        url: "/report/processSheet",
      },
      { id: "users", name: "Users", icon: <GroupIcon />, url: "/users" },
      { id: "banks", name: "Banks", icon: <BankIcon />, url: "/bank" },
      {
        id: "branches",
        name: "Branches",
        icon: <BusinessIcon />,
        url: "/branch",
      },
      {
        id: "datasource",
        name: "Data Source",
        icon: <StorageIcon />,
        url: "/admin/datasource",
      },
    ];
  }, []);

  const handleOpenDrawer = () => setOpenDrawer(true);
  const handleCloseDrawer = () => setOpenDrawer(false);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuClick = (url: string) => {
    router.push(url);
    handleCloseDrawer();
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    signOut();
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "background.paper",
          color: "text.primary",
          boxShadow: "none",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleOpenDrawer}
            edge="start"
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              fontWeight: 700,
              color: "primary.main",
              cursor: "pointer",
            }}
            onClick={() => router.push("/")}
          >
            <ApartmentIcon sx={{ mr: 1 }} />
            Hong.JS
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ThemeToggle />

            {data?.user && (
              <Box sx={{ flexGrow: 0 }}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={data.user.name || "User"}
                    src={data.user.image || ""}
                  />
                </IconButton>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {data.user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {data.user.email}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">Sign Out</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Desktop Sidebar (Permanent) */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          [`& .MuiDrawer-paper`]: {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            borderRight: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.default",
            top: "64px",
            height: "calc(100% - 64px)",
          },
        }}
      >
        <Box sx={{ overflow: "auto", py: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.id}
                disablePadding
                sx={{ display: "block", px: 2, mb: 0.5 }}
              >
                <ListItemButton
                  selected={router.pathname === item.url}
                  onClick={() => handleMenuClick(item.url)}
                  sx={{
                    minHeight: 48,
                    justifyContent: "initial",
                    borderRadius: 2,
                    "&.Mui-selected": {
                      backgroundColor: "primary.light",
                      color: "primary.dark",
                      "& .MuiListItemIcon-root": {
                        color: "primary.dark",
                      },
                      "&:hover": {
                        backgroundColor: "primary.light",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 2,
                      justifyContent: "center",
                      color:
                        router.pathname === item.url
                          ? "primary.main"
                          : "text.secondary",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      fontSize: "0.925rem",
                      fontWeight: router.pathname === item.url ? 600 : 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Mobile Drawer (Temporary) */}
      <Drawer
        variant="temporary"
        open={openDrawer}
        onClose={handleCloseDrawer}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH,
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
          }}
        >
          <Typography variant="h6" color="primary.main" fontWeight="bold">
            <ApartmentIcon sx={{ mr: 1, color: "primary.main" }} />
            Hong.JS
          </Typography>
          <IconButton onClick={handleCloseDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={router.pathname === item.url}
                onClick={() => handleMenuClick(item.url)}
              >
                <ListItemIcon
                  sx={{
                    color:
                      router.pathname === item.url ? "primary.main" : "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default MainNavigation;
