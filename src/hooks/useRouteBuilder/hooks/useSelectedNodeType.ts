import { RouteNodeType } from '@/types/route';
import { atom, useAtomValue, useSetAtom } from 'jotai';

const selectedNodeTypeAtom = atom<RouteNodeType>('passage');
const getSelectedNodeTypeAtom = atom((get) => () => get(selectedNodeTypeAtom));

/** 選択されたノードのタイプを更新する関数を提供する */
export const useSelectedNodeTypeSetter = () => {
  return useSetAtom(selectedNodeTypeAtom);
};

/** ノードのタイプを取得する関数を提供する */
export const useGetSelectedNodeTypeFn = () => {
  return useAtomValue(getSelectedNodeTypeAtom);
};
