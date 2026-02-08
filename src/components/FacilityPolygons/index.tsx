'use client';

import { GeoJSONData } from '@/types/facilities';
import { Layer, Source } from 'react-map-gl/maplibre';
import { darkenColor, getFeaturesColor } from '@/utils/color';
import { DEFAULT_COLOR } from '@/consts/colors';
import type { FeatureCollection, MultiPolygon, Feature } from 'geojson';
import { useMemo } from 'react';
import { FACILITY_POLYGON_FILL_LAYER_ID, FACILITY_POLYGON_LINE_LAYER_ID } from '@/consts/layerId';
import { FacilityId } from '@/consts/facilityId';

interface Props {
  facilities: GeoJSONData[];
}

export default function FacilityPolygons({ facilities }: Props) {
  const data = useMemo(
    () =>
      ({
        type: 'FeatureCollection',
        features: facilities
          .flatMap((facility) => {
            const color = getFeaturesColor(facility) ?? DEFAULT_COLOR;
            const lineColor = darkenColor(color, 0.1);
            const firstFloorColor = darkenColor(color, 0.05);

            const firstFeature = facility.data.features.at(0);
            const isPassage = facility.type === 'passage';
            if (isPassage || firstFeature?.geometry.type !== 'MultiPolygon') {
              return [
                facility.data.features.map(
                  (f) =>
                    ({
                      ...f,
                      properties: {
                        ...f.properties,
                        facilityId: facility.id,
                        fill: color,
                        line: lineColor,
                        dashed: false,
                      },
                    }) satisfies Feature,
                ),
              ];
            }

            const polygonDivision = facility.polygonDivision ?? 1;
            const coordsList = firstFeature.geometry.coordinates;
            return coordsList.map(
              (coord, i) =>
                ({
                  type: 'Feature',
                  properties: {
                    ...firstFeature.properties,
                    facilityId: facility.id,
                    fill: i >= polygonDivision ? firstFloorColor : color,
                    line: lineColor,
                    dashed: i >= polygonDivision,
                  },
                  geometry: {
                    type: 'MultiPolygon',
                    coordinates: [coord],
                  },
                }) satisfies Feature<MultiPolygon>,
            );
          })
          .flat(),
      }) satisfies FeatureCollection,
    [facilities],
  );

  return (
    <Source type="geojson" data={data}>
      <Layer
        id={FACILITY_POLYGON_FILL_LAYER_ID}
        type="fill"
        paint={{
          'fill-color': ['get', 'fill'],
          'fill-opacity': 0.8,
          // 'fill-extrusion-height': ['coalesce', ['get', 'height'], 0],
          // 'fill-extrusion-base': 0,
        }}
      />
      <Layer
        id={FACILITY_POLYGON_LINE_LAYER_ID}
        type="line"
        paint={{
          'line-color': ['get', 'line'],
          'line-width': 2,
          'line-dasharray': [
            'case',
            ['get', 'dashed'],
            ['literal', [2, 2]], // 破線
            ['literal', [1, 0]], // 実線
          ],
        }}
      />
    </Source>
  );
}
