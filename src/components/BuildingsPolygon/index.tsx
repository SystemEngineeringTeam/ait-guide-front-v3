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
      {data.map((building, i) => {
        const color = getFeaturesColor(building) ?? DEFAULT_COLOR;
        const darkerColor = darkenColor(color, 0.1);

        return (
          <Source key={i} type="geojson" data={building.data}>
            <Layer
              type="fill"
              paint={{
                'fill-color': color,
                'fill-opacity': 0.3,
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
    </>
  );
}
