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
        apiKey: "AIzaSyAh-FvVa0j-71iD4Dy-NRmymdUo4euLIWU",
        authDomain: "hiking-blog-app.firebaseapp.com",
        databaseURL: "https://hiking-blog-app.firebaseio.com",
        projectId: "hiking-blog-app",
        storageBucket: "hiking-blog-app.appspot.com",
        messagingSenderId: "584040487221",
        appId: "1:584040487221:web:f56f336fc90e366553147c",
        measurementId: "G-0JEMS8DE6Z"
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