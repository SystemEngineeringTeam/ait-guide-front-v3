import { FeatureCollection } from 'geojson';

export interface GeoJSONData {
  name?: string;
  data: FeatureCollection;
}

import b1 from './buildings/1.json';
import b9 from './buildings/9.json';
import b10 from './buildings/10.json';
import b10old1 from './buildings/10-old1.json';
import b14 from './buildings/14.json';
import plaza from './buildings/plaza.json';
import aiwa from './buildings/aiwa.json';
import passage9to10 from './buildings/passage-9-10.json';
import passagePlazaTo10 from './buildings/passage-plaza-10.json';
import passagePlazaToAiwa from './buildings/passage-plaza-aiwa.json';

export const GEO_JSON_DATA: GeoJSONData[] = [
  {
    name: '1号館',
    data: b1 as FeatureCollection,
  },
  {
    name: '9号館',
    data: b9 as FeatureCollection,
  },
  {
    name: '10号館',
    data: b10 as FeatureCollection,
  },
  {
    name: '10号館・旧1号館',
    data: b10old1 as FeatureCollection,
  },
  {
    name: '14号館',
    data: b14 as FeatureCollection,
  },
  {
    name: 'AITプラザ',
    data: plaza as FeatureCollection,
  },
  {
    name: '愛和会館',
    data: aiwa as FeatureCollection,
  },
  {
    data: passage9to10 as FeatureCollection,
  },
  {
    data: passagePlazaTo10 as FeatureCollection,
  },
  {
    data: passagePlazaToAiwa as FeatureCollection,
  },
];
