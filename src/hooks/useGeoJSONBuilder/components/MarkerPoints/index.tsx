import { Marker, MarkerDragEvent, Popup } from 'react-map-gl/maplibre';
import { BuildingPoint } from '@/hooks/useGeoJSONBuilder';
import { useState, useRef, useCallback } from 'react';
import styles from './MarkerPoints.module.scss';

interface MarkerPointsProps {
  points: BuildingPoint[];
  onRemovePoint: (id: string) => void;
  onUpdatePoint: (id: string, longitude: number, latitude: number) => void;
}

export default function MarkerPoints({ points, onRemovePoint, onUpdatePoint }: MarkerPointsProps) {
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);

  const handleClick = useCallback(
    (pointId: string) => (e: { originalEvent: MouseEvent }) => {
      e.originalEvent.stopPropagation();
      setSelectedPointId(pointId);
    },
    [],
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
              closeOnClick={false}
              onClose={() => setSelectedPointId(null)}
              offset={[0, -10]}
            >
              <div className={styles.popup}>
                <p className={styles.coordinates}>
                  {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}
                </p>
                <button
                  className={styles.deleteButton}
                  onClick={() => {
                    onRemovePoint(point.id);
                    setSelectedPointId(null);
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
