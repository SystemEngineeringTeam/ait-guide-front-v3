import { FacilityFillColor } from '@/consts/colors';
import { PolygonFeature } from '@/hooks/useGeoJSONBuilder';
import { Layer, Source } from 'react-map-gl/maplibre';

interface Props {
  polygonFeature: PolygonFeature;
  selectedColor: FacilityFillColor;
  isDashedLine?: boolean;
}

export default function FacilityPolygon({ polygonFeature, selectedColor, isDashedLine = false }: Props) {
  return (
    <Source
      type="geojson"
      data={{
        type: 'FeatureCollection',
        features: polygonFeature ? [polygonFeature] : [],
      }}
    >
      {!isDashedLine && (
        <Layer
          type="fill"
          paint={{
            'fill-color': selectedColor,
            'fill-opacity': 0.4,
          }}
        />
      )}
      <Layer
        type="line"
        paint={{
          'line-color': '#555555',
          'line-width': 2.5,
          ...(isDashedLine && { 'line-dasharray': [4, 2] }),
        }}
      />
    </Source>
  );
}
