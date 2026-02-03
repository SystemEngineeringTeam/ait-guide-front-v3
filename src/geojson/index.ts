import { FeatureCollection } from 'geojson';

export interface GeoJSONData {
  name: string;
  data: FeatureCollection;
}

import b14 from './buildings/14.json';

export const GEO_JSON_DATA: GeoJSONData[] = [
  {
    name: '14号館',
    data: b14 as FeatureCollection,
  },
];
