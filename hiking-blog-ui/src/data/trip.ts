import { DateTime } from 'luxon';

import {Tag} from './tag';

export interface Trip {
  key: number;
  name: string;
  description: string;
  tags: Tag[];
  pathCoordinates: Coordinate[];
  fromDate: DateTime;
  toDate: DateTime;
}

export interface Coordinate {
  lat: number;
  lng: number;
}
