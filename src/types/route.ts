import { Coord } from './coord';

export type UUID = string & { __brand: 'UUID' }; // UUID v4形式
export type UserId = string & { __brand: 'UserId' }; // 10文字以内

export type RouteNodeType = 'entrance' | 'passage' | 'facility';
export type RouteNodeId = `${RouteNodeType}:${UserId}:${UUID}`;

export interface RouteNode {
  id: RouteNodeId;
  coord: Coord;
  type: RouteNodeType;
}

export type RouteEdgeId = `${UserId}:${UUID}`;
export type RouteEdgeLevel = 1 | 2 | 3 | 4 | 5; // 1: 最優先 ~ 3: 裏道, 4: あまり使われない, 5: 知る人ぞ知るルート

export interface RouteEdge {
  id: RouteEdgeId;
  nodeIds: [RouteNodeId, RouteNodeId];
  level: RouteEdgeLevel;
  hasStairs: boolean; // 階段の有無
  isAccessible: boolean; // バリアフリー対応の有無
  isIndoor: boolean; // 屋内か
}
