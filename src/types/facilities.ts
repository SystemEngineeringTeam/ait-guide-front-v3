import { FacilityId } from '@/consts/facilityId';
import { FacilityTypes, PassageType } from '@/consts/facilityType';
import { FeatureCollection } from 'geojson';

export interface GeoJSONFacilities {
  id: FacilityId;
  type: FacilityTypes;
  name: string;
  candidate?: string[];
  data: FeatureCollection;
}

export interface GeoJSONPassage {
  id?: FacilityId;
  type: PassageType;
  data: FeatureCollection;
}

export type GeoJSONData = GeoJSONFacilities | GeoJSONPassage;
