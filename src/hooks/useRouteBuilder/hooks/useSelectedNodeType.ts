import { RouteNodeType } from '@/hooks/useRouteBuilder/types/route';
import { atom, useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';

const selectedNodeTypeAtom = atom<RouteNodeType>('passage');

/** 選択されたノードのタイプを更新する関数を提供する */
export const useSelectedNodeTypeSetter = () => {
  return useSetAtom(selectedNodeTypeAtom);
};

/** ノードのタイプを取得する関数を提供する */
export const useGetSelectedNodeTypeFn = () => {
  return useAtomCallback((get) => get(selectedNodeTypeAtom));
};
