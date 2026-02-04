import { atom, useAtom } from 'jotai';
import { useCallback } from 'react';

const openAtom = atom(false);

export function useOverlayOpen() {
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
