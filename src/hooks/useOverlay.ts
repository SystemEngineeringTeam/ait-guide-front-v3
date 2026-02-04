import { atom, useAtom, useSetAtom } from 'jotai';
import { useCallback } from 'react';

const openAtom = atom(false);

export function useOverlay() {
  const [isOpen, setIsOpen] = useAtom(openAtom);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, [setIsOpen]);

  const open = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}

export function useOverlayClose() {
  const setIsOpen = useSetAtom(openAtom);

  return useCallback(() => {
    setIsOpen(false);
  }, []);
}
