import React, { useState, useCallback} from 'react';
import { getAuth, signOut } from "firebase/auth";
import { useUser } from 'reactfire';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import CssBaseline from '@mui/material/CssBaseline';

import { Link } from 'react-router-dom';
import { DAHBOARD_URL, TRIPS_URL } from './navUtil';

const drawerWidth = 240;

const pages = [
  {title: 'Dashboard', link: DAHBOARD_URL},
  {title: 'Trips', link: TRIPS_URL}
];
const settings = ['Profile', 'Logout'];

export default function AppMenu(props) {
  const { data: user } = useUser();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleDrawerOpen = useCallback(() => setDrawerOpen(true), []);
  const handleDrawerClose = useCallback(() => setDrawerOpen(false), []);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = useCallback((event) => {
    const auth = getAuth();
    signOut(auth).then(() => {
      console.log("Sign out success.");
    }).catch((error) => {
      console.log(`Error occurred during logout: ${error}`);
    });
  }, [])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <CssBaseline />

      <AppBar position="static">
        <Toolbar>
          {/* App name for desktop (md or above) */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            TripHub
          </Typography>

          {/* Menu icon for mobile */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerOpen}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* App name for mobile */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            TripHub
          </Typography>

          {/* Pages for desktop (md or above) */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                component={Link}
                to={page.link}
                key={page.title}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          {/* User menu */}
          {
            user
            &&
            <Box sx={{ flexGrow: 0 }}>
              {/* User icon */}
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenUserMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              {/* User menu */}
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem key='Profile' onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{user.displayName}</Typography>
                </MenuItem>
                <MenuItem key='Logout' onClick={handleLogout}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
                {/* {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))} */}
              </Menu>
            </Box>
          }
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="Nav"
      >
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <Toolbar />
          <Divider />
          <List>
            {pages.map((page) => (
              <ListItem
                key={page.title}
                component={Link}
                to={page.link}
                onClick={handleDrawerClose}
              >
                {page.title}
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Box>
    </Box>
  );
}