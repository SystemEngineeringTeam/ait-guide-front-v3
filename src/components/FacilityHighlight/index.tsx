import { GEO_JSON_FACILITIES } from '@/consts/facilities';
import { Layer, Source } from 'react-map-gl/maplibre';
import { DEFAULT_COLOR } from '@/consts/colors';
import { darkenColor, getFeaturesColor } from '@/utils/color';
import { useMemo } from 'react';
import { FACILITY_POLYGON_LINE_LAYER_ID } from '@/consts/layerId';

interface Props {
  id: string;
  outline?: boolean;
  fill?: boolean;
}

export default function FacilityHighlight({ id, outline = false, fill = false }: Props) {
  const facility = GEO_JSON_FACILITIES.find((b) => b.id === id);

  if (!facility) return null;

  const darkerColor = useMemo(() => darkenColor(getFeaturesColor(facility) ?? DEFAULT_COLOR, 0.1), [facility]);

  return (
    <Source type="geojson" data={facility.data}>
      {fill && (
        <Layer
          type="fill"
          paint={{
            'fill-color': darkerColor,
            'fill-opacity': 1,
          }}
          beforeId={FACILITY_POLYGON_LINE_LAYER_ID}
        />
      )}
      {outline && (
        <Layer
          type="line"
          paint={{
            'line-color': darkerColor,
            'line-width': 4,
          }}
          beforeId={FACILITY_POLYGON_LINE_LAYER_ID}
        />
      )}
    </Source>
  );
}
