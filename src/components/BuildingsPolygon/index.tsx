'use client';

import { GeoJSONData } from '@/geojson';
import { Layer, Source } from 'react-map-gl/maplibre';

interface Props {
  data: GeoJSONData[];
}

export default function BuildingPolygons({ data }: Props) {
  return (
    <>
      {data.map((building) => (
        <Source key={building.name} type="geojson" data={building.data}>
          <Layer
            type="fill"
            paint={{
              'fill-color': '#3b82f6',
              'fill-opacity': 0.3,
            }}
          />
          <Layer
            id={`line-${building.name}`}
            type="line"
            paint={{
              'line-color': '#2563eb',
              'line-width': 2,
            }}
          />
        </Source>
      ))}
    </>
  );
}
