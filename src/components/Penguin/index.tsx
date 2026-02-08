'use client';

import styles from './index.module.scss';
import { usePenguin } from '@/hooks/usePenguin';
import { useCallback } from 'react';

export default function Penguin() {
  const { isActive, isDeactivating, inactive } = usePenguin();

  const handleClick = useCallback(() => {
    inactive();
  }, [inactive]);

  return (
    <div className={styles.penguin} data-active={isActive} data-deactivating={isDeactivating} onClick={handleClick}>
      <p className={styles.message}>アデリーペンギン最高!!</p>
      <div className={styles.body}>
        <div className={styles.face}>
          <div className={styles.eyes} />
          <div className={styles.mouth} />
        </div>

        <div className={styles.wings} />
        <div className={styles.leg} />
      </div>
    </div>
  );
}
