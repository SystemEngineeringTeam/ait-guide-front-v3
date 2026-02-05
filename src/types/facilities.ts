import { FacilityTypes, PassageType } from '@/consts/facilityType';
import { FeatureCollection } from 'geojson';

export interface GeoJSONFacilities {
  id: string;
  type: FacilityTypes;
  name: string;
  candidate?: string[];
  data: FeatureCollection;
}

export interface GeoJSONPassage {
  id?: string;
  type: PassageType;
  data: FeatureCollection;
}

export type GeoJSONData = GeoJSONFacilities | GeoJSONPassage;
