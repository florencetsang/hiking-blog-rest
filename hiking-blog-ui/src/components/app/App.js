import React, { Component } from 'react';

import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { FirebaseAppProvider, useFirebaseApp, AuthProvider, AnalyticsProvider } from 'reactfire';

import Main from './Main';

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

  return (
    <AuthProvider sdk={auth}>
      <AnalyticsProvider sdk={analytics}>
        <Main/>
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
