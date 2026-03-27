'use client';

import { useState } from 'react';
import styles from './index.module.scss';

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function Panel({ title, children }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <button className={styles.toggleButton} onClick={() => setIsOpen(!isOpen)} aria-label="パネルを切り替え">
          <span className={styles.title}>{title}</span>
          <span>{isOpen ? '▼' : '▲'}</span>
        </button>
      </div>

      {isOpen && <div className={styles.content}>{children}</div>}
    </div>
  );
}
