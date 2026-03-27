import { RouteEdgeLevel } from '@/hooks/useRouteBuilder/types/route';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';

const selectedEdgeLevelAtom = atom<RouteEdgeLevel>(1);

/** エッジのレベルを更新する関数を提供する */
export const useSelectEdgeLevelSetter = () => {
  return useSetAtom(selectedEdgeLevelAtom);
};

/** 選択されたエッジのレベルを取得する関数を提供する */
export const useGetSelectedEdgeLevelFn = () => {
  return useAtomCallback((get) => get(selectedEdgeLevelAtom));
};
