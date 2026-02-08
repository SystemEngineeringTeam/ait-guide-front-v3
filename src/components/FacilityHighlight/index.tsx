import { GEO_JSON_FACILITIES } from '@/consts/facilities';
import { Layer, Source } from 'react-map-gl/maplibre';
import { DEFAULT_COLOR } from '@/consts/colors';
import { darkenColor, getFeaturesColor } from '@/utils/color';
import { useMemo } from 'react';
import { FACILITY_POLYGON_LINE_LAYER_ID } from '@/consts/layerId';
import type { FeatureCollection, Feature, MultiPolygon } from 'geojson';

interface Props {
  id: string;
  outline?: boolean;
  fill?: boolean;
}

export default function FacilityHighlight({ id, outline = false, fill = false }: Props) {
  const facility = GEO_JSON_FACILITIES.find((b) => b.id === id);

  if (!facility) return null;

  const color = getFeaturesColor(facility) ?? DEFAULT_COLOR;
  const darkerColor = darkenColor(color, 0.1);

  const highlightData = useMemo(() => {
    const firstFeature = facility.data.features.at(0);

    if (firstFeature?.geometry.type !== 'MultiPolygon') {
      return {
        type: 'FeatureCollection',
        features: facility.data.features.map((f) => ({
          ...f,
          properties: { ...f.properties, dashed: false },
        })),
      } satisfies FeatureCollection;
    }

    const polygonDivision = facility.polygonDivision ?? 1;
    const coordsList = firstFeature.geometry.coordinates;

    return {
      type: 'FeatureCollection',
      features: coordsList.slice(0, polygonDivision).map(
        (coord, i) =>
          ({
            type: 'Feature',
            properties: {
              ...firstFeature.properties,
              dashed: false,
            },
            geometry: {
              type: 'MultiPolygon',
              coordinates: [coord],
            },
          }) satisfies Feature<MultiPolygon>,
      ),
    } satisfies FeatureCollection;
  }, [facility]);

  return (
    <Source type="geojson" data={highlightData}>
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
