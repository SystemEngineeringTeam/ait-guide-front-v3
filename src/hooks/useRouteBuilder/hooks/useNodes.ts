import { Coord } from '@/types/coord';
import type { RouteNode, RouteNodeId, RouteNodeType } from '@/hooks/useRouteBuilder/types/route';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { uuid } from '../utils/uuid';
import { useGetSelectedNodeTypeFn } from './useSelectedNodeType';
import type { Feature, FeatureCollection, Point } from 'geojson';

const nodesAtom = atomWithStorage<RouteNode[]>('nodes', []);
const nodesGeoJsonAtom = atom((get) => {
  const nodes = get(nodesAtom);
  return {
    type: 'FeatureCollection' as const,
    features: nodes.map(
      (node) =>
        ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: node.coord,
          },
          properties: {
            nodeId: node.id,
            nodeType: node.type,
          },
        }) satisfies Feature<Point>,
    ),
  } satisfies FeatureCollection<Point>;
});
export const getNodeAtom = atom((get) => (nodeId: RouteNodeId) => {
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
  const getSelectedNodeType = useGetSelectedNodeTypeFn();

  /** ノードを追加する関数 */
  const addNode = (coord: Coord) => {
    const newNode: RouteNode = {
      id: `${getSelectedNodeType()}:${uuid()}`,
      coord,
      type: getSelectedNodeType(),
    };
    setNodes((prev) => [...prev, newNode]);
  };

  /** 既存ノードの type を変更する関数 */
  const changeNodeType = (nodeId: RouteNodeId, type: RouteNodeType) => {
    const newId = `${type}:${uuid()}` as RouteNodeId;

    setNodes((prev) =>
      prev.map((node) => {
        if (node.id !== nodeId) {
          return node;
        }
        return { ...node, type, id: newId };
      }),
    );

    return newId;
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

export const useNodesGeoJSONValue = () => {
  return useAtomValue(nodesGeoJsonAtom);
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
