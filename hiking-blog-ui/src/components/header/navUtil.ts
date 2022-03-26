export const DAHBOARD_URL = '/dashboard';
export const TRIPS_URL = '/trips';
export const TRIP_DETAILS_URL = '/tripDetails/:tripId';
export const NEW_TRIP_URL = '/tripDetails/_new';
export const NEW_TRIP_BULK_URL = '/tripDetails/_newBulk';

export const getTripDetailsUrl = (key: number) => {
  return `/tripDetails/${key.toString()}`;
};
