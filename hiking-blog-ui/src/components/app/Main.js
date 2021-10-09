import React, { Component } from 'react';
import Pages from '../header/Pages';
import Footer from '../header/Footer';
import Navigation from '../header/Navigation';

export default class Main extends Component {

    state = {
        activeTab: "map"
    };

    setActiveTab = (activeTab) => {
        this.setState({
            activeTab: activeTab
        });
        console.log(`Setting active page to ${activeTab}`);
    };

    render() {
        return (
            <div>
                <Navigation setActiveTab={this.setActiveTab}/>             
                <Pages activeTab={this.state.activeTab} />
                {/* <Footer /> */}
            </div >
        );
    }
}