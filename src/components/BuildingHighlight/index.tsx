import { GEO_JSON_DATA } from '@/consts/buildings';
import { Layer, Source } from 'react-map-gl/maplibre';
import { DEFAULT_COLOR } from '@/consts/colors';
import { darkenColor, getFeaturesColor } from '@/utils/color';
import { useMemo } from 'react';

interface Props {
  id: string;
  outline?: boolean;
  fill?: boolean;
}

export default function BuildingHighlight({ id, outline = false, fill = false }: Props) {
  const building = GEO_JSON_DATA.find((b) => b.id === id);

  if (!building) return null;

  const color = useMemo(() => getFeaturesColor(building) ?? DEFAULT_COLOR, [building]);
  const darkerColor = useMemo(() => darkenColor(color, 0.1), [color]);

  return (
    <>
      <Source type="geojson" data={building.data}>
        {fill && (
          <Layer
            type="fill"
            paint={{
              'fill-color': color,
              'fill-opacity': 1,
            }}
            beforeId={building.id}
          />
        )}
        {outline && (
          <Layer
            type="line"
            paint={{
              'line-color': darkerColor,
              'line-width': 4,
            }}
            beforeId={building.id}
          />
        )}
      </Source>
    </>
  );
}
