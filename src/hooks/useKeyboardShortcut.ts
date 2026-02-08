import { isExactKey } from '@/utils/key';
import { useEffect } from 'react';

interface UseKeyboardShortcutProps {
  onSearch?: () => void;
  onMap?: () => void;
  onHelp?: () => void;
  onEscape?: () => void;
  onReset?: () => void;
  onOpenBottomSheet?: () => void;
  onClear?: () => void;
  onFlyToLocation?: () => void;
  onFlyToUniversity?: () => void;
  onRouteSearch?: () => void;
  onSelectFloor?: (floorName: string) => boolean | void;
}

export function useKeyboardShortcut({
  onSearch,
  onMap,
  onHelp,
  onEscape,
  onReset,
  onOpenBottomSheet,
  onClear,
  onFlyToLocation,
  onFlyToUniversity,
  onRouteSearch,
  onSelectFloor,
}: UseKeyboardShortcutProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      //  meta + s
      if (isExactKey(e, { key: 's', meta: true })) {
        e.preventDefault();
        onSearch?.();
      }

      // meta + m
      if (isExactKey(e, { key: 'm', meta: true })) {
        e.preventDefault();
        onMap?.();
      }

      // meta + h
      if (isExactKey(e, { key: 'h', meta: true })) {
        e.preventDefault();
        onHelp?.();
      }

      // meta + l
      if (isExactKey(e, { key: 'l', meta: true })) {
        e.preventDefault();
        onFlyToLocation?.();
      }

      // meta + u
      if (isExactKey(e, { key: 'u', meta: true })) {
        e.preventDefault();
        onFlyToUniversity?.();
      }

      // meta + p
      if (isExactKey(e, { key: 'p', meta: true })) {
        e.preventDefault();
        onRouteSearch?.();
      }

      // meta + c
      if (isExactKey(e, { key: 'c', meta: true })) {
        e.preventDefault();
        onClear?.();
      }

      // meta + o
      if (isExactKey(e, { key: 'o', meta: true })) {
        e.preventDefault();
        onOpenBottomSheet?.();
      }

      // Escape
      if (isExactKey(e, { key: 'Escape' })) {
        e.preventDefault();
        onEscape?.();
      }

      // r
      if (isExactKey(e, { key: 'r' })) {
        e.preventDefault();
        onReset?.();
      }

      if (!e.metaKey && !e.ctrlKey && onSelectFloor) {
        const digitMatch = /^Digit([1-9])$/.exec(e.code);
        if (digitMatch) {
          const digit = digitMatch[1];
          if (e.shiftKey && !e.altKey) {
            if (onSelectFloor(`B${digit}`)) e.preventDefault();
          } else if (e.altKey && !e.shiftKey) {
            if (onSelectFloor(`M${digit}`)) e.preventDefault();
          } else if (!e.shiftKey && !e.altKey) {
            if (onSelectFloor(digit)) e.preventDefault();
          }
        }

        if (!e.shiftKey && !e.altKey && e.code === 'Digit0') {
          if (onSelectFloor('R')) e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [
    onSearch,
    onMap,
    onHelp,
    onEscape,
    onReset,
    onOpenBottomSheet,
    onFlyToUniversity,
    onRouteSearch,
    onClear,
    onSelectFloor,
  ]);
}
