import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';

const openAtom = atom<boolean>(false);

export function useBottomSheet() {
  const [isOpen, setIsOpen] = useAtom(openAtom);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}

export function useBottomSheetOpen() {
  const setIsOpen = useSetAtom(openAtom);

  return useCallback(() => {
    setIsOpen(true);
  }, []);
}
