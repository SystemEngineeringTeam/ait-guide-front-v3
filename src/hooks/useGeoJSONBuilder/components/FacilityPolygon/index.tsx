import { FacilityFillColor } from '@/consts/colors';
import { PolygonFeature } from '@/hooks/useGeoJSONBuilder';
import { Layer, Source } from 'react-map-gl/maplibre';

interface Props {
  polygonFeature: PolygonFeature;
  selectedColor: FacilityFillColor;
}

export default function FacilityPolygon({ polygonFeature, selectedColor }: Props) {
  return (
    <Source
      type="geojson"
      data={{
        type: 'FeatureCollection',
        features: polygonFeature ? [polygonFeature] : [],
      }}
    >
      <Layer
        type="fill"
        paint={{
          'fill-color': selectedColor,
          'fill-opacity': 0.4,
        }}
      />
      <Layer
        type="line"
        paint={{
          'line-color': selectedColor,
          'line-width': 2,
        }}
      />
    </Source>
  );
}
