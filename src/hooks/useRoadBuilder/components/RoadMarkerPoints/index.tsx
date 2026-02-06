import { Marker, MarkerDragEvent, Popup } from 'react-map-gl/maplibre';
import { RoadPoint, PointType, Road } from '@/hooks/useRoadBuilder';
import { useCallback, useState } from 'react';
import styles from './index.module.scss';

interface RoadMarkerPointsProps {
  points: RoadPoint[];
  roads: Road[];
  selectedPointId: string | null;
  selectedForRoad: string | null;
  dataMode: 'points' | 'roads';
  onSelectPoint: (id: string | null) => void;
  onRemovePoint: (id: string) => void;
  onUpdatePoint: (id: string, lng: number, lat: number) => void;
  onUpdatePointName: (id: string, name: string) => void;
  onChangePointType: (id: string, type: PointType) => void;
}

const POINT_TYPE_COLORS: Record<PointType, string> = {
  facility: '#FF6B6B',
  entrance: '#4ECDC4',
  point: '#45B7D1',
};

const POINT_TYPE_LABELS: Record<PointType, string> = {
  facility: '施設',
  entrance: '出入口',
  point: 'ポイント',
};

export { POINT_TYPE_COLORS, POINT_TYPE_LABELS };

export default function RoadMarkerPoints({
  points,
  roads,
  selectedPointId,
  selectedForRoad,
  dataMode,
  onSelectPoint,
  onRemovePoint,
  onUpdatePoint,
  onUpdatePointName,
  onChangePointType,
}: RoadMarkerPointsProps) {
  const [hoveredPointId, setHoveredPointId] = useState<string | null>(null);

  const handleClick = useCallback(
    (pointId: string) => (e: { originalEvent: MouseEvent }) => {
      e.originalEvent.stopPropagation();
      onSelectPoint(pointId);
    },
    [onSelectPoint],
  );

  const handleDragStart = useCallback((e: MarkerDragEvent) => {
    const originalEvent = (e as { originalEvent?: { stopPropagation?: () => void } }).originalEvent;
    originalEvent?.stopPropagation?.();
  }, []);

  const handleDragEnd = useCallback(
    (pointId: string) => (e: MarkerDragEvent) => {
      onUpdatePoint(pointId, e.lngLat.lng, e.lngLat.lat);
    },
    [onUpdatePoint],
  );

  const getConnectedRoadCount = (pointId: string) => {
    return roads.filter((road) => road.pointIds.includes(pointId)).length;
  };

  return (
    <>
      {points.map((point, index) => {
        const isSelectedForRoad = point.id === selectedForRoad;

        return (
          <Marker
            key={point.id}
            longitude={point.lng}
            latitude={point.lat}
            draggable={true}
            onClick={handleClick(point.id)}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd(point.id)}
          >
            <div
              className={styles.marker}
              style={{
                backgroundColor: POINT_TYPE_COLORS[point.type],
                border: isSelectedForRoad
                  ? '4px solid #FFD700'
                  : selectedPointId === point.id
                    ? '3px solid #000'
                    : '2px solid #fff',
              }}
              title={POINT_TYPE_LABELS[point.type]}
              onMouseEnter={() => setHoveredPointId(point.id)}
              onMouseLeave={() => setHoveredPointId(null)}
            />

            {/* Popup when point is selected in points mode */}
            {selectedPointId === point.id && dataMode === 'points' && (
              <Popup
                longitude={point.lng}
                latitude={point.lat}
                closeButton={true}
                onClose={() => onSelectPoint(null)}
                offset={[0, -10]}
                className={styles.popup}
              >
                <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.coordinates}>
                    {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
                  </div>

                  <div className={styles.section}>
                    <label className={styles.label}>タイプ:</label>
                    <div className={styles.typeButtons}>
                      {(['facility', 'entrance', 'point'] as PointType[]).map((type) => (
                        <button
                          key={type}
                          className={`${styles.typeButton} ${point.type === type ? styles.active : ''}`}
                          style={point.type === type ? { backgroundColor: POINT_TYPE_COLORS[type] } : {}}
                          onClick={(e) => {
                            e.stopPropagation();
                            onChangePointType(point.id, type);
                          }}
                        >
                          {POINT_TYPE_LABELS[type]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {point.type === 'facility' && (
                    <div className={styles.section}>
                      <label className={styles.label}>施設名:</label>
                      <input
                        className={styles.nameInput}
                        type="text"
                        value={point.name ?? ''}
                        placeholder="施設名"
                        onChange={(e) => onUpdatePointName(point.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  )}

                  <div className={styles.section}>
                    <span className={styles.info}>
                      接続経路: {getConnectedRoadCount(point.id)}
                    </span>
                  </div>

                  <button
                    className={styles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemovePoint(point.id);
                      onSelectPoint(null);
                    }}
                  >
                    削除
                  </button>
                </div>
              </Popup>
            )}

            {hoveredPointId === point.id && selectedPointId !== point.id && (
              <Popup
                longitude={point.lng}
                latitude={point.lat}
                closeButton={false}
                offset={[0, -10]}
                className={styles.hoverPopup}
              >
                <div className={styles.hoverContent}>
                  {POINT_TYPE_LABELS[point.type]} #{index + 1}
                </div>
              </Popup>
            )}
          </Marker>
        );
      })}
    </>
  );
}
