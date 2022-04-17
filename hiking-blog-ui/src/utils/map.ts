import { MapType } from "../data/map";

// temp
const MAP_TYPE_LOCAL_STORAGE_KEY = 'mapType';
export const getInitialMapType = (): MapType => {
  const localStorageMapType = localStorage.getItem(MAP_TYPE_LOCAL_STORAGE_KEY);
  return (localStorageMapType !== null) ? parseInt(localStorageMapType) : MapType.GOOGLE;
};
export const saveMapType = (mapType: MapType) => {
  localStorage.setItem(MAP_TYPE_LOCAL_STORAGE_KEY, mapType.toString());
};
