import { BuildingFillColor } from '@/consts/colors';
import { PolygonFeature } from '@/hooks/useGeoJSONBuilder';
import { Layer, Source } from 'react-map-gl/maplibre';

interface Props {
  polygonFeature: PolygonFeature;
  selectedColor: BuildingFillColor;
}

export default function BuildPolygon({ polygonFeature, selectedColor }: Props) {
  return (
    <Source
      id="building-polygon"
      type="geojson"
      data={{
        type: 'FeatureCollection',
        features: polygonFeature ? [polygonFeature] : [],
      }}
    >
      <Layer
        id="building-fill"
        type="fill"
        paint={{
          'fill-color': selectedColor,
          'fill-opacity': 0.4,
        }}
      />
      <Layer
        id="building-outline"
        type="line"
        paint={{
          'line-color': selectedColor,
          'line-width': 2,
        }}
      />
    </Source>
  );
}
