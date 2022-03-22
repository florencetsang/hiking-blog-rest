import React, { Component } from 'react';
import Trips from '../posts/Trips';
import TripDetails from '../trip/TripDetails';
import HikingMap from './../map/HikingMap';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Navigation from '../header/Navigation';

import { MAP_URL, TRIPS_URL, TRIP_DETAILS_URL } from './navUtil';

export default class Pages extends Component {

    render() {

      return (

        <BrowserRouter>
          <Navigation/>
          <Routes>
            <Route path={MAP_URL} element={<HikingMap/>} />
            <Route path={TRIPS_URL} element={<Trips />} />
            <Route path={TRIP_DETAILS_URL} element={<TripDetails />} />
            <Route path="*" element={<Navigate replace to={MAP_URL} />} />
          </Routes>
        </BrowserRouter>
      )

    }
}
