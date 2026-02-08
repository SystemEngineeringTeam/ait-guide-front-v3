import styles from './index.module.scss';
import { Coord } from '@/types/coord';
import { LineString, type FeatureCollection } from 'geojson';
import { useCallback, useMemo } from 'react';
import { Layer, Source, Marker, type MarkerDragEvent } from 'react-map-gl/maplibre';
import { useSetStartCoord, useStartCoord } from '@/hooks/useRoute';

interface Props {
  route: Coord[] | undefined;
}

export default function RouteLine({ route }: Props) {
  const updateStartCoord = useSetStartCoord();
  const startCoord = useStartCoord();

  const data = useMemo(
    () =>
      ({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: route ?? [],
            },
          },
        ],
      }) satisfies FeatureCollection<LineString>,
    [route],
  );

  const endPoint = useMemo(() => {
    if (!route || route.length === 0) return undefined;
    return route[route.length - 1];
  }, [route]);

  const startPoint = useMemo(() => {
    if (!route || route.length === 0) return undefined;
    // startCoord が設定されていれば使用、なければ route の最初の点
    return startCoord || route[0];
  }, [route, startCoord]);

  const handleDragStart = useCallback((e: MarkerDragEvent) => {
    const originalEvent = (e as { originalEvent?: { stopPropagation?: () => void } }).originalEvent;
    originalEvent?.stopPropagation?.();
  }, []);

  const handleDragEnd = useCallback(
    (e: MarkerDragEvent) => {
      updateStartCoord([e.lngLat.lng, e.lngLat.lat]);
    },
    [updateStartCoord],
  );

  if (!route) return null;

  return (
    <>
      <Source type="geojson" data={data}>
        <Layer
          type="line"
          paint={{
            'line-color': '#007bff',
            'line-width': 2,
          }}
        />
      </Source>

      {startPoint && (
        <Marker
          longitude={startPoint[0]}
          latitude={startPoint[1]}
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className={styles.start} />
        </Marker>
      )}

      {endPoint && (
        <Marker longitude={endPoint[0]} latitude={endPoint[1]}>
          <div className={styles.end} />
        </Marker>
      )}
    </>
  );
}
