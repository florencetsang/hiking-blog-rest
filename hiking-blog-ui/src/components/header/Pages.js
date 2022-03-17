import React, { Component } from 'react';
import Posts from '../posts/Posts';
import NewPost from '../create_post/NewPost'
import HikingMap from './../map/HikingMap';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Navigation from '../header/Navigation';

export default class Pages extends Component {

    render() {

      return (

        <BrowserRouter>
          <Navigation/>   
          <Routes>
            <Route path="/map" element={<HikingMap/>} />
            <Route path="/routes" element={<Posts />} />
            <Route path="/newPost" element={<NewPost />} />
            <Route path="*" element={<Navigate replace to="/map" />} />
          </Routes>
        </BrowserRouter>
      )

    }
}
