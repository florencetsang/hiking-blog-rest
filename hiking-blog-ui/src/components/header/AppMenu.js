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

  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const [token, setToken] = useState(null);
  const {loggedInUser, setLoggedInUser} = props;

  const handleLogin = useCallback((event) => {
    console.log("Login is clicked");
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;
      setToken(credential.accessToken);
      console.log("Logged in");
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(`Error occured during sign in ${error}`);

    });
  }, []);

  const handleLogout = useCallback((event) => {
    signOut(auth).then(() => {
      console.log("Sign out success.");
    }).catch((error) => {
      console.log(`Error occured during logout: ${error}`);
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Welcome, {loggedInUser.displayName} .</Typography>: 
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Pls sign in.</Typography>}
          {loggedInUser ?  <Button onClick={handleLogout} color="inherit">Logout</Button>: <Button onClick={handleLogin} color="inherit">Login</Button>}          
        </Toolbar>
      </AppBar>
    </Box>
  );
}