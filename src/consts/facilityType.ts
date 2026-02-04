const BUILDING_TYPES = ['academic', 'cafeteria', 'ground', 'parking', 'other'] as const;
const PASSAGE_TYPE = 'passage' as const;
export const FACILITY_TYPES = [...BUILDING_TYPES, PASSAGE_TYPE] as const;

export type FacilityType = (typeof FACILITY_TYPES)[number];
export type BuildingType = (typeof BUILDING_TYPES)[number];
export type PassageType = typeof PASSAGE_TYPE;
