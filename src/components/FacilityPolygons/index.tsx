'use client';

import { GeoJSONData } from '@/types/facilities';
import { Layer, Source } from 'react-map-gl/maplibre';
import { darkenColor, getFeaturesColor } from '@/utils/color';
import { DEFAULT_COLOR } from '@/consts/colors';
import type { FeatureCollection } from 'geojson';
import { useMemo } from 'react';
import { FACILITY_POLYGON_FILL_LAYER_ID, FACILITY_POLYGON_LINE_LAYER_ID } from '@/consts/layerId';

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
              facilityId: facility.id,
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
        id={FACILITY_POLYGON_FILL_LAYER_ID}
        type="fill-extrusion"
        paint={{
          'fill-extrusion-color': ['get', 'fill'],
          'fill-extrusion-height': ['coalesce', ['get', 'height'], 0],
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.8,
        }}
      />
      <Layer
        id={FACILITY_POLYGON_LINE_LAYER_ID}
        type="line"
        paint={{
          'line-color': ['get', 'line'],
          'line-width': 2,
        }}
      />
    </Source>
  );
}
