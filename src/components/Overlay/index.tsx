'use client';

import { useEffect } from 'react';
import styles from './index.module.scss';
import { useOverlay } from '@/hooks/useOverlay';

interface Props {
  children?: React.ReactNode;
}

export default function Overlay({ children }: Props) {
  const { isOpen, close } = useOverlay();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [close]);

  return (
    <div className={styles.overlay} data-open={isOpen}>
      {children}
    </div>
  );
}
