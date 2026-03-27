import { values } from "@/utils/object";

export const RouteNodeTypeMap = {
  entrance: 'entrance',
  passage: 'passage',
  facility: 'facility',
} as const;
export const ROUTE_NODE_TYPE = values(RouteNodeTypeMap);

export const TYPE_NAMES = [
  { type: RouteNodeTypeMap.facility, name: '施設' },
  { type: RouteNodeTypeMap.entrance, name: '入口' },
  { type: RouteNodeTypeMap.passage, name: '通路' },
];
