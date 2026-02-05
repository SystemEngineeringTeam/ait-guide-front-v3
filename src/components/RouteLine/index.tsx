import { Coord } from '@/types/coord';
import { Layer, Source } from 'react-map-gl/maplibre';

interface Props {
  route: Coord[] | undefined;
}

export default function RouteLine({ route }: Props) {
  return (
    <Source
      type="geojson"
      data={{
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route ?? [],
        },
      }}
    >
      <Layer
        type="line"
        paint={{
          'line-color': '#0026ff',
          'line-width': 2,
        }}
      />
    </Source>
  );
}
