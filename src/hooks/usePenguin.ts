import { atom, type Setter } from 'jotai';

export const penguinAtom = atom(false);

export function showPenguin(set: Setter) {
  set(penguinAtom, true);
}
