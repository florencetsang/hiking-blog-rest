import React, { useCallback, useState } from 'react';

import { getAuth, signOut } from "firebase/auth";
import { useUser } from 'reactfire';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function AppMenu(props) {
  const { data: user } = useUser();

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
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {user ? `Welcome to TripHub, ${user.displayName}.` : 'TripHub'}
          </Typography>

          {
            user
            && <Button onClick={handleLogout} color="inherit">Logout</Button>
          }
        </Toolbar>
      </AppBar>
    </Box>
  );
}