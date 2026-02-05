import { GEO_JSON_FACILITIES } from '@/consts/facilities';
import { Layer, Source } from 'react-map-gl/maplibre';
import { DEFAULT_COLOR } from '@/consts/colors';
import { darkenColor, getFeaturesColor } from '@/utils/color';
import { useMemo } from 'react';

interface Props {
  id: string;
  outline?: boolean;
  fill?: boolean;
}

export default function FacilityHighlight({ id, outline = false, fill = false }: Props) {
  const facility = GEO_JSON_FACILITIES.find((b) => b.id === id);

  if (!facility) return null;

  const color = useMemo(() => getFeaturesColor(facility) ?? DEFAULT_COLOR, [facility]);
  const darkerColor = useMemo(() => darkenColor(color, 0.1), [color]);

  return (
    <Source type="geojson" data={facility.data}>
      {fill && (
        <Layer
          type="fill"
          paint={{
            'fill-color': color,
            'fill-opacity': 1,
          }}
          beforeId={facility.id}
        />
      )}
      {outline && (
        <Layer
          type="line"
          paint={{
            'line-color': darkerColor,
            'line-width': 4,
          }}
          beforeId={facility.id}
        />
      )}
    </Source>
  );
}
