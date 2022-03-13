import React, { Component } from 'react';
import Posts from '../posts/Posts';
import NewPost from '../create_post/NewPost'
import HikingMap from './../map/HikingMap';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Navigation from '../header/Navigation';

export default class Pages extends Component {

    render() {

      return (

        <BrowserRouter>
          <Navigation/>   
          <Routes>
            <Route path="/" element={<HikingMap/>} />
            <Route path="/map" element={<HikingMap/>} />
            <Route path="/routes" element={<Posts />} />
            <Route path="/new-post" element={<NewPost />} />
          </Routes>
        </BrowserRouter>
      )

    }
}
