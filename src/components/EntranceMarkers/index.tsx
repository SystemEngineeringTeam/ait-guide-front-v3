import { Source, Layer } from 'react-map-gl/maplibre';
import { useMemo } from 'react';
import { type FeatureCollection } from 'geojson';
import { generateEntranceLines } from '@/utils/entrance';

interface EntranceMarkersProps {
  entrances: FeatureCollection;
}

export default function EntranceMarkers({ entrances }: EntranceMarkersProps) {
  // 各出入り口に対して2本の平行線を生成
  const entranceLinesGeoJSON = useMemo(() => {
    const features = entrances.features
      .filter((feature) => feature.geometry.type === 'Point' && feature.properties?.type === 'entrance')
      .flatMap((entrance) => {
        if (entrance.geometry.type !== 'Point') return [];

        const [longitude, latitude] = entrance.geometry.coordinates;
        const rotation = entrance.properties?.rotation || 0;
        const width = entrance.properties?.width || 2;
        const id = entrance.properties?.id || 'unknown';

        return generateEntranceLines(
          { id, longitude, latitude, rotation, width },
          2, // 線の長さ（メートル）
        );
      });

    return {
      type: 'FeatureCollection' as const,
      features,
    };
  }, [entrances]);

  if (!entrances || !entrances.features || entrances.features.length === 0) {
    return null;
  }

  return (
    <Source id="entrance-lines" type="geojson" data={entranceLinesGeoJSON}>
      <Layer
        id="entrance-lines-layer"
        type="line"
        paint={{
          'line-color': '#000000',
          'line-width': 3,
        }}
      />
    </Source>
  );
}
