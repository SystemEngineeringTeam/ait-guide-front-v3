import { Coord } from '@/types/coord';
import type { RouteNode, RouteNodeType, UUID } from '@/hooks/useRouteBuilder/types/route';
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
            nodeId: node.uuid,
            nodeType: node.type,
          },
        }) satisfies Feature<Point>,
    ),
  } satisfies FeatureCollection<Point>;
});
export const getNodeAtom = atom((get) => {
  const nodes = get(nodesAtom);

  return (nodeId: UUID) => {
    const node = nodes.find((n) => n.uuid === nodeId);

    if (!node) {
      throw new Error(`Node with id ${nodeId} not found`);
    }

    return node;
  };
});
export const getNodeByUUIDAtom = atom((get) => {
  const nodes = get(nodesAtom);

  return (uuid: string) => {
    const node = nodes.find((n) => n.uuid === uuid);

    if (!node) {
      throw new Error(`Node with uuid ${uuid} not found`);
    }

    return node;
  };
});

/** ノードの更新関数たちを提供する */
export const useNodesSetter = () => {
  const getSelectedNodeType = useGetSelectedNodeTypeFn();
  const setNodes = useSetAtom(nodesAtom);

  /** ノードを追加する関数 */
  const addNode = (coord: Coord) => {
    const newNode: RouteNode = {
      uuid: uuid(),
      coord,
      type: getSelectedNodeType(),
    };
    setNodes((prev) => [...prev, newNode]);
    return newNode;
  };

  /** 既存ノードの type を変更する関数 */
  const changeNodeType = (nodeId: UUID, type: RouteNodeType) => {
    setNodes((prev) =>
      prev.map((node) => {
        if (node.uuid !== nodeId) {
          return node;
        }
        return { ...node, type };
      }),
    );

    return nodeId;
  };

  /** ノードを移動する関数 */
  const moveNode = (nodeId: UUID, newCoord: Coord) => {
    setNodes((prev) => prev.map((node) => (node.uuid === nodeId ? { ...node, coord: newCoord } : node)));
  };

  /** ノードを削除する関数 */
  const removeNode = (nodeId: UUID) => {
    setNodes((prev) => prev.filter((node) => node.uuid !== nodeId));
  };

  return {
    addNode,
    removeNode,
    changeNodeType,
    moveNode,
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
