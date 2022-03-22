import React from 'react';

import Box from '@mui/material/Box';

import { useSigninCheck } from 'reactfire';

import Pages from '../header/Pages';
import Footer from '../header/Footer';
import AppMenu from '../header/AppMenu';

import LoginPage from './LoginPage';

export default function Main() {
    const { data: signInCheckResult } = useSigninCheck();

    return (
        <div>
            <AppMenu/>
            {
                (signInCheckResult && signInCheckResult.signedIn)
                ? <Pages/>
                : <LoginPage/>
            }
        </div>
    );
};
