import { Source, Layer } from 'react-map-gl/maplibre';
import { useMemo } from 'react';
import { type FeatureCollection } from 'geojson';
import { generateEntranceLines } from '@/utils/entrance';

interface EntranceMarkersProps {
  entrances: FeatureCollection;
  show?: boolean;
}

export default function EntranceMarkers({ entrances, show = true }: EntranceMarkersProps) {
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
    <Source type="geojson" data={entranceLinesGeoJSON}>
      <Layer
        type="line"
        paint={{
          'line-color': '#000000',
          'line-width': 3,
          'line-opacity': show ? 1 : 0,
        }}
      />
    </Source>
  );
}
