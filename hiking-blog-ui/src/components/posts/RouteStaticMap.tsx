import React from 'react';

import {Coordinate} from '../../data/trip';

import {GOOGLE_MAPS_API_KEY} from '../map/google_maps/utils';

export const getMapsImgUrl = (pathCoordinates: Coordinate[], bin = 5) => {
  const coordinates = pathCoordinates.filter((element, index) => {
    return index % bin === 0;
  });
  const coorStr = coordinates.map(coordinate => `${coordinate.lat},${coordinate.lng}`).join('|');
  const maxLat = Math.max(...coordinates.map(coordinate => coordinate.lat));
  const minLat = Math.min(...coordinates.map(coordinate => coordinate.lat));
  const maxLng = Math.max(...coordinates.map(coordinate => coordinate.lng));
  const minLng = Math.min(...coordinates.map(coordinate => coordinate.lng));
  const centerLat = (maxLat + minLat) / 2;
  const centerLng = (maxLng + minLng) / 2;
  return `https://maps.googleapis.com/maps/api/staticmap?center=${centerLat},${centerLng}&zoom=11&size=400x400&maptype=terrain&path=color:0x0000ff80|weight:5|${coorStr}&key=${GOOGLE_MAPS_API_KEY}`
};

interface RouteStaticMapProps {
  pathCoordinates: Coordinate[];
  bin?: number;
}

export const RouteStaticMap = (props: RouteStaticMapProps) => {
  const {pathCoordinates, bin = 5} = props;
  const mapsUrl = getMapsImgUrl(pathCoordinates, bin);

  return (
    <img src={mapsUrl} alt="path"/>
  );
};
