'use client';

import styles from './index.module.scss';
import type { RouteEdge } from '@/hooks/useRouteBuilder/types/route';
import { useEdgesSetter } from '../../../../hooks/useEdges';

interface Props {
  edge: RouteEdge;
}

export default function SelectedEdge({ edge }: Props) {
  const { changeEdgeLevel, changeEdgeHasStairs, changeEdgeIsAccessible, changeEdgeIsIndoor } = useEdgesSetter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const level = Number(e.target.value) as RouteEdge['level'];
    changeEdgeLevel(edge.uuid, level);
  };

  return (
    <div className={styles.content}>
      <div className={styles.labelbox}>
        <span>主要</span>
        <input
          className={styles.levelSelector}
          type="range"
          min="1"
          max="5"
          step="1"
          value={edge.level}
          onChange={handleChange}
        />
        <span>裏道</span>
      </div>

      <div className={styles.options}>
        <div className={styles.item}>
          <input
            type="checkbox"
            id="stairs"
            checked={edge.hasStairs}
            onChange={(e) => changeEdgeHasStairs(edge.uuid, e.target.checked)}
          />
          <label htmlFor="stairs">🪜 階段</label>
        </div>

        <div className={styles.item}>
          <input
            type="checkbox"
            id="accessible"
            checked={edge.isAccessible}
            onChange={(e) => changeEdgeIsAccessible(edge.uuid, e.target.checked)}
          />
          <label htmlFor="accessible">👩‍🦽 バリアフリー</label>
        </div>

        <div className={styles.item}>
          <input
            type="checkbox"
            id="indoor"
            checked={edge.isIndoor}
            onChange={(e) => changeEdgeIsIndoor(edge.uuid, e.target.checked)}
          />
          <label htmlFor="indoor">🏠 屋内</label>
        </div>
      </div>
    </div>
  );
}
