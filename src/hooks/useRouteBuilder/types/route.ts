import { Coord } from '../../../types/coord';
import { ROUTE_NODE_TYPE } from '../consts/routeMode';

export type UUID = string & { __brand: 'UUID' }; // UUID v4形式

export type RouteNodeType = (typeof ROUTE_NODE_TYPE)[number];
export type RouteNodeId = `${RouteNodeType}:${UUID}`;

export interface RouteNode {
  id: RouteNodeId; // 出力時に使用するID
  uuid: UUID; // ID 変更時にノードを特定するための静的なID
  coord: Coord;
  type: RouteNodeType;
}

export type RouteEdgeId = `${UUID}`;
export type RouteEdgeLevel = 1 | 2 | 3 | 4 | 5; // 1: 最優先 ~ 3: 裏道, 4: あまり使われない, 5: 知る人ぞ知るルート

export interface RouteEdge {
  id: RouteEdgeId;
  uuid: UUID; // ID 変更時にエッジを特定するための静的なID
  nodeIds: [RouteNodeId, RouteNodeId];
  level: RouteEdgeLevel;
  hasStairs: boolean; // 階段の有無
  isAccessible: boolean; // バリアフリー対応の有無
  isIndoor: boolean; // 屋内か
}
