'use client';

import { Layer, Source } from 'react-map-gl/maplibre';
import { useEdgesGeoJSONValue } from '../../hooks/useEdges';
import { ROUTE_EDGE_LINE_LAYER_ID } from '@/consts/layerId';

export default function EdgeLines() {
  const edges = useEdgesGeoJSONValue();

  return (
    <Source type="geojson" data={edges}>
      <Layer
        id={ROUTE_EDGE_LINE_LAYER_ID}
        type="line"
        paint={{
          // 太さ (edgeLevel)
          'line-width': [
            'match',
            ['get', 'edgeLevel'],
            1, // レベル 1
            10,
            2, // レベル 2
            8,
            3, // レベル 3
            6,
            4, // レベル 4
            4,
            5, // レベル 5
            2,
            2, // デフォルト
          ],

          // 色 (isAccessible)
          'line-color': ['case', ['get', 'isAccessible'], '#4169E2', '#6f6f6f'],

          // 透明度 (isIndoor)
          'line-opacity': ['case', ['get', 'isIndoor'], 0.5, 1],

          // 波線 (hasStairs)
          'line-dasharray': [
            'case',
            ['get', 'hasStairs'],
            ['literal', [0.5, 0.5]], // 波線っぽい
            ['literal', [1, 0]], // 実線
          ],
        }}
      />
    </Source>
  );
}
