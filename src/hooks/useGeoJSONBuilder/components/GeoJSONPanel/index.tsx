import { BUILDING_FILL_COLORS, BuildingFillColor } from '@/consts/colors';
import styles from './index.module.scss';
import { BuildingPoint, Entrance, BuildMode } from '@/hooks/useGeoJSONBuilder';
import { useState } from 'react';

interface GeoJSONPanelProps {
  points: BuildingPoint[];
  entrances: Entrance[];
  buildMode: BuildMode;
  onChangeBuildMode: (mode: BuildMode) => void;
  onClear: () => void;
  onClearEntrances: () => void;
  onCopy: () => void;
  onPaste: () => Promise<void>;
  selectedColor: BuildingFillColor;
  onSelectColor: (color: BuildingFillColor) => void;
}

export default function GeoJSONPanel({ 
  points, 
  entrances,
  buildMode,
  onChangeBuildMode,
  onClear, 
  onClearEntrances,
  onCopy, 
  onPaste, 
  selectedColor, 
  onSelectColor 
}: GeoJSONPanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`${styles.panel} ${isOpen ? styles.open : styles.closed}`}>
      <div className={styles.header}>
        <h3>GeoJSON ビルダー</h3>
        <button className={styles.toggleButton} onClick={() => setIsOpen(!isOpen)} aria-label="パネルを切り替え">
          {isOpen ? '▼' : '▲'}
        </button>
      </div>

      {isOpen && (
        <div className={styles.content}>
          {/* モード切り替え */}
          <div className={styles.modeSelector}>
            <button
              type="button"
              className={`${styles.modeButton} ${buildMode === 'polygon' ? styles.active : ''}`}
              onClick={() => onChangeBuildMode('polygon')}
            >
              🏢 ポリゴン
            </button>
            <button
              type="button"
              className={`${styles.modeButton} ${buildMode === 'entrance' ? styles.active : ''}`}
              onClick={() => onChangeBuildMode('entrance')}
            >
              🚪 出入り口
            </button>
          </div>

          <div className={styles.info}>
            {buildMode === 'polygon' ? (
              <>
                <p className={styles.pointCount}>
                  マーカー: <strong>{points.length}</strong> 個
                </p>
                <p className={styles.hint}>マップを右クリックしてマーカーを追加してください</p>
                <p className={styles.hint}>3点以上で囲うと塗りつぶしが表示されます</p>
              </>
            ) : (
              <>
                <p className={styles.pointCount}>
                  出入り口: <strong>{entrances.length}</strong> 個
                </p>
                <p className={styles.hint}>マップを右クリックして出入り口を追加してください</p>
                <p className={styles.hint}>マーカーをクリックで回転角度と幅を調整できます</p>
              </>
            )}
          </div>

          {buildMode === 'polygon' && (
            <>
              <div className={styles.colorPicker}>
                <h4>塗りつぶし色</h4>
                <div className={styles.colorGrid}>
                  {BUILDING_FILL_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`${styles.colorSwatch} ${selectedColor === color ? styles.selected : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => onSelectColor(color)}
                      aria-label={`色 ${color}`}
                    />
                  ))}
                </div>
              </div>

              {points.length > 0 && (
                <div className={styles.pointsList}>
                  <h4>マーカー一覧</h4>
                  <div className={styles.scrollable}>
                    {points.map((point, index) => (
                      <div key={point.id} className={styles.pointItem}>
                        <span className={styles.index}>{index + 1}</span>
                        <span className={styles.coords}>
                          {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {buildMode === 'entrance' && entrances.length > 0 && (
            <div className={styles.pointsList}>
              <h4>出入り口一覧</h4>
              <div className={styles.scrollable}>
                {entrances.map((entrance, index) => (
                  <div key={entrance.id} className={styles.pointItem}>
                    <span className={styles.index}>{index + 1}</span>
                    <span className={styles.coords}>
                      {entrance.latitude.toFixed(6)}, {entrance.longitude.toFixed(6)}
                    </span>
                    <span className={styles.entranceInfo}>
                      {entrance.rotation}° / {entrance.width.toFixed(1)}m
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.actions}>
            {buildMode === 'polygon' ? (
              <>
                <button className={styles.exportButton} onClick={onCopy} disabled={points.length === 0}>
                  📋 GeoJSON をコピー
                </button>
                <button className={styles.importButton} onClick={onPaste} disabled={points.length > 0}>
                  📥 GeoJSON を貼り付け
                </button>
                <button className={styles.clearButton} onClick={onClear} disabled={points.length === 0}>
                  🗑️ クリア
                </button>
              </>
            ) : (
              <button className={styles.clearButton} onClick={onClearEntrances} disabled={entrances.length === 0}>
                🗑️ 出入り口をクリア
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
