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
        
        // 最初のフィーチャーに建物名を追加
        const modifiedData = {
          ...building.data,
          features: building.data.features.map((f, idx) => ({
            ...f,
            properties: {
              ...f.properties,
              _buildingName: idx === 0 ? building.name : undefined,
            },
          })),
        };

        return (
          <Source key={i} type="geojson" data={modifiedData}>
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
            {building.name && (
              <Layer
                type="symbol"
                layout={{
                  'text-field': ['get', '_buildingName'],
                  'text-size': 14,
                  'text-offset': [0, 0],
                  'text-anchor': 'center',
                }}
                paint={{
                  'text-color': '#000000',
                  'text-halo-color': '#ffffff',
                  'text-halo-width': 2,
                }}
                filter={['!=', ['get', '_buildingName'], null]}
              />
            )}
          </Source>
        );
      })}
    </>
  );
}
