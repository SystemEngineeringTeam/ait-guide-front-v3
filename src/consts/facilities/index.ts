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
import { FacilityTypes, PassageType } from '@/consts/facilityType';

export const GEO_JSON_FACILITIES: GeoJSONFacilities[] = [
  {
    id: '1',
    type: 'academic',
    name: '1号館',
    data: b1 as FeatureCollection,
  },
  {
    id: '14',
    type: 'academic',
    name: '9号館',
    data: b9 as FeatureCollection,
  },
  {
    id: '15',
    type: 'academic',
    name: '10号館',
    data: b10 as FeatureCollection,
  },
  {
    id: '16',
    type: 'academic',
    name: '10号館・旧1号館',
    data: b10old1 as FeatureCollection,
  },
  {
    id: '20',
    type: 'academic',
    name: '14号館',
    data: b14 as FeatureCollection,
  },
  {
    id: '33',
    type: 'cafeteria',
    name: 'AITプラザ',
    data: plaza as FeatureCollection,
  },
  {
    id: '32',
    type: 'cafeteria',
    name: '愛和会館',
    data: aiwa as FeatureCollection,
  },
];
export const GEO_JSON_PASSAGES: GeoJSONPassage[] = [
  {
    type: 'passage',
    data: passage9to10 as FeatureCollection,
  },
  {
    type: 'passage',
    data: passagePlazaTo10 as FeatureCollection,
  },
  {
    type: 'passage',
    data: passagePlazaToAiwa as FeatureCollection,
  },
];

export interface GeoJSONFacilities {
  id: string;
  type: FacilityTypes;
  name: string;
  data: FeatureCollection;
}
export interface GeoJSONPassage {
  id?: string;
  type: PassageType;
  data: FeatureCollection;
}

export type GeoJSONData = GeoJSONFacilities | GeoJSONPassage;
