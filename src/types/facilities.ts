import { FacilityId } from '@/consts/facilityId';
import { FacilityTypes, PassageType } from '@/consts/facilityType';
import { FeatureCollection } from 'geojson';
import { StaticImageData } from 'next/image';

export type FloorName = `${number}` | `B${number}` | `M${number}` | 'R';

export type FloorImages = Partial<Record<FloorName, StaticImageData>>;

export interface GeoJSONFacilities {
  id: FacilityId;
  type: FacilityTypes;
  name: string;
  candidate?: string[];
  data: FeatureCollection;
  floorImages?: FloorImages;
  polygonDivision?: number;
}

export interface GeoJSONPassage {
  id?: FacilityId;
  type: PassageType;
  data: FeatureCollection;
}

export type GeoJSONData = GeoJSONFacilities | GeoJSONPassage;

export interface Room {
  id: number;
  room: string;
  floor?: FloorName;
  facilityId: FacilityId;
}
