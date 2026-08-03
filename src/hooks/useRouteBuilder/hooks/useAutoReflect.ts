import { atom, useAtomValue, useSetAtom } from 'jotai';
import { RouteAutoReflectOptions, RouteEdgeOptions, RouteEdgeOptionsKey } from '../types/route';

const autoReflectAtom = atom<boolean>(false);
const getAutoReflectAtom = atom((get) => () => get(autoReflectAtom));

const autoReflectOptionsAtom = atom<RouteAutoReflectOptions>({
  level: false,
  hasStairs: false,
  isAccessible: false,
  isIndoor: false,
});
const getAutoReflectOptionsAtom = atom((get) => () => get(autoReflectOptionsAtom));

/** 自動反映のON/OFFを更新する関数を提供する */
export const useAutoReflectSetter = () => {
  return useSetAtom(autoReflectAtom);
};

/** 自動反映のON/OFFの値を取得する関数を提供する */
export const useGetAutoReflectFn = () => {
  return useAtomValue(getAutoReflectAtom);
};

/** 自動反映のON/OFFの値を取得する */
export const useAutoReflectValue = () => {
  return useAtomValue(autoReflectAtom);
};

export const useAutoReflect = () => {
  const set = useSetAtom(autoReflectAtom);
  const value = useAtomValue(autoReflectAtom);

  return [value, set] as const;
};

/** 自動反映オプションの値を取得する */
export const useAutoReflectOptionsValue = () => {
  return useAtomValue(autoReflectOptionsAtom);
};

/** 自動反映オプションの値を更新する関数を提供する */
export const useAutoReflectOptionsSetter = () => {
  const set = useSetAtom(autoReflectOptionsAtom);

  const changeAutoReflectOption = (key: RouteEdgeOptionsKey, value: boolean) => {
    set((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return {
    changeAutoReflectOption,
  } as const;
};

/** 自動反映オプションの値を取得する関数を提供する */
export const useGetAutoReflectOptionsFn = () => {
  return useAtomValue(getAutoReflectOptionsAtom);
};

export const useAutoReflectOptions = () => {
  const { changeAutoReflectOption } = useAutoReflectOptionsSetter();
  const value = useAtomValue(autoReflectOptionsAtom);
  return [value, changeAutoReflectOption] as const;
};
