'use client';

import { GeoJSONFacilities } from '@/types/facilities';
import { Layer, Source } from 'react-map-gl/maplibre';
import type { FeatureCollection } from 'geojson';

interface Props {
  facilities: GeoJSONFacilities[];
}

export default function FacilityNames({ facilities }: Props) {
  const data: FeatureCollection = {
    type: 'FeatureCollection',
    features: facilities.map((facility) => {
      const feature = facility.data.features[0]; // ラベル用1点

      return {
        ...feature,
        properties: {
          ...feature.properties,
          label: facility.name,
        },
      };
    }),
  };

  return (
    <Source id="facility-labels" type="geojson" data={data}>
      <Layer
        id="facility-names"
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
