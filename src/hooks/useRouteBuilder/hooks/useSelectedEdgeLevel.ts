import { RouteEdgeLevel } from '@/hooks/useRouteBuilder/types/route';
import { atom, useAtomValue, useSetAtom } from 'jotai';

const selectedEdgeLevelAtom = atom<RouteEdgeLevel>(1);
const getSelectedEdgeLevelAtom = atom((get) => () => get(selectedEdgeLevelAtom));

/** エッジのレベルを更新する関数を提供する */
export const useSelectEdgeLevelSetter = () => {
  return useSetAtom(selectedEdgeLevelAtom);
};

/** 選択されたエッジのレベルを取得する関数を提供する */
export const useGetSelectedEdgeLevelFn = () => {
  return useAtomValue(getSelectedEdgeLevelAtom);
};
