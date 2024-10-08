import React, { Component } from 'react';

import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { FirebaseAppProvider, useFirebaseApp, AuthProvider, AnalyticsProvider } from 'reactfire';
import { SnackbarProvider } from 'notistack';

import Main from './Main';

import { LoadingProvider } from '../context/LoadingContext';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const firebaseConfig = {
  apiKey: "AIzaSyAh-FvVa0j-71iD4Dy-NRmymdUo4euLIWU",
  authDomain: "hiking-blog-app.firebaseapp.com",
  databaseURL: "https://hiking-blog-app.firebaseio.com",
  projectId: "hiking-blog-app",
  storageBucket: "hiking-blog-app.appspot.com",
  messagingSenderId: "584040487221",
  appId: "1:584040487221:web:f56f336fc90e366553147c",
  measurementId: "G-0JEMS8DE6Z"
};

const _App = () => {
  const app = useFirebaseApp();
  const auth = getAuth(app);
  const analytics = getAnalytics(app);

  if (process.env.NODE_ENV !== 'production' && process.env.REACT_APP_DEV_FIREBASE_EMULATOR === 'true') {
    console.log('using Firebase emulator')
    if (process.env.REACT_APP_DEV_FIREBASE_EMULATOR_AUTH_HOST) {
      connectAuthEmulator(auth, process.env.REACT_APP_DEV_FIREBASE_EMULATOR_AUTH_HOST);
      console.log('using auth emulator');
    }
  }

  return (
    <AuthProvider sdk={auth}>
      <AnalyticsProvider sdk={analytics}>
        <SnackbarProvider maxSnack={1} autoHideDuration={2000}>
          <LoadingProvider>
            <Main/>
          </LoadingProvider>
        </SnackbarProvider>
      </AnalyticsProvider>
    </AuthProvider>
  );
};

class App extends Component {
  render() {
    return (
      <div className="App">
        <FirebaseAppProvider firebaseConfig={firebaseConfig}>
          <_App/>
        </FirebaseAppProvider>
      </div >
    );
  }
}

export default App;
