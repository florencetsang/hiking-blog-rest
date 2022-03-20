import { getApi, postApi, postFormData, dataToBlob } from './api';
import { ApiRes, isSuccessApi } from './apiRes';

import { Trip } from '../data/trip';

const TRIP_API_PREFIX = '/api/trip';

export const getTrips = async (): Promise<Trip[]> => {
  const searchParams = new URLSearchParams();
  try {
    const res = await getApi(`${TRIP_API_PREFIX}/getTrips`, searchParams);
    const resJson = await res.json() as ApiRes<Trip[]>;
    if (isSuccessApi(resJson)) {
      return resJson.data;
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
    const resJson = await res.json() as ApiRes<Trip>;
    if (isSuccessApi(resJson)) {
      return resJson.data;
    } else {
      throw new Error(resJson.error);
    }
  } catch (err) {
    console.log('getTrip err', err);
    return null;
  }
};

export const createTrip = async (name: string, description: string, routeFile: File, tagIds: number[]) => {
  const formData = new FormData();
  const tripData = {
    name: name,
    description: description,
    tagIds: tagIds
  };
  formData.append('trip', dataToBlob(tripData));
  formData.append('routeFile', routeFile);
  try {
    const res = await postFormData(`${TRIP_API_PREFIX}/createTrip`, formData);
    const resJson = await res.json() as ApiRes<boolean>;
    if (isSuccessApi(resJson)) {
      return resJson.data;
    } else {
      throw new Error(resJson.error);
    }
  } catch (err) {
    console.log('createTrip error', err);
    return false;
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
