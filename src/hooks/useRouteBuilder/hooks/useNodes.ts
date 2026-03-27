import { Coord } from '@/types/coord';
import type { RouteNode, RouteNodeId, RouteNodeType } from '@/types/route';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useGetUserIdFn } from './useUserId';
import { uuid } from '../utils/uuid';
import { useGetSelectedNodeTypeFn } from './useSelectedNodeType';

const nodesAtom = atomWithStorage<RouteNode[]>('nodes', []);
const getNodeAtom = atom((get) => (nodeId: RouteNodeId) => {
  const nodes = get(nodesAtom);
  const node = nodes.find((n) => n.id === nodeId);

  if (!node) {
    throw new Error(`Node with id ${nodeId} not found`);
  }

  return node;
});

/** ノードの更新関数たちを提供する */
export const useNodesSetter = () => {
  const setNodes = useSetAtom(nodesAtom);
  const userId = useGetUserIdFn();
  const getSelectedNodeType = useGetSelectedNodeTypeFn();

  /** ノードを追加する関数 */
  const addNode = (coord: Coord) => {
    const newNode: RouteNode = {
      id: `${getSelectedNodeType()}:${userId()}:${uuid()}`,
      coord,
      type: getSelectedNodeType(),
    };
    setNodes((prev) => [...prev, newNode]);
  };

  /** 既存ノードの type を変更する関数 */
  const changeNodeType = (nodeId: RouteNodeId, type: RouteNodeType) => {
    setNodes((prev) => prev.map((node) => (node.id === nodeId ? { ...node, type } : node)));
  };

  /** ノードを削除する関数 */
  const removeNode = (nodeId: RouteNodeId) => {
    setNodes((prev) => prev.filter((node) => node.id !== nodeId));
  };

  return {
    addNode,
    changeNodeType,
    removeNode,
  } as const;
};

/** ノードを取得する関数 */
export const useGetNodeFn = () => {
  return useAtomValue(getNodeAtom);
};

/** ノードの配列を提供する */
export const useNodesValue = () => {
  return useAtomValue(nodesAtom);
};

/** ノードの配列を提供する */
export const useNodes = () => {
  const nodes = useAtomValue(nodesAtom);
  const setters = useNodesSetter();
  const getNode = useGetNodeFn();

  return {
    nodes,
    getNode,
    ...setters,
  } as const;
};
