import { useState } from 'react';
import styles from './index.module.scss';
import { RoadPoint, Road, PointType, RouteOptions } from '@/hooks/useRoadBuilder';
import { POINT_TYPE_COLORS, POINT_TYPE_LABELS } from '../RoadMarkerPoints/index';

interface RoadPanelProps {
  points: RoadPoint[];
  roads: Road[];
  dataMode: 'points' | 'roads';
  pointAddMode: PointType;
  onChangeDataMode: (mode: 'points' | 'roads') => void;
  onChangePointAddMode: (mode: PointType) => void;
  onCopyPoints: () => Promise<void>;
  onPastePoints: () => Promise<void>;
  onCopyRoads: () => Promise<void>;
  onPasteRoads: () => Promise<void>;
  onClear: () => void;
}

export default function RoadPanel({
  points,
  roads,
  dataMode,
  pointAddMode,
  onChangeDataMode,
  onChangePointAddMode,
  onCopyPoints,
  onPastePoints,
  onCopyRoads,
  onPasteRoads,
  onClear,
}: RoadPanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`${styles.panel} ${isOpen ? styles.open : styles.closed}`}>
      <div className={styles.header}>
        <button className={styles.toggleButton} onClick={() => setIsOpen(!isOpen)} aria-label="パネルを切り替え">
          <span className={styles.title}>経路ビルダー</span>
          <span>{isOpen ? '▼' : '▲'}</span>
        </button>
      </div>

      {isOpen && (
        <div className={styles.content}>
          {/* データモード切り替え */}
          <div className={styles.modeSelector}>
            <button
              type="button"
              className={`${styles.modeButton} ${dataMode === 'points' ? styles.active : ''}`}
              onClick={() => onChangeDataMode('points')}
            >
              📍 ポイント
            </button>
            <button
              type="button"
              className={`${styles.modeButton} ${dataMode === 'roads' ? styles.active : ''}`}
              onClick={() => onChangeDataMode('roads')}
            >
              🛣️ 経路
            </button>
          </div>

          {/* ポイント表示 */}
          {dataMode === 'points' && (
            <div className={styles.section}>
              {/* ポイント種類選択 */}
              <div className={styles.pointTypeSelector}>
                <h4>追加するポイント種類</h4>
                <div className={styles.typeButtonsRow}>
                  {(['facility', 'entrance', 'point'] as PointType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`${styles.typeButton} ${pointAddMode === type ? styles.active : ''}`}
                      style={{
                        borderColor: POINT_TYPE_COLORS[type],
                        backgroundColor: pointAddMode === type ? POINT_TYPE_COLORS[type] : 'white',
                        color: pointAddMode === type ? 'white' : POINT_TYPE_COLORS[type],
                      }}
                      onClick={() => onChangePointAddMode(type)}
                    >
                      {POINT_TYPE_LABELS[type]}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.info}>
                <p className={styles.count}>
                  ポイント: <strong>{points.length}</strong> 個
                </p>
                <p className={styles.hint}>マップを右クリックしてポイントを追加してください</p>
                <p className={styles.hint}>ポイントをクリックでタイプ変更や削除が可能です</p>
              </div>

              <div className={styles.actions}>
                <button className={styles.exportButton} onClick={onCopyPoints} disabled={points.length === 0}>
                  📋 コピー
                </button>
                <button className={styles.importButton} onClick={onPastePoints} disabled={points.length !== 0}>
                  📥 貼り付け
                </button>
              </div>
            </div>
          )}

          {/* 経路表示 */}
          {dataMode === 'roads' && (
            <div className={styles.section}>
              <div className={styles.info}>
                <p className={styles.count}>
                  経路: <strong>{roads.length}</strong> 個
                </p>
                <p className={styles.hint}>
                  {points.length === 0
                    ? 'ポイント数: 0 (まずポイントを追加してください)'
                    : `ポイント数: ${points.length}`}
                </p>
                <p className={styles.hint}>ポイントをクリックして経路を作成してください</p>
              </div>

              <div className={styles.actions}>
                <button className={styles.exportButton} onClick={onCopyRoads} disabled={roads.length === 0}>
                  📋 コピー
                </button>
                <button className={styles.importButton} onClick={onPasteRoads} disabled={roads.length !== 0}>
                  📥 貼り付け
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
