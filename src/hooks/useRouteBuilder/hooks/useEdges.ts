import type { RouteEdge, RouteEdgeId, RouteEdgeLevel, RouteNodeId } from '@/hooks/useRouteBuilder/types/route';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { uuid } from '../utils/uuid';
import { useGetSelectedEdgeLevelFn } from './useSelectedEdgeLevel';
import type { Feature, FeatureCollection, LineString } from 'geojson';
import { getNodeAtom } from './useNodes';

const edgesAtom = atomWithStorage<RouteEdge[]>('edges', []);
const edgesGeoJsonAtom = atom((get) => {
  const edges = get(edgesAtom);
  return {
    type: 'FeatureCollection' as const,
    features: edges.map((edge) => {
      const getNode = get(getNodeAtom);

      const fromNodeId = edge.nodeIds[0];
      const fromNode = getNode(fromNodeId);

      const toNodeId = edge.nodeIds[1];
      const toNode = getNode(toNodeId);

      return {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [fromNode.coord, toNode.coord],
        },
        properties: {
          edgeId: edge.id,
          edgeLevel: edge.level,
          hasStairs: edge.hasStairs,
          isAccessible: edge.isAccessible,
          isIndoor: edge.isIndoor,
        },
      } satisfies Feature<LineString>;
    }),
  } satisfies FeatureCollection<LineString>;
});
const getEdgeAtom = atom((get) => (edgeId: RouteEdgeId) => {
  const edges = get(edgesAtom);
  const edge = edges.find((e) => e.id === edgeId);

  if (!edge) {
    throw new Error(`Edge with id ${edgeId} not found`);
  }

  return edge;
});

/** エッジの更新関数たちを提供する */
export const useEdgesSetter = () => {
  const setEdges = useSetAtom(edgesAtom);
  const getEdgeLevel = useGetSelectedEdgeLevelFn();

  /** エッジを追加する関数 */
  const addEdge = (nodeIds: [RouteNodeId, RouteNodeId]) => {
    const id = uuid() as RouteEdgeId;
    const newEdge: RouteEdge = {
      id,
      nodeIds,
      level: getEdgeLevel(),
      hasStairs: false,
      isAccessible: false,
      isIndoor: false,
    };
    setEdges((prev) => [...prev, newEdge]);
  };

  /** 既存エッジの level を変更する関数 */
  const changeEdgeLevel = (edgeId: RouteEdgeId, level: RouteEdgeLevel) => {
    setEdges((prev) => prev.map((edge) => (edge.id === edgeId ? { ...edge, level } : edge)));
  };

  /** 既存エッジの 階段の有無 を変更する関数 */
  const changeEdgeHasStairs = (edgeId: RouteEdgeId, hasStairs: boolean) => {
    setEdges((prev) => prev.map((edge) => (edge.id === edgeId ? { ...edge, hasStairs } : edge)));
  };
  /** 既存エッジの バリアフリーの有無 を変更する関数 */
  const changeEdgeIsAccessible = (edgeId: RouteEdgeId, isAccessible: boolean) => {
    setEdges((prev) => prev.map((edge) => (edge.id === edgeId ? { ...edge, isAccessible } : edge)));
  };

  /** 既存エッジの 屋内か を変更する関数 */
  const changeEdgeIsIndoor = (edgeId: RouteEdgeId, isIndoor: boolean) => {
    setEdges((prev) => prev.map((edge) => (edge.id === edgeId ? { ...edge, isIndoor } : edge)));
  };

  /** エッジを削除する関数 */
  const removeEdge = (edgeId: RouteEdgeId) => {
    setEdges((prev) => prev.filter((edge) => edge.id !== edgeId));
  };

  /** ノードIDに紐づくエッジを削除する関数 */
  const removeEdgesByNodeId = (nodeId: RouteNodeId) => {
    setEdges((prev) => prev.filter((edge) => !edge.nodeIds.includes(nodeId)));
  };

  return {
    addEdge,
    removeEdge,
    removeEdgesByNodeId,
    changeEdgeLevel,
    changeEdgeHasStairs,
    changeEdgeIsAccessible,
    changeEdgeIsIndoor,
  } as const;
};

/** edgeId からエッジ情報を取得する関数を提供する */
export const useGetEdgeFn = () => {
  return useAtomValue(getEdgeAtom);
};

/** edgeId からエッジ情報を提供する */
export const useEdge = (edgeId: RouteEdgeId) => {
  const getEdge = useGetEdgeFn();
  return getEdge(edgeId);
};

/** エッジの配列を提供する */
export const useEdgesValue = () => {
  return useAtomValue(edgesAtom);
};

/** エッジの GeoJSON を提供する */
export const useEdgesGeoJSONValue = () => {
  return useAtomValue(edgesGeoJsonAtom);
};
