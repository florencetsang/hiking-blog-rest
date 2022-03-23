import React from 'react';

import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    GoogleAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  },
};

const LoginPage = () => {
  const auth = getAuth();

  return (
    <Container >
      <Typography align="center" variant="h2" component="div" gutterBottom>
          TripHub
      </Typography>
      <StyledFirebaseAuth
        uiConfig={uiConfig}
        firebaseAuth={auth} />
    </Container>
  );
};

export default LoginPage;
