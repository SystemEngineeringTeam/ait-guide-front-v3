import { values } from "@/utils/object";

export const RouteModeMap = {
  entrance: 'entrance',
  passage: 'passage',
  facility: 'facility',
} as const;
export const ROUTE_MODE = values(RouteModeMap);
