import React from 'react';
import { useSigninCheck } from 'reactfire';
import Pages from '../header/Pages';
import Footer from '../header/Footer';
import LoginPage from './LoginPage';

export default function Main() {
    const { data: signInCheckResult } = useSigninCheck();

    return (
        <div>
            {
                (signInCheckResult && signInCheckResult.signedIn)
                ? <Pages/>
                : <LoginPage/>
            }
        </div>
    );
};
