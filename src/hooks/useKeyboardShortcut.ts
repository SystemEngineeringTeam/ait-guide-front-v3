import { useEffect } from 'react';

interface UseKeyboardShortcutProps {
  onSearch?: () => void;
  onMap?: () => void;
  onHelp?: () => void;
  onEscape?: () => void;
  onReset?: () => void;
  onClear?: () => void;
  onFlyToLocation?: () => void;
  onFlyToUniversity?: () => void;
  onRouteSearch?: () => void;
}

export function useKeyboardShortcut({
  onSearch,
  onMap,
  onHelp,
  onEscape,
  onReset,
  onClear,
  onFlyToLocation,
  onFlyToUniversity,
  onRouteSearch,
}: UseKeyboardShortcutProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      //  meta + s
      if (e.metaKey && e.key === 's') {
        e.preventDefault();
        onSearch?.();
      }

      // meta + m
      if (e.metaKey && e.key === 'm') {
        e.preventDefault();
        onMap?.();
      }

      // meta + h
      if (e.metaKey && e.key === 'h') {
        e.preventDefault();
        onHelp?.();
      }

      // meta + l
      if (e.metaKey && e.key === 'l') {
        e.preventDefault();
        onFlyToLocation?.();
      }

      // meta + u
      if (e.metaKey && e.key === 'u') {
        e.preventDefault();
        onFlyToUniversity?.();
      }

      // meta + p
      if (e.metaKey && e.key === 'p') {
        e.preventDefault();
        onRouteSearch?.();
      }

      // meta + c
      if (e.metaKey && e.key === 'c') {
        e.preventDefault();
        onClear?.();
      }

      // Escape
      if (e.key === 'Escape') {
        e.preventDefault();
        onEscape?.();
      }

      // r
      if (!e.metaKey && e.key === 'r') {
        e.preventDefault();
        onReset?.();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onSearch, onMap, onHelp, onEscape, onReset, onFlyToUniversity, onRouteSearch, onClear]);
}
