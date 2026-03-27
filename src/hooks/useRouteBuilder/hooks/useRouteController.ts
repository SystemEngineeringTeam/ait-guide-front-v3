import { Coord } from '@/types/coord';
import { useEdgesSetter, useGetEdgeFn } from './useEdges';
import { useGetNodeFn, useNodesSetter } from './useNodes';
import { useSelectNodeSetter, useSelectEdgeSetter, useGetSelectedNodeFn } from './useSelectedTarget';
import { useGetRouteModeFn } from './useRouteMode';
import { UUID } from '../types/route';

export const useRouteController = () => {
  const { addNode, removeNode, moveNode } = useNodesSetter();
  const { addEdge, removeEdge, removeEdgesByNodeId } = useEdgesSetter();
  const { selectNode, resetNode } = useSelectNodeSetter();
  const { selectEdge, resetEdge } = useSelectEdgeSetter();
  const getSelectedNode = useGetSelectedNodeFn();
  const getEdge = useGetEdgeFn();
  const getNode = useGetNodeFn();
  const getMode = useGetRouteModeFn();

  /** エッジの途中にノードを追加する関数 */
  const addMiddleNode = (id: UUID, targetType: 'edgeId' | 'nodeId' | {}, coord: Coord) => {
    if (targetType !== 'edgeId') return;

    try {
      const edge = getEdge(id);
      const edgeNodes = edge.nodeIds.map((nodeId) => getNode(nodeId));

      const newNode = addNode(coord); // 中点のノードを追加
      addEdge([edgeNodes[0].uuid, newNode.uuid]); // 既存エッジの始点と中点を結ぶエッジを追加
      addEdge([newNode.uuid, edgeNodes[1].uuid]); // 中点と既存エッジの終点を結ぶエッジを追加
      removeEdge(id);
    } catch (e) {
      console.error('エッジが見つかりませんでした', e);
    }
  };

  /** ノードとそれに紐づくエッジを削除する関数 */
  const removeNodeAndEdges = (nodeId: UUID) => {
    removeEdgesByNodeId(nodeId);
    removeNode(nodeId);
  };

  /** Feature クリック時の処理 */
  const clickFeature = (id: UUID, targetType: 'edgeId' | 'nodeId' | {}) => {
    if (targetType === 'edgeId') {
      const target = getEdge(id);
      selectEdge(target.uuid);
    } else if (targetType === 'nodeId') {
      const prevSelectedNode = getSelectedNode(); // 変更前の選択ノードを取得

      const target = getNode(id as UUID);
      selectNode(target.uuid);

      const mode = getMode();
      if (mode !== 'edge') return;

      if (prevSelectedNode) {
        addEdge([prevSelectedNode.uuid, target.uuid]);
      }
    }
  };

  /** マップ右クリック時にノードを追加する関数 */
  const handleMapContextMenu = (coord: Coord) => {
    const mode = getMode();
    if (mode === 'node') {
      const prevNode = getSelectedNode();
      const newNode = addNode(coord);
      selectNode(newNode.uuid);
      if (prevNode) addEdge([prevNode.uuid, newNode.uuid]);
    }
  };

  /** マップのクリック時の処理 */
  const handleClickNotFeature = () => {
    resetNode();
    resetEdge();
  };

  return {
    addMiddleNode,
    removeNodeAndEdges,
    clickFeature,
    handleMapContextMenu,
    handleClickNotFeature,

    moveNode,
  } as const;
};
