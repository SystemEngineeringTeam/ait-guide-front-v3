'use client';

import { GeoJSONData } from '@/geojson';
import { Layer, Source } from 'react-map-gl/maplibre';
import { darkenColor, getFeaturesColor } from '@/utils/color';
import { DEFAULT_COLOR } from '@/consts/colors';

interface Props {
  data: GeoJSONData[];
}

export default function BuildingPolygons({ data }: Props) {
  return (
    <>
      {data
        .sort((a, b) => {
          if (a.name && !b.name) return 1;
          if (!a.name && b.name) return -1;
          return 0;
        })
        .map((building, i) => {
          const color = getFeaturesColor(building) ?? DEFAULT_COLOR;
          const darkerColor = darkenColor(color, 0.1);

          return (
            <Source key={i} type="geojson" data={building.data}>
              <Layer
                type="fill"
                paint={{
                  'fill-color': color,
                  'fill-opacity': 0.5,
                }}
              />
              <Layer
                type="line"
                paint={{
                  'line-color': darkerColor,
                  'line-width': 2,
                }}
              />
            </Source>
          );
        })}

      {data
        .filter((b) => b.name)
        .map((building, i) => {
          return (
            <Source
              key={i}
              type="geojson"
              data={{
                ...building.data,
                features: [building.data.features[0]],
              }}
            >
              <Layer
                type="symbol"
                layout={{
                  'text-field': building.name,
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
        })}
    </>
  );
}
