import { DateTime } from 'luxon';

import { getApi, postApi, postFormData, dataToBlob } from './api';
import { ApiRes, isSuccessApi } from './apiRes';

import { Trip, Coordinate } from '../data/trip';
import { Tag } from '../data/tag';

const TRIP_API_PREFIX = '/api/trip';

interface TripRes {
  key: number;
  name: string;
  description: string;
  tags: Tag[];
  pathCoordinates: Coordinate[];
  fromDate: number;
  toDate: number;
}

const mapper = (res: TripRes): Trip => {
  return {
    key: res.key,
    name: res.name,
    description: res.description,
    tags: res.tags,
    pathCoordinates: res.pathCoordinates,
    fromDate: DateTime.fromMillis(res.fromDate),
    toDate: DateTime.fromMillis(res.toDate)
  };
};

export const getTrips = async (): Promise<Trip[]> => {
  const searchParams = new URLSearchParams();
  try {
    const res = await getApi(`${TRIP_API_PREFIX}/getTrips`, searchParams);
    const resJson = await res.json() as ApiRes<TripRes[]>;
    if (isSuccessApi(resJson)) {
      const trips = resJson.data.map(mapper);
      return trips;
    } else {
      throw new Error(resJson.error);
    }
  } catch (err) {
    console.log('getTrips err', err);
    return [];
  }
};

export const getTrip = async (tripId: string): Promise<Trip | null> => {
  const searchParams = new URLSearchParams();
  searchParams.append('tripId', tripId);
  try {
    const res = await getApi(`${TRIP_API_PREFIX}/getTrip`, searchParams);
    const resJson = await res.json() as ApiRes<TripRes>;
    if (isSuccessApi(resJson)) {
      const trip = mapper(resJson.data);
      return trip;
    } else {
      throw new Error(resJson.error);
    }
  } catch (err) {
    console.log('getTrip err', err);
    return null;
  }
};

export const createTrip = async (name: string, description: string, routeFile: File, tagIds: number[], fromDate: DateTime, toDate: DateTime) => {
  const formData = new FormData();
  const tripData = {
    name: name,
    description: description,
    tagIds: tagIds,
    fromDate: fromDate.toMillis(),
    toDate: toDate.toMillis()
  };
  formData.append('trip', dataToBlob(tripData));
  formData.append('routeFile', routeFile);
  try {
    const res = await postFormData(`${TRIP_API_PREFIX}/createTrip`, formData);
    const resJson = await res.json() as ApiRes<number>;
    if (isSuccessApi(resJson)) {
      return resJson.data;
    } else {
      throw new Error(resJson.error);
    }
  } catch (err) {
    console.log('createTrip error', err);
    return -1;
  }
};

export const deleteTrip = async (tripId: number) => {
  const data = {
    tripId: tripId
  };
  try {
    const res = await postApi(`${TRIP_API_PREFIX}/deleteTrip`, data);
    const resJson = await res.json() as ApiRes<boolean>;
    if (isSuccessApi(resJson)) {
      return resJson.data;
    } else {
      throw new Error(resJson.error);
    }
  } catch (err) {
    console.log('deleteTrip error', err);
    return false;
  }
};
