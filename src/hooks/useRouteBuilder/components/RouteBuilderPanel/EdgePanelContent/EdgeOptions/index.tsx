'use client';

import AutoReflectOption from './AutoReflectOption';
import styles from './index.module.scss';
import type { RouteAutoReflectOptions, RouteEdge, RouteEdgeOptionsKey } from '@/hooks/useRouteBuilder/types/route';

interface Props {
  autoReflect: boolean;
  handleChangeAutoReflect: (reflect: boolean) => void;

  autoReflectOptions: RouteAutoReflectOptions;
  handleChangeAutoReflectOptions: (key: RouteEdgeOptionsKey, value: boolean) => void;

  level: RouteEdge['level'];
  hasStairs: RouteEdge['hasStairs'];
  isAccessible: RouteEdge['isAccessible'];
  isIndoor: RouteEdge['isIndoor'];

  handleChangeLevel: (level: RouteEdge['level']) => void;
  handleChangeHasStairs: (hasStairs: RouteEdge['hasStairs']) => void;
  handleChangeIsAccessible: (isAccessible: RouteEdge['isAccessible']) => void;
  handleChangeIsIndoor: (isIndoor: RouteEdge['isIndoor']) => void;
}

export default function EdgeOptions({
  autoReflect,
  handleChangeAutoReflect,

  autoReflectOptions,
  handleChangeAutoReflectOptions,

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
      <div>
        <div className={styles.item}>
          <input
            type="checkbox"
            id="reflect"
            checked={autoReflect}
            onChange={(e) => handleChangeAutoReflect(e.target.checked)}
          />
          <label htmlFor="reflect">✨ 選択して反映</label>
        </div>
      </div>

      <h3 className={styles.title}>デフォルトオプション</h3>

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
        <AutoReflectOption
          isEnabled={autoReflect}
          optionKey="level"
          handleChange={handleChangeAutoReflectOptions}
          selected={autoReflectOptions.level}
        />
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
          <AutoReflectOption
            isEnabled={autoReflect}
            optionKey="hasStairs"
            handleChange={handleChangeAutoReflectOptions}
            selected={autoReflectOptions.hasStairs}
          />
        </div>

        <div className={styles.item}>
          <input
            type="checkbox"
            id="accessible"
            checked={isAccessible}
            onChange={(e) => handleChangeIsAccessible(e.target.checked)}
          />
          <label htmlFor="accessible">👩‍🦽 バリアフリー❌</label>
          <AutoReflectOption
            isEnabled={autoReflect}
            optionKey="isAccessible"
            handleChange={handleChangeAutoReflectOptions}
            selected={autoReflectOptions.isAccessible}
          />
        </div>

        <div className={styles.item}>
          <input
            type="checkbox"
            id="indoor"
            checked={isIndoor}
            onChange={(e) => handleChangeIsIndoor(e.target.checked)}
          />
          <label htmlFor="indoor">🏠 屋内</label>
          <AutoReflectOption
            isEnabled={autoReflect}
            optionKey="isIndoor"
            handleChange={handleChangeAutoReflectOptions}
            selected={autoReflectOptions.isIndoor}
          />
        </div>
      </div>
    </div>
  );
}
