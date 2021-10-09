import React, { Component } from 'react';
import Posts from '../posts/Posts';
import NewPost from '../create_post/NewPost'
import HikingMap from './../map/HikingMap';

export default class Pages extends Component {

    render() {

        const {activeTab} = this.props;

        let page;
        switch (activeTab) {
            case "map":
                page = <HikingMap/>;
                break;
            case "routes":
                page = <Posts />;
                break;
            case "form-material":
                page = <NewPost />;
                break;
            default:
                page = <HikingMap/> 
        }

        return (
            <div>
                {page}
            </div>
        )
    }
}
