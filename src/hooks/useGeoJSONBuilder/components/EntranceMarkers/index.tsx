import { Marker, Popup } from 'react-map-gl/maplibre';
import { Entrance } from '@/hooks/useGeoJSONBuilder';
import { useCallback, useMemo } from 'react';
import { Source, Layer } from 'react-map-gl/maplibre';
import type { MarkerDragEvent } from 'react-map-gl/maplibre';
import styles from './index.module.scss';
import { generateEntranceLines } from '@/utils/entrance';

interface EntranceMarkersProps {
  entrances: Entrance[];
  selectedEntranceId: string | null;
  onSelectEntrance: (id: string | null) => void;
  onRemoveEntrance: (id: string) => void;
  onUpdateEntrance: (id: string, updates: Partial<Omit<Entrance, 'id' | 'timestamp'>>) => void;
}

export default function EntranceMarkers({
  entrances,
  selectedEntranceId,
  onSelectEntrance,
  onRemoveEntrance,
  onUpdateEntrance,
}: EntranceMarkersProps) {
  const handleClick = useCallback(
    (entranceId: string) => (e: { originalEvent: MouseEvent }) => {
      e.originalEvent.stopPropagation();
      onSelectEntrance(entranceId);
    },
    [onSelectEntrance],
  );

  const handleDragStart = useCallback((e: MarkerDragEvent) => {
    const originalEvent = (e as { originalEvent?: { stopPropagation?: () => void } }).originalEvent;
    originalEvent?.stopPropagation?.();
  }, []);

  const handleDragEnd = useCallback(
    (entranceId: string) => (e: MarkerDragEvent) => {
      onUpdateEntrance(entranceId, {
        longitude: e.lngLat.lng,
        latitude: e.lngLat.lat,
      });
    },
    [onUpdateEntrance],
  );

  // 各出入り口に対して2本の平行線を生成
  const entranceLinesGeoJSON = useMemo(() => {
    const features = entrances.flatMap((entrance) => {
      return generateEntranceLines(
        entrance,
        1, // 線の長さ（メートル）
      );
    });

    return {
      type: 'FeatureCollection' as const,
      features,
    };
  }, [entrances]);

  return (
    <>
      {/* 出入り口の線を描画 */}
      {entrances.length > 0 && (
        <Source type="geojson" data={entranceLinesGeoJSON}>
          <Layer
            type="line"
            paint={{
              'line-color': '#000000',
              'line-width': 3,
            }}
          />
        </Source>
      )}

      {/* 中心点マーカー */}
      {entrances.map((entrance) => (
        <Marker
          key={entrance.id}
          longitude={entrance.longitude}
          latitude={entrance.latitude}
          draggable
          onClick={handleClick(entrance.id)}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd(entrance.id)}
        >
          <div className={styles.marker} />
          {selectedEntranceId === entrance.id && (
            <Popup
              longitude={entrance.longitude}
              latitude={entrance.latitude}
              closeButton={true}
              onClose={() => onSelectEntrance(null)}
              offset={[0, -50]}
            >
              <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
                <p className={styles.coordinates}>
                  {entrance.latitude.toFixed(6)}, {entrance.longitude.toFixed(6)}
                </p>
                <div className={styles.controls}>
                  <label>
                    回転角度: {entrance.rotation}°
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={entrance.rotation}
                      onChange={(e) => onUpdateEntrance(entrance.id, { rotation: Number(e.target.value) })}
                    />
                  </label>
                  <label>
                    幅: {entrance.width.toFixed(1)}m
                    <input
                      type="range"
                      min="2"
                      max="20"
                      step="2"
                      value={entrance.width}
                      onChange={(e) => onUpdateEntrance(entrance.id, { width: Number(e.target.value) })}
                    />
                  </label>
                </div>
                <button
                  className={styles.deleteButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveEntrance(entrance.id);
                    onSelectEntrance(null);
                  }}
                >
                  削除
                </button>
              </div>
            </Popup>
          )}
        </Marker>
      ))}
    </>
  );
}
