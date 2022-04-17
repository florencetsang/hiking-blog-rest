import React, { useState } from 'react';

import { GoogleMap, LoadScript } from '@react-google-maps/api';

import Route from './Route';
import ControlPanel from './ControlPanel';
import { MapProps } from '../../../data/map';
import { StrokeStyle } from './data';
import { GOOGLE_MAPS_API_KEY } from './utils';

const GOOGLE_MAP_OPTIONS = {
  streetViewControl: false,
  gestureHandling: "greedy",
  mapTypeId: "terrain",
  mapTypeControlOptions: { position: 3 },
};

const GoogleMapsMap = (props: MapProps) => {
  const { trips } = props;

  const [activeKey, setActiveKey] = useState(null);
  const [strokeColor, setStrokeColor] = useState('#0000FF');
  const [strokeWeight, setStrokeWeight] = useState(4);
  const [strokeOpacity, setStrokeOpacity] = useState(0.7);
  const [strokeStyle, setStrokeStyle] = useState(StrokeStyle.SOLID);

  console.log(`Dashed stroke in Routes is ${strokeStyle}`);
  console.log(`Number to routes to render: ${trips.length}`);

  if (!GOOGLE_MAPS_API_KEY) {
    return null;
  }

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{
          width: '100%',
          height: '100%'
        }}
        zoom={props.initialZoom}
        center={props.initialCenter}
        clickableIcons={false}
        options={GOOGLE_MAP_OPTIONS}
      // onLoad={map => handleOnLoad(map)}
      >
        <ControlPanel
          setStrokeColor={setStrokeColor}
          setStrokeWeight={setStrokeWeight}
          setStrokeOpacity={setStrokeOpacity}
          setStrokeStyle={setStrokeStyle}
          strokeColor={strokeColor}
          strokeWeight={strokeWeight}
          strokeOpacity={strokeOpacity}
          strokeStyle={strokeStyle}
        />

        {trips && trips.map(trip => <Route
          key={trip.key}
          tripKey={trip.key}
          name={trip.name}
          setActiveKey={setActiveKey}
          isActive={trip.key === activeKey}
          pathCoordinates={trip.pathCoordinates}
          strokeColor={strokeColor}
          strokeWeight={strokeWeight}
          strokeOpacity={strokeOpacity}
          strokeStyle={strokeStyle} />)}
        {/* <ControlPanelElement /> */}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapsMap;
