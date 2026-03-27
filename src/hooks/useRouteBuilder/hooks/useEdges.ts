import type { RouteEdge, RouteEdgeId, RouteEdgeLevel, RouteNodeId } from '@/types/route';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useGetUserIdFn } from './useUserId';
import { uuid } from '../utils/uuid';
import { useGetSelectedEdgeLevelFn } from './useSelectedEdgeLevel';

const edgesAtom = atomWithStorage<RouteEdge[]>('edges', []);
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
  const userId = useGetUserIdFn();
  const getEdgeLevel = useGetSelectedEdgeLevelFn();

  /** エッジを追加する関数 */
  const add = (nodeIds: [RouteNodeId, RouteNodeId]) => {
    const id: RouteEdgeId = `${userId()}:${uuid()}`;
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
  const remove = (edgeId: RouteEdgeId) => {
    setEdges((prev) => prev.filter((edge) => edge.id !== edgeId));
  };

  return {
    add,
    changeEdgeLevel,
    changeEdgeHasStairs,
    changeEdgeIsAccessible,
    changeEdgeIsIndoor,
    remove,
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
