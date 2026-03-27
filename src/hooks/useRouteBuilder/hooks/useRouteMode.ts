import { atom, useAtomValue, useSetAtom } from 'jotai';

const routeModeAtom = atom<'node' | 'edge'>('node');

/** 経路モードを更新する関数を提供する */
export const useRouteModeSetter = () => {
  return useSetAtom(routeModeAtom);
};

/** 経路モードを取得する関数を提供する */
export const useRouteModeValue = () => {
  return useAtomValue(routeModeAtom);
};

export const useRouteMode = () => {
  const mode = useAtomValue(routeModeAtom);
  const setMode = useSetAtom(routeModeAtom);

  return [mode, setMode] as const;
};
