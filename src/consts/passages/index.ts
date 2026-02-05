import { FeatureCollection } from 'geojson';
import { GeoJSONPassage } from '@/types/facilities';
import p9to10 from './geojson/9-10.json';
import pPlazaTo10 from './geojson/plaza-10.json';
import pPlazaToAiwa from './geojson/plaza-aiwa.json';
import left7 from './geojson/left-7.json';
import computerToInformation from './geojson/computer-information.json';
import b4ToAnnex4 from './geojson/4-annex4.json';
import annex4ToB11 from './geojson/annex4-11.json';
import b3ToAnnex3 from './geojson/3-annex3.json';
import annex3ToBio from './geojson/annex3-bio.json';

export const GEO_JSON_PASSAGES: GeoJSONPassage[] = [
  {
    type: 'passage',
    data: p9to10 as FeatureCollection,
  },
  {
    type: 'passage',
    data: pPlazaTo10 as FeatureCollection,
  },
  {
    type: 'passage',
    data: pPlazaToAiwa as FeatureCollection,
  },
  {
    type: 'passage',
    data: left7 as FeatureCollection,
  },
  {
    type: 'passage',
    data: computerToInformation as FeatureCollection,
  },
  {
    type: 'passage',
    data: b4ToAnnex4 as FeatureCollection,
  },
  {
    type: 'passage',
    data: annex4ToB11 as FeatureCollection,
  },
  {
    type: 'passage',
    data: b3ToAnnex3 as FeatureCollection,
  },
  {
    type: 'passage',
    data: annex3ToBio as FeatureCollection,
  },
];
