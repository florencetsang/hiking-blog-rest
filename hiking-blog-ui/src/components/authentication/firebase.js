// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5LsZWY3JuZsns2ERAfhXosYu10E7EGeA",
  authDomain: "hiking-blog-app.firebaseapp.com",
  databaseURL: "https://hiking-blog-app.firebaseio.com",
  projectId: "hiking-blog-app",
  storageBucket: "hiking-blog-app.appspot.com",
  messagingSenderId: "584040487221",
  appId: "1:584040487221:web:b1157b79a7647e8253147c",
  measurementId: "G-ZBVGB3E77L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);