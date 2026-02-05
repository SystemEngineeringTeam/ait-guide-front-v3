export const FACILITY_TYPES = ['academic', 'cafeteria', 'clubhouse', 'ground', 'parking', 'gym', 'other'] as const;
export const PASSAGE_TYPE = 'passage' as const;
export const ALL_FACILITY_TYPES = [...FACILITY_TYPES, PASSAGE_TYPE] as const;

export type AllFacilityTypes = (typeof ALL_FACILITY_TYPES)[number];
export type FacilityTypes = (typeof FACILITY_TYPES)[number];
export type PassageType = typeof PASSAGE_TYPE;
