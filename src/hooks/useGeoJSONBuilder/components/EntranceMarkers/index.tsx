import { Marker, Popup } from 'react-map-gl/maplibre';
import { Entrance } from '@/hooks/useGeoJSONBuilder';
import { useCallback, useMemo } from 'react';
import { Source, Layer } from 'react-map-gl/maplibre';
import type { MarkerDragEvent } from 'react-map-gl/maplibre';
import styles from './index.module.scss';

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
      const { longitude, latitude, rotation, width } = entrance;
      
      // 回転角度をラジアンに変換
      const angleRad = (rotation * Math.PI) / 180;
      
      // 壁に垂直な方向（線の方向）
      const perpX = Math.cos(angleRad);
      const perpY = Math.sin(angleRad);
      
      // 幅方向（線と垂直な方向）
      const widthX = -Math.sin(angleRad);
      const widthY = Math.cos(angleRad);
      
      // 線の長さ（メートル単位で0.5m）
      const lineLength = 0.5;
      
      // 緯度経度での近似的なオフセット（小さなスケールなので簡易計算）
      const metersToLng = 1 / (111320 * Math.cos((latitude * Math.PI) / 180));
      const metersToLat = 1 / 110540;
      
      // 幅の半分だけ左右にオフセット
      const halfWidth = width / 2;
      
      // 左側の線
      const line1Start = [
        longitude + (widthX * halfWidth - perpX * lineLength / 2) * metersToLng,
        latitude + (widthY * halfWidth - perpY * lineLength / 2) * metersToLat,
      ];
      const line1End = [
        longitude + (widthX * halfWidth + perpX * lineLength / 2) * metersToLng,
        latitude + (widthY * halfWidth + perpY * lineLength / 2) * metersToLat,
      ];
      
      // 右側の線
      const line2Start = [
        longitude + (-widthX * halfWidth - perpX * lineLength / 2) * metersToLng,
        latitude + (-widthY * halfWidth - perpY * lineLength / 2) * metersToLat,
      ];
      const line2End = [
        longitude + (-widthX * halfWidth + perpX * lineLength / 2) * metersToLng,
        latitude + (-widthY * halfWidth + perpY * lineLength / 2) * metersToLat,
      ];
      
      return [
        {
          type: 'Feature' as const,
          properties: { entranceId: entrance.id },
          geometry: {
            type: 'LineString' as const,
            coordinates: [line1Start, line1End],
          },
        },
        {
          type: 'Feature' as const,
          properties: { entranceId: entrance.id },
          geometry: {
            type: 'LineString' as const,
            coordinates: [line2Start, line2End],
          },
        },
      ];
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
        <Source id="entrance-lines" type="geojson" data={entranceLinesGeoJSON}>
          <Layer
            id="entrance-lines-layer"
            type="line"
            paint={{
              'line-color': '#ff0000',
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
              offset={[0, -10]}
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
                      min="0.5"
                      max="10"
                      step="0.5"
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
