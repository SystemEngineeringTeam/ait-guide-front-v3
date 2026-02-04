import { Source, Layer } from 'react-map-gl/maplibre';
import { useMemo } from 'react';
import { type FeatureCollection } from 'geojson';

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

        // 回転角度をラジアンに変換
        const angleRad = (rotation * Math.PI) / 180;

        // 壁に垂直な方向（線の方向）
        const perpX = Math.cos(angleRad);
        const perpY = Math.sin(angleRad);

        // 幅方向（線と垂直な方向）
        const widthX = -Math.sin(angleRad);
        const widthY = Math.cos(angleRad);

        // 線の長さ（メートル単位で2m）
        const lineLength = 2;

        // 緯度経度での近似的なオフセット（小さなスケールなので簡易計算）
        const metersToLng = 1 / (111320 * Math.cos((latitude * Math.PI) / 180));
        const metersToLat = 1 / 110540;

        // 幅の半分だけ左右にオフセット
        const halfWidth = width / 2;

        // 左側の線
        const line1Start = [
          longitude + (widthX * halfWidth - (perpX * lineLength) / 2) * metersToLng,
          latitude + (widthY * halfWidth - (perpY * lineLength) / 2) * metersToLat,
        ];
        const line1End = [
          longitude + (widthX * halfWidth + (perpX * lineLength) / 2) * metersToLng,
          latitude + (widthY * halfWidth + (perpY * lineLength) / 2) * metersToLat,
        ];

        // 右側の線
        const line2Start = [
          longitude + (-widthX * halfWidth - (perpX * lineLength) / 2) * metersToLng,
          latitude + (-widthY * halfWidth - (perpY * lineLength) / 2) * metersToLat,
        ];
        const line2End = [
          longitude + (-widthX * halfWidth + (perpX * lineLength) / 2) * metersToLng,
          latitude + (-widthY * halfWidth + (perpY * lineLength) / 2) * metersToLat,
        ];

        return [
          {
            type: 'Feature' as const,
            properties: { entranceId: entrance.properties?.id },
            geometry: {
              type: 'LineString' as const,
              coordinates: [line1Start, line1End],
            },
          },
          {
            type: 'Feature' as const,
            properties: { entranceId: entrance.properties?.id },
            geometry: {
              type: 'LineString' as const,
              coordinates: [line2Start, line2End],
            },
          },
        ];
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
