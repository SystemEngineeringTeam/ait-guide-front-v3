'use client';

import { useNodesGeoJSONValue } from '../../hooks/useNodes';
import { Layer, Source } from 'react-map-gl/maplibre';
import { RouteModeMap } from '../../consts/routeMode';

export default function NodeMarkers() {
  const nodes = useNodesGeoJSONValue();

  return (
    <Source type="geojson" data={nodes}>
      <Layer
        type="circle"
        paint={{
          'circle-color': [
            'match',
            ['get', 'nodeType'],
            RouteModeMap.facility,
            '#FE6A6B',
            RouteModeMap.entrance,
            '#FFA405',
            RouteModeMap.passage,
            '#4169E2',
            '#999999', // その他
          ],
          // アウトライン
          'circle-stroke-color': '#FFFFFF',
          'circle-stroke-width': 2,
          'circle-radius': 7,
        }}
      />
    </Source>
  );
}
