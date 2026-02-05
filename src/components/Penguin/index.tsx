'use client';

import styles from './index.module.scss';
import { usePenguin } from '@/hooks/usePenguin';
import { useCallback } from 'react';

export default function Penguin() {
  const [active, setActive] = usePenguin();

  const handleClick = useCallback(() => {
    setActive(false);
  }, [setActive]);

  return (
    <div className={styles.penguin} data-active={active} onClick={handleClick}>
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
