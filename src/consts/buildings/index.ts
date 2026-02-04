import { FeatureCollection } from 'geojson';
import b1 from './geojson/1.json';
import b9 from './geojson/9.json';
import b10 from './geojson/10.json';
import b10old1 from './geojson/10-old1.json';
import b14 from './geojson/14.json';
import plaza from './geojson/plaza.json';
import aiwa from './geojson/aiwa.json';
import passage9to10 from './geojson/passage-9-10.json';
import passagePlazaTo10 from './geojson/passage-plaza-10.json';
import passagePlazaToAiwa from './geojson/passage-plaza-aiwa.json';

export const GEO_JSON_BUILDINGS: GeoJSONData[] = [
  {
    id: '1',
    name: '1号館',
    data: b1 as FeatureCollection,
  },
  {
    id: '14',
    name: '9号館',
    data: b9 as FeatureCollection,
  },
  {
    id: '15',
    name: '10号館',
    data: b10 as FeatureCollection,
  },
  {
    id: '16',
    name: '10号館・旧1号館',
    data: b10old1 as FeatureCollection,
  },
  {
    id: '20',
    name: '14号館',
    data: b14 as FeatureCollection,
  },
  {
    id: '33',
    name: 'AITプラザ',
    data: plaza as FeatureCollection,
  },
  {
    id: '32',
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

export interface GeoJSONData {
  id?: string;
  name?: string;
  data: FeatureCollection;
}
