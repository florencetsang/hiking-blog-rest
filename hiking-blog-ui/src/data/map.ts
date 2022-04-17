import { Trip, Coordinate } from "./trip";

export enum MapType {
  GOOGLE,
  OPENSTREETMAP
}

export interface MapProps {
  initialCenter: Coordinate;
  initialZoom: number;
  trips: Trip[];
}
