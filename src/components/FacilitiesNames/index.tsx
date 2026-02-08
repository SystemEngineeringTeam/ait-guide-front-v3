'use client';

import { GeoJSONFacilities } from '@/types/facilities';
import { Layer, Source } from 'react-map-gl/maplibre';
import type { Feature, FeatureCollection, Point, Polygon, MultiPolygon } from 'geojson';

interface Props {
  facilities: GeoJSONFacilities[];
}

export default function FacilityNames({ facilities }: Props) {
  const createLabelPoint = (ring: number[][]): Feature<Point> => {
    const count = ring.length || 1;
    const [sumLng, sumLat] = ring.reduce(
      (acc, coord) => [acc[0] + coord[0], acc[1] + coord[1]],
      [0, 0],
    );

    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [sumLng / count, sumLat / count],
      },
      properties: {},
    };
  };

  const data: FeatureCollection = {
    type: 'FeatureCollection',
    features: facilities.flatMap((facility) => {
      const feature = facility.data.features[0];
      if (!feature || !feature.geometry) return [];

      const polygonDivision = facility.polygonDivision ?? 1;
      const labelFeatures: Feature<Point>[] = [];

      if (feature.geometry.type === 'Polygon') {
        const polygon = feature as Feature<Polygon>;
        const ring = polygon.geometry.coordinates[0];
        if (ring) labelFeatures.push(createLabelPoint(ring));
      }

      if (feature.geometry.type === 'MultiPolygon') {
        const multiPolygon = feature as Feature<MultiPolygon>;
        const polygons = multiPolygon.geometry.coordinates.slice(0, polygonDivision);
        polygons.forEach((polygon) => {
          const ring = polygon?.[0];
          if (ring) labelFeatures.push(createLabelPoint(ring));
        });
      }

      return labelFeatures.map((labelFeature) => ({
        ...labelFeature,
        properties: {
          ...labelFeature.properties,
          label: facility.name,
        },
      }));
    }),
  };

  return (
    <Source type="geojson" data={data}>
      <Layer
        type="symbol"
        layout={{
          'text-field': ['get', 'label'],
          'text-size': 14,
          'text-offset': [0, 0],
          'text-anchor': 'center',
        }}
        paint={{
          'text-color': '#000000',
          'text-halo-color': '#ffffff',
          'text-halo-width': 2,
        }}
      />
    </Source>
  );
}
