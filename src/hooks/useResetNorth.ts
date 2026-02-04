import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useRef } from 'react';

const countAtom = atom(0);
const countUpAtom = atom(null, (_, set) => set(countAtom, (c) => c + 1));

export function useResetNorth() {
  return useSetAtom(countUpAtom);
}

export function useResetNorhEvent(onReset: () => void) {
  const count = useAtomValue(countAtom);
  const prevCountRef = useRef(count);

  if (prevCountRef.current !== count) {
    prevCountRef.current = count;
    onReset();
  }
}
