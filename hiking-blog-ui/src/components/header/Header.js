import React, { Component } from 'react';
import logo from '../../images/FT_Grey_NoSlogan_Small_Circle.PNG';

export default class Header extends Component {
    render() {
        return (
            <div className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h2>Florence Tsang</h2>
            </div>
        )
    }
}