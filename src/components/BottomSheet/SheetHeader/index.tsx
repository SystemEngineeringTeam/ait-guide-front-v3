import { useCallback } from 'react';
import styles from './index.module.scss';

interface Props {
  up: boolean;
  onClick?: (up: boolean) => void;
}

export default function SheetHeader({ up, onClick }: Props) {
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(up);
    }
  }, [onClick, up]);

  return (
    <div className={styles.header} onClick={handleClick}>
      <svg className={styles.arrow} viewBox="0 0 24 24" aria-hidden="true" data-up={up}>
        <path d="M6 15l6-6 6 6" />
      </svg>
    </div>
  );
}
