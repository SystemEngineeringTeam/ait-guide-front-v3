'use client';

import { GeoJSONData } from '@/consts/facilities';
import { Layer, Source } from 'react-map-gl/maplibre';
import { darkenColor, getFeaturesColor } from '@/utils/color';
import { DEFAULT_COLOR } from '@/consts/colors';

interface Props {
  facilities: GeoJSONData[];
}

export default function FacilitiesPolygons({ facilities }: Props) {
  return (
    <>
      {facilities
        .sort((a, b) => {
          if (a.type !== 'passage' && b.type === 'passage') return 1;
          if (a.type === 'passage' && b.type !== 'passage') return -1;
          return 0;
        })
        .map((facility, i) => {
          const color = getFeaturesColor(facility) ?? DEFAULT_COLOR;
          const darkerColor = darkenColor(color, 0.1);

          return (
            <Source key={i} type="geojson" data={facility.data}>
              <Layer
                id={facility.id?.toString()}
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

      {facilities
        .filter((b) => b.type !== 'passage')
        .map((facility, i) => {
          return (
            <Source
              key={i}
              type="geojson"
              data={{
                ...facility.data,
                features: [facility.data.features[0]],
              }}
            >
              <Layer
                type="symbol"
                layout={{
                  'text-field': facility.name,
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
