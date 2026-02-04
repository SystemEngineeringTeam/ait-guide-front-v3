import { FACILITY_FILL_COLORS, FacilityFillColor } from '@/consts/colors';
import styles from './index.module.scss';
import { FacilityPoint, Entrance, FacilityMode } from '@/hooks/useGeoJSONBuilder';
import { useState } from 'react';

interface GeoJSONPanelProps {
  points: FacilityPoint[];
  entrances: Entrance[];
  facilityMode: FacilityMode;
  onChangeFacilityMode: (mode: FacilityMode) => void;
  onClear: () => void;
  onClearEntrances: () => void;
  onCopy: () => void;
  onPaste: () => Promise<void>;
  onCopyEntrances: () => void;
  onPasteEntrances: () => Promise<void>;
  selectedColor: FacilityFillColor;
  onSelectColor: (color: FacilityFillColor) => void;
}

export default function GeoJSONPanel({
  points,
  entrances,
  facilityMode,
  onChangeFacilityMode,
  onClear,
  onClearEntrances,
  onCopy,
  onPaste,
  onCopyEntrances,
  onPasteEntrances,
  selectedColor,
  onSelectColor,
}: GeoJSONPanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`${styles.panel} ${isOpen ? styles.open : styles.closed}`}>
      <div className={styles.header}>
        <button className={styles.toggleButton} onClick={() => setIsOpen(!isOpen)} aria-label="パネルを切り替え">
          <span className={styles.title}>GeoJSON ビルダー</span>
          <span>{isOpen ? '▼' : '▲'}</span>
        </button>
      </div>

      {isOpen && (
        <div className={styles.content}>
          {/* モード切り替え */}
          <div className={styles.modeSelector}>
            <button
              type="button"
              className={`${styles.modeButton} ${facilityMode === 'polygon' ? styles.active : ''}`}
              onClick={() => onChangeFacilityMode('polygon')}
            >
              🏢 ポリゴン
            </button>
            <button
              type="button"
              className={`${styles.modeButton} ${facilityMode === 'entrance' ? styles.active : ''}`}
              onClick={() => onChangeFacilityMode('entrance')}
            >
              🚪 出入り口
            </button>
          </div>

          <div className={styles.info}>
            {facilityMode === 'polygon' ? (
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

          {facilityMode === 'polygon' && (
            <>
              <div className={styles.colorPicker}>
                <h4>塗りつぶし色</h4>
                <div className={styles.colorGrid}>
                  {FACILITY_FILL_COLORS.map((color) => (
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

          {facilityMode === 'entrance' && entrances.length > 0 && (
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
            {facilityMode === 'polygon' ? (
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
              <>
                <button className={styles.exportButton} onClick={onCopyEntrances} disabled={entrances.length === 0}>
                  📋 出入り口をコピー
                </button>
                <button className={styles.importButton} onClick={onPasteEntrances} disabled={entrances.length > 0}>
                  📥 出入り口を貼り付け
                </button>
                <button className={styles.clearButton} onClick={onClearEntrances} disabled={entrances.length === 0}>
                  🗑️ 出入り口をクリア
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
