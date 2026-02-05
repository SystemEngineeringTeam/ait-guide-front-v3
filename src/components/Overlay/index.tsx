'use client';

import styles from './index.module.scss';
import { useOverlay } from '@/hooks/useOverlay';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';

interface Props {
  children?: React.ReactNode;
}

export default function Overlay({ children }: Props) {
  const { isOpen, close } = useOverlay();

  useKeyboardShortcut({
    onEscape: () => close(),
  });

  return (
    <div className={styles.overlay} data-open={isOpen}>
      {children}
    </div>
  );
}
