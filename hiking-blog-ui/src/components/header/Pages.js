import React, { Component } from 'react';
import Posts from '../posts/Posts';
import NewPost from '../create_post/NewPost'
import HikingMap from './../map/HikingMap';

export default class Pages extends Component {

    render() {
        return (

            <div>
                {
                    this.props.activeTab === "map" &&
                    <HikingMap/>
                }
                {
                    this.props.activeTab === "routes" &&
                    <Posts />                
                }
                {
                    this.props.activeTab === "form-material" &&                    
                    <NewPost />
                }
            </div>
        )
    }
}