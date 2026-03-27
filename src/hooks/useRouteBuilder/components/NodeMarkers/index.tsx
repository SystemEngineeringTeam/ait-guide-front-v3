'use client';

import { useNodesGeoJSONValue } from '../../hooks/useNodes';
import { Layer, Source } from 'react-map-gl/maplibre';
import { RouteNodeTypeMap } from '../../consts/routeMode';
import { ROUTE_NODE_MARKER_LAYER_ID } from '@/consts/layerId';
import { useSelectedNodeValue } from '../../hooks/useSelectedTarget';
import SelectedNodeMarker from './SelectedNodeMarker';

export default function NodeMarkers() {
  const nodes = useNodesGeoJSONValue();
  const selected = useSelectedNodeValue();

  return (
    <>
      <Source type="geojson" data={nodes}>
        <Layer
          id={ROUTE_NODE_MARKER_LAYER_ID}
          type="circle"
          paint={{
            'circle-color': [
              'match',
              ['get', 'nodeType'],
              RouteNodeTypeMap.facility,
              '#FE6A6B',
              RouteNodeTypeMap.entrance,
              '#FFA405',
              RouteNodeTypeMap.passage,
              '#4169E2',
              '#999999', // その他
            ],
            // 選択中のノードは不透明にする
            'circle-opacity': ['match', ['get', 'nodeId'], selected?.id ?? '', 0.5, 1],
            // 選択中のノードはアウトラインを赤色にする
            'circle-stroke-color': ['match', ['get', 'nodeId'], selected?.id ?? '', '#000000', '#FFFFFF'],
            'circle-stroke-opacity': ['match', ['get', 'nodeId'], selected?.id ?? '', 0.5, 1],
            'circle-stroke-width': ['match', ['get', 'nodeId'], selected?.id ?? '', 4, 2],
            'circle-radius': 7,
          }}
        />
      </Source>

      {selected && <SelectedNodeMarker node={selected} />}
    </>
  );
}
