import { Marker, Popup } from 'react-map-gl/maplibre';
import { BuildingPoint } from '@/hooks/useGeoJSONBuilder';
import { useState } from 'react';
import styles from './MarkerPoints.module.scss';

interface MarkerPointsProps {
  points: BuildingPoint[];
  onRemovePoint: (id: string) => void;
  onUpdatePoint: (id: string, longitude: number, latitude: number) => void;
}

export default function MarkerPoints({ points, onRemovePoint, onUpdatePoint }: MarkerPointsProps) {
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);

  return (
    <>
      {points.map((point) => (
        <Marker
          key={point.id}
          longitude={point.longitude}
          latitude={point.latitude}
          draggable
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setSelectedPointId(point.id);
          }}
          onDragStart={(e) => {
            const originalEvent = (e as { originalEvent?: { stopPropagation?: () => void } })
              .originalEvent;
            originalEvent?.stopPropagation?.();
            setSelectedPointId(null);
          }}
          onDragEnd={(e) => {
            onUpdatePoint(point.id, e.lngLat.lng, e.lngLat.lat);
            setSelectedPointId(null);
          }}
        >
          <div className={styles.marker} />
          {selectedPointId === point.id && (
            <Popup
              longitude={point.longitude}
              latitude={point.latitude}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setSelectedPointId(null)}
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
