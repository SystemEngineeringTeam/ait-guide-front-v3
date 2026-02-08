import { Coord } from '@/types/coord';
import { LineString, Point, type FeatureCollection } from 'geojson';
import { useMemo } from 'react';
import { Layer, Source } from 'react-map-gl/maplibre';

interface Props {
  route: Coord[] | undefined;
}

export default function RouteLine({ route }: Props) {
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

  const points = useMemo(() => {
    if (!route || route.length === 0) return undefined;

    const start = route[0];
    const end = route[route.length - 1];

    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { kind: 'start' },
          geometry: {
            type: 'Point',
            coordinates: start,
          },
        },
        {
          type: 'Feature',
          properties: { kind: 'end' },
          geometry: {
            type: 'Point',
            coordinates: end,
          },
        },
      ],
    } satisfies FeatureCollection<Point>;
  }, [route]);

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

      {points && (
        <Source type="geojson" data={points}>
          <Layer
            type="circle"
            filter={['==', ['get', 'kind'], 'start']}
            paint={{
              'circle-radius': 6,
              'circle-color': '#ffffff',
              'circle-stroke-color': '#007bff',
              'circle-stroke-width': 2,
            }}
          />
          <Layer
            type="circle"
            filter={['==', ['get', 'kind'], 'end']}
            paint={{
              'circle-radius': 6,
              'circle-color': '#007bff',
            }}
          />
        </Source>
      )}
    </>
  );
}
