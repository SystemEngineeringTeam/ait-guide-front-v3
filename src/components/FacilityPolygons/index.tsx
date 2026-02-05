'use client';

import { GeoJSONData } from '@/types/facilities';
import { Layer, Source } from 'react-map-gl/maplibre';
import { darkenColor, getFeaturesColor } from '@/utils/color';
import { DEFAULT_COLOR } from '@/consts/colors';
import type { FeatureCollection } from 'geojson';
import { useMemo } from 'react';

interface Props {
  facilities: GeoJSONData[];
}

export default function FacilityPolygons({ facilities }: Props) {
  const sorted = [...facilities].sort((a, b) => {
    if (a.type !== 'passage' && b.type === 'passage') return 1;
    if (a.type === 'passage' && b.type !== 'passage') return -1;
    return 0;
  });

  const data = useMemo(
    () =>
      ({
        type: 'FeatureCollection',
        features: sorted.flatMap((facility) => {
          const color = getFeaturesColor(facility) ?? DEFAULT_COLOR;
          const darkerColor = darkenColor(color, 0.1);

          return facility.data.features.map((f) => ({
            ...f,
            properties: {
              ...f.properties,
              fill: color,
              line: darkerColor,
            },
          }));
        }),
      }) satisfies FeatureCollection,
    [sorted],
  );

  return (
    <Source type="geojson" data={data}>
      <Layer
        type="fill-extrusion"
        paint={{
          'fill-extrusion-color': ['get', 'fill'],
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.8,
        }}
      />
      <Layer
        type="line"
        paint={{
          'line-color': ['get', 'line'],
          'line-width': 2,
        }}
      />
    </Source>
  );
}
