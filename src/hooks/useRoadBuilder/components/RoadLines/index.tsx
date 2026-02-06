import { useMemo } from 'react';
import { LineString, type FeatureCollection } from 'geojson';
import { Layer, Source } from 'react-map-gl/maplibre';
import { RoadPoint, Road } from '@/hooks/useRoadBuilder';

interface RoadLinesProps {
  points: RoadPoint[];
  roads: Road[];
}

export default function RoadLines({ points, roads }: RoadLinesProps) {
  const data = useMemo<FeatureCollection<LineString>>(() => {
    const features = roads
      .map((road) => {
        const roadPoints = road.pointIds
          .map((pointId) => points.find((p) => p.id === pointId))
          .filter((p): p is RoadPoint => p !== undefined);

        if (roadPoints.length < 2) {
          return null;
        }

        return {
          type: 'Feature' as const,
          properties: {
            id: road.id,
            mainRoute: road.options.mainRoute || false,
          },
          geometry: {
            type: 'LineString' as const,
            coordinates: roadPoints.map((p) => [p.lng, p.lat]) as [number, number][],
          },
        };
      })
      .filter((f) => f !== null);

    return {
      type: 'FeatureCollection' as const,
      features: features as any[],
    };
  }, [points, roads]);

  if (roads.length === 0 || data.features.length === 0) {
    return null;
  }

  return (
    <Source type="geojson" data={data}>
      <Layer
        type="line"
        paint={{
          'line-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#FF6B6B', '#667eea'],
          'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 3, 2],
          'line-opacity': 0.8,
        }}
      />
    </Source>
  );
}
