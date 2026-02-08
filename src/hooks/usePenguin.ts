import { atom, useAtom, type Setter } from 'jotai';
import { useCallback, useState } from 'react';

const penguinAtom = atom(false);

export function usePenguin() {
  const [isActive, setIsActive] = useAtom(penguinAtom);
  const [isDeactivating, setIsDeactivating] = useState(false);

  // 表示
  const active = useCallback(() => {
    setIsActive(true);
  }, [setIsActive]);

  // 非表示
  const inactive = useCallback(() => {
    setIsDeactivating(true);

    setTimeout(() => {
      setIsActive(false);
      setIsDeactivating(false);
    }, 1000);
  }, [setIsActive, setIsDeactivating]);

  return { isActive, isDeactivating, active, inactive };
}

export function showPenguin(set: Setter) {
  set(penguinAtom, true);
}
