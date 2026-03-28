'use client';

import styles from './index.module.scss';
import type { RouteEdge } from '@/hooks/useRouteBuilder/types/route';

interface Props {
  title: string;

  level: RouteEdge['level'];
  hasStairs: RouteEdge['hasStairs'];
  isAccessible: RouteEdge['isAccessible'];
  isIndoor: RouteEdge['isIndoor'];

  handleChangeLevel: (level: RouteEdge['level']) => void;
  handleChangeHasStairs: (hasStairs: RouteEdge['hasStairs']) => void;
  handleChangeIsAccessible: (isAccessible: RouteEdge['isAccessible']) => void;
  handleChangeIsIndoor: (isIndoor: RouteEdge['isIndoor']) => void;
}

export default function SelectedEdge({
  title,
  level,
  hasStairs,
  isAccessible,
  isIndoor,
  handleChangeLevel,
  handleChangeHasStairs,
  handleChangeIsAccessible,
  handleChangeIsIndoor,
}: Props) {
  return (
    <div className={styles.content}>
      <h3 className={styles.title}>{title}</h3>

      <div className={styles.labelbox}>
        <span>主要</span>
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={level}
          onChange={(e) => handleChangeLevel(Number(e.target.value) as RouteEdge['level'])}
        />
        <span>裏道</span>
      </div>

      <div className={styles.options}>
        <div className={styles.item}>
          <input
            type="checkbox"
            id="stairs"
            checked={hasStairs}
            onChange={(e) => handleChangeHasStairs(e.target.checked)}
          />
          <label htmlFor="stairs">🪜 階段</label>
        </div>

        <div className={styles.item}>
          <input
            type="checkbox"
            id="accessible"
            checked={isAccessible}
            onChange={(e) => handleChangeIsAccessible(e.target.checked)}
          />
          <label htmlFor="accessible">👩‍🦽 バリアフリー</label>
        </div>

        <div className={styles.item}>
          <input
            type="checkbox"
            id="indoor"
            checked={isIndoor}
            onChange={(e) => handleChangeIsIndoor(e.target.checked)}
          />
          <label htmlFor="indoor">🏠 屋内</label>
        </div>
      </div>
    </div>
  );
}
