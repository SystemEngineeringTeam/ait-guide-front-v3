import { useMemo, useEffect } from 'react';
import { LineString, type FeatureCollection } from 'geojson';
import { Layer, Source, useMap } from 'react-map-gl/maplibre';
import { RoadPoint, Road } from '@/hooks/useRouteBuilder';

interface RoadLinesProps {
  points: RoadPoint[];
  roads: Road[];
  onSelectRoad: (roadId: string | null) => void;
  selectedRoadId: string | null;
}

const LAYER_ID = 'road-lines';

export default function RoadLines({ points, roads, onSelectRoad, selectedRoadId }: RoadLinesProps) {
  const { current: map } = useMap();
  const data = useMemo<FeatureCollection<LineString>>(() => {
    const features = roads
      .map((road) => {
        const roadPoints = road.pointIds
          .map((pointId) => points.find((p) => p.id === pointId))
          .filter((p): p is RoadPoint => p !== undefined);

        if (roadPoints.length < 2) {
          return null;
        }

        return {
          type: 'Feature' as const,
          properties: {
            id: road.id,
            mainRoute: road.options.mainRoute || false,
            backroad: road.options.backroad || false,
            stair: road.options.stair || false,
            selected: road.id === selectedRoadId,
          },
          geometry: {
            type: 'LineString' as const,
            coordinates: roadPoints.map((p) => [p.lng, p.lat]) as [number, number][],
          },
        };
      })
      .filter((f) => f !== null);

    return {
      type: 'FeatureCollection' as const,
      features: features as any[],
    };
  }, [points, roads, selectedRoadId]);

  useEffect(() => {
    if (!map) return;

    const handleClick = (e: any) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [LAYER_ID],
      });

      if (features && features.length > 0) {
        const roadId = features[0].properties?.id;
        if (roadId) {
          onSelectRoad(roadId);
        }
      }
    };

    map.on('click', LAYER_ID, handleClick);

    // カーソルをポインターに変更
    map.on('mouseenter', LAYER_ID, () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', LAYER_ID, () => {
      map.getCanvas().style.cursor = '';
    });

    return () => {
      map.off('click', LAYER_ID, handleClick);
      map.off('mouseenter', LAYER_ID, () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.off('mouseleave', LAYER_ID, () => {
        map.getCanvas().style.cursor = '';
      });
    };
  }, [map, onSelectRoad]);

  if (roads.length === 0 || data.features.length === 0) {
    return null;
  }

  return (
    <Source type="geojson" data={data}>
      <Layer
        id={LAYER_ID}
        type="line"
        paint={{
          'line-color': [
            'case',
            ['get', 'selected'],
            '#FF6B6B', // 選択時は赤
            ['get', 'stair'],
            '#FF8C00', // 階段はオレンジ色
            '#667eea', // デフォルトは紫
          ],
          'line-width': [
            'case',
            ['get', 'mainRoute'],
            10, // 本道は太め
            ['get', 'backroad'],
            5, // 裏道は普通の太さ
            ['get', 'stair'],
            5, // 階段は中間の太さ
            5, // デフォルト
          ],
          'line-opacity': 0.8,
          'line-dasharray': [
            'case',
            ['get', 'backroad'],
            ['literal', [2, 1]], // 裏道は細かい破線
            ['literal', [1, 0]], // それ以外は実線
          ],
        }}
      />
    </Source>
  );
}
