import { Coord } from '@/types/coord';
import type { RouteEdgeId, RouteNodeId } from '../types/route';
import { useEdgesSetter, useGetEdgeFn } from './useEdges';
import { useGetNodeFn, useNodesSetter } from './useNodes';

export const useRouteController = () => {
  const { addNode, removeNode, moveNode } = useNodesSetter();
  const { addEdge, removeEdge, removeEdgesByNodeId } = useEdgesSetter();
  const getEdge = useGetEdgeFn();
  const getNode = useGetNodeFn();

  /** エッジの途中にノードを追加する関数 */
  const addMiddleNode = (edgeId: RouteEdgeId, coord: Coord) => {
    const edge = getEdge(edgeId);
    const edgeNodes = edge.nodeIds.map((nodeId) => getNode(nodeId));

    const newNode = addNode(coord); // 中点のノードを追加
    addEdge([edgeNodes[0].id, newNode.id]); // 既存エッジの始点と中点を結ぶエッジを追加
    addEdge([newNode.id, edgeNodes[1].id]); // 中点と既存エッジの終点を結ぶエッジを追加
    removeEdge(edgeId);
  };

  /** ノードとそれに紐づくエッジを削除する関数 */
  const removeNodeAndEdges = (nodeId: RouteNodeId) => {
    removeEdgesByNodeId(nodeId);
    removeNode(nodeId);
  };

  return {
    addMiddleNode,
    removeNodeAndEdges,

    moveNode,
  } as const;
};
