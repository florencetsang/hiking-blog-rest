export const MAP_URL = '/map';
export const TRIPS_URL = '/trips';
export const TRIP_DETAILS_URL = '/tripDetails/:tripId';
export const NEW_TRIP_URL = '/tripDetails/_new';

export const getTripDetailsUrl = (key: number) => {
  return `/tripDetails/${key.toString()}`;
};
