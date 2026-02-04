import { FeatureCollection } from 'geojson';

export interface GeoJSONData {
  name: string;
  data: FeatureCollection;
}

import b10 from './buildings/10.json';
import b14 from './buildings/14.json';

export const GEO_JSON_DATA: GeoJSONData[] = [
  {
    name: '10号館',
    data: b10 as FeatureCollection,
  },
  {
    name: '14号館',
    data: b14 as FeatureCollection,
  },
];
