import React from 'react';

import { MapContainer, TileLayer, Polyline } from 'react-leaflet';

import { MapProps } from '../../../data/map';

const OpenStreetMapMap = (props: MapProps) => {
  return (
    <MapContainer
      center={[props.initialCenter.lat, props.initialCenter.lng]}
      zoom={props.initialZoom}
      style={{
        width: '100%',
        height: '100%'
      }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {props.trips.map((trip) => (
        <Polyline positions={trip.pathCoordinates.map((coor) => [coor.lat, coor.lng])}/>
      ))}
    </MapContainer>
  );
};

export default OpenStreetMapMap;
