import { atom, type Setter, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useRef } from 'react';

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

export function setOverlayOpen(set: Setter, open: boolean) {
  set(openAtom, open);
}

interface OverlayEvent {
  onOpen?: () => void;
  onClose?: () => void;
}
export function useOverlayEvent({ onOpen, onClose }: OverlayEvent) {
  const isOpen = useAtomValue(openAtom);
  const prevIsOpenRef = useRef(isOpen);

  if (isOpen !== prevIsOpenRef.current) {
    if (isOpen) {
      onOpen?.();
    } else {
      onClose?.();
    }
    prevIsOpenRef.current = isOpen;
  }
}
