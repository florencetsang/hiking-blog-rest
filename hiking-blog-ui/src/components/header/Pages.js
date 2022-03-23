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
import { DAHBOARD_URL, TRIPS_URL, TRIP_DETAILS_URL, NEW_TRIP_BULK_URL } from './navUtil';
import UploadFileBulk from './../trip/UploadFileBulk';
import AppMenu from './AppMenu';

export default class Pages extends Component {

  render() {

    return (

      <BrowserRouter>
        <AppMenu/>
        <Routes>
          <Route path={DAHBOARD_URL} element={<HikingMap/>} />
          <Route path={TRIPS_URL} element={<Trips />} />
          <Route path={TRIP_DETAILS_URL} element={<TripDetails />} />
          <Route path={NEW_TRIP_BULK_URL} element={<UploadFileBulk />} />
          <Route path="*" element={<Navigate replace to={DAHBOARD_URL} />} />
        </Routes>
      </BrowserRouter>
    )
  }
}
