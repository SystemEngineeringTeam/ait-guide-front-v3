import { Marker, MarkerDragEvent, Popup } from 'react-map-gl/maplibre';
import { BuildingPoint } from '@/hooks/useGeoJSONBuilder';
import { useCallback } from 'react';
import styles from './MarkerPoints.module.scss';

interface MarkerPointsProps {
  points: BuildingPoint[];
  selectedPointId: string | null;
  onSelectPoint: (id: string | null) => void;
  onRemovePoint: (id: string) => void;
  onUpdatePoint: (id: string, longitude: number, latitude: number) => void;
}

export default function MarkerPoints({
  points,
  selectedPointId,
  onSelectPoint,
  onRemovePoint,
  onUpdatePoint,
}: MarkerPointsProps) {
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

  return (
    <>
      {points.map((point) => (
        <Marker
          key={point.id}
          longitude={point.longitude}
          latitude={point.latitude}
          draggable
          onClick={handleClick(point.id)}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd(point.id)}
        >
          <div className={styles.marker} />
          {selectedPointId === point.id && (
            <Popup
              longitude={point.longitude}
              latitude={point.latitude}
              closeButton={true}
              onClose={() => onSelectPoint(null)}
              offset={[0, -10]}
            >
              <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
                <p className={styles.coordinates}>
                  {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}
                </p>
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
        </Marker>
      ))}
    </>
  );
}
