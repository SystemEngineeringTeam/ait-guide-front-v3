import { atom, useAtomValue, useSetAtom } from 'jotai';

const autoReflectAtom = atom<boolean>(false);
const getAutoReflectAtom = atom((get) => () => get(autoReflectAtom));

export const useAutoReflectSetter = () => {
  const set = useSetAtom(autoReflectAtom);
};

export const useAutoReflectValue = () => {
  return useAtomValue(autoReflectAtom);
};

export const useAutoReflect = () => {
  const set = useSetAtom(autoReflectAtom);
  const value = useAtomValue(autoReflectAtom);

  return [value, set] as const;
}

export const useGetAutoReflectFn = () => {
  return useAtomValue(getAutoReflectAtom);
}
