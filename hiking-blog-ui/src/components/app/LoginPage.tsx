import React from 'react';

import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

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
    <StyledFirebaseAuth
      uiConfig={uiConfig}
      firebaseAuth={auth} />
  );
};

export default LoginPage;
