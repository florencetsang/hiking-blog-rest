import React, { useCallback, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { getAuth, signInWithPopup, signInWithRedirect, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";

export default function AppMenu(props) {

  const {loggedInUser} = props;

  const handleLogin = useCallback((event) => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    console.log("Login is clicked");
    signInWithPopup(auth, provider)
    .then((result) => {
      console.log("Logged in");
    }).catch((error) => {
      console.log(`Error occurred during sign in ${error}`);
    });
  }, []);

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
          {loggedInUser? 
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Welcome, {loggedInUser.displayName}.</Typography>:
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Pls sign in.</Typography>}
          {loggedInUser ?  <Button onClick={handleLogout} color="inherit">Logout</Button>: <Button onClick={handleLogin} color="inherit">Login</Button>}          
        </Toolbar>
      </AppBar>
    </Box>
  );
}