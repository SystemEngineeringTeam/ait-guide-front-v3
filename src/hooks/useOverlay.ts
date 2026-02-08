import { atom, type Setter, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { atomFamily } from 'jotai-family';
import { observe } from 'jotai-effect';
import { useCallback, useRef } from 'react';

const OVERLAY_KEYS = ['search', 'change'] as const;
export type OverlayKey = (typeof OVERLAY_KEYS)[number];

const openAtomFamily = atomFamily((key: OverlayKey) => atom<boolean>(false));

export function useOverlay(key: OverlayKey) {
  const [isOpen, setIsOpen] = useAtom(openAtomFamily(key));

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, [setIsOpen]);

  const open = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const closeAll = useCallback(() => {
    for (const key of openAtomFamily.getParams()) {
      observe((_get, set) => set(openAtomFamily(key), false));
    }
  }, [setIsOpen]);

  return {
    isOpen,
    open,
    close,
    toggle,
    closeAll,
  };
}

export function useOverlayClose(key: OverlayKey) {
  const setIsOpen = useSetAtom(openAtomFamily(key));

  return useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);
}

export function closeOverlayAll(set: Setter) {
  for (const key of openAtomFamily.getParams()) {
    set(openAtomFamily(key), false);
  }
}

interface OverlayEvent {
  onOpen?: () => void;
  onClose?: () => void;
}
export function useOverlayEvent(key: OverlayKey, { onOpen, onClose }: OverlayEvent) {
  const isOpen = useAtomValue(openAtomFamily(key));
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
