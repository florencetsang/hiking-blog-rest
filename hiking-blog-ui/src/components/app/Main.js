import React, {  useState } from 'react';
import Pages from '../header/Pages';
import Footer from '../header/Footer';
import AppMenu from '../header/AppMenu';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";

export default function Main() {

    const [loggedInUser, setLoggedInUser] = useState(null);
    const [activeTab, setActiveTab] = useState("map");

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

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            setLoggedInUser(user);
        } else {
            setLoggedInUser(null);
        }
    });

    return (
        <div>
            <AppMenu loggedInUser={loggedInUser}/>
            {loggedInUser && <Pages loggedInUser={loggedInUser}/> }
        </div>
    );
    
}