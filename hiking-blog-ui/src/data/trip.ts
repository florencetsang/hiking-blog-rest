import {Tag} from './tag';

export interface Trip {
  key: number;
  name: string;
  description: string;
  tags: Tag[];
  pathCoordinates: Coordinate[];
}

export interface Coordinate {
  lat: number;
  lng: number;
}
