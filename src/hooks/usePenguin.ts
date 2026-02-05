import { atom, useAtom, type Setter } from 'jotai';

const penguinAtom = atom(false);

export function usePenguin() {
  return useAtom(penguinAtom);
}

export function showPenguin(set: Setter) {
  set(penguinAtom, true);
}
