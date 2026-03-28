import { RouteEdge, RouteEdgeLevel } from '@/hooks/useRouteBuilder/types/route';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';

const defaultEdgeOptionsAtom = atom<Omit<RouteEdge, 'uuid' | 'nodeIds'>>({
  level: 1,
  hasStairs: false,
  isAccessible: false,
  isIndoor: false,
});

/** エッジのレベルを更新する関数を提供する */
export const useDefaultEdgeOptionsSetter = () => {
  const set = useSetAtom(defaultEdgeOptionsAtom);

  const changeEdgeLevel = (level: RouteEdgeLevel) => {
    set((prev) => ({
      ...prev,
      level,
    }));
  };

  const changeEdgeHasStairs = (hasStairs: boolean) => {
    set((prev) => ({
      ...prev,
      hasStairs,
    }));
  };

  const changeEdgeIsAccessible = (isAccessible: boolean) => {
    set((prev) => ({
      ...prev,
      isAccessible,
    }));
  };

  const changeEdgeIsIndoor = (isIndoor: boolean) => {
    set((prev) => ({
      ...prev,
      isIndoor,
    }));
  };

  return {
    changeEdgeLevel,
    changeEdgeHasStairs,
    changeEdgeIsAccessible,
    changeEdgeIsIndoor,
  } as const;
};

/** 選択されたエッジのオプションを取得する関数を提供する */
export const useGetEdgeDefaultOptionsFn = () => {
  return useAtomCallback((get) => get(defaultEdgeOptionsAtom));
};

/** デフォルトのエッジオプションの値を取得する */
export const useDefaultEdgeOptionsValue = () => {
  return useAtomValue(defaultEdgeOptionsAtom);
};

export const useDefaultEdgeOptions = () => {
  const options = useDefaultEdgeOptionsValue();
  const setter = useDefaultEdgeOptionsSetter();

  return {
    options,
    ...setter,
  } as const;
};
