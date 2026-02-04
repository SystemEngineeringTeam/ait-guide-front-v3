import { useState, useCallback, useMemo, useEffect, type MouseEvent } from 'react';
import { Feature, FeatureCollection, Point, Polygon } from 'geojson';
import { type MapRef } from 'react-map-gl/maplibre';
import MarkerPoints from './components/MarkerPoints';
import BuildPolygon from './components/BuildPolygon';
import GeoJSONPanel from './components/GeoJSONPanel';
import EntranceMarkers from './components/EntranceMarkers';
import { HandleMapClickFn, HandleMapContextMenuFn } from '@/components/Map';
import { BuildingFillColor, DEFAULT_COLOR } from '@/consts/colors';

export type PolygonFeature = Feature<Polygon> | null;

export interface BuildingPoint {
  id: string;
  longitude: number;
  latitude: number;
  timestamp: number;
}

export interface Entrance {
  id: string;
  longitude: number;
  latitude: number;
  rotation: number; // degrees (0-360)
  width: number; // meters
  timestamp: number;
}

export type BuildMode = 'polygon' | 'entrance';

const POINTS_STORAGE_KEY = 'geojson-builder:points';
const ENTRANCES_STORAGE_KEY = 'geojson-builder:entrances';

export const useGeoJSONBuilder = () => {
  const [points, setPoints] = useState<BuildingPoint[]>([]);
  const [entrances, setEntrances] = useState<Entrance[]>([]);
  const [selectedColor, setSelectedColor] = useState<BuildingFillColor>(DEFAULT_COLOR);
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [selectedEntranceId, setSelectedEntranceId] = useState<string | null>(null);
  const [buildMode, setBuildMode] = useState<BuildMode>('polygon');

  useEffect(() => {
    const saved = localStorage.getItem(POINTS_STORAGE_KEY);
    if (saved) setPoints(JSON.parse(saved));
    const savedEntrances = localStorage.getItem(ENTRANCES_STORAGE_KEY);
    if (savedEntrances) setEntrances(JSON.parse(savedEntrances));
  }, []);

  useEffect(() => {
    localStorage.setItem(POINTS_STORAGE_KEY, JSON.stringify(points));
  }, [points]);

  useEffect(() => {
    localStorage.setItem(ENTRANCES_STORAGE_KEY, JSON.stringify(entrances));
  }, [entrances]);

  const createPoint = useCallback((longitude: number, latitude: number) => {
    return {
      id: `point-${Date.now()}-${Math.random()}`,
      longitude,
      latitude,
      timestamp: Date.now(),
    } as BuildingPoint;
  }, []);

  const addPoint = useCallback(
    (longitude: number, latitude: number) => {
      const newPoint = createPoint(longitude, latitude);
      setPoints((prev) => [...prev, newPoint]);
      return newPoint;
    },
    [createPoint],
  );

  const insertPointAt = useCallback(
    (index: number, longitude: number, latitude: number) => {
      const newPoint = createPoint(longitude, latitude);
      setPoints((prev) => {
        const next = [...prev];
        const insertIndex = Math.max(0, Math.min(index, next.length));
        next.splice(insertIndex, 0, newPoint);
        return next;
      });
      return newPoint;
    },
    [createPoint],
  );

  const getDistanceToSegment = useCallback(
    (p: { x: number; y: number }, v: { x: number; y: number }, w: { x: number; y: number }) => {
      const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
      if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
      const t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
      const clampedT = Math.max(0, Math.min(1, t));
      const projection = {
        x: v.x + clampedT * (w.x - v.x),
        y: v.y + clampedT * (w.y - v.y),
      };
      return Math.hypot(p.x - projection.x, p.y - projection.y);
    },
    [],
  );

  const removePoint = useCallback((id: string) => {
    setPoints((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updatePoint = useCallback((id: string, longitude: number, latitude: number) => {
    setPoints((prev) => prev.map((point) => (point.id === id ? { ...point, longitude, latitude } : point)));
  }, []);

  const clearPoints = useCallback(() => {
    setPoints([]);
    setSelectedPointId(null);
    localStorage.removeItem(POINTS_STORAGE_KEY);
  }, []);

  const addEntrance = useCallback((longitude: number, latitude: number, rotation: number = 0, width: number = 2) => {
    const newEntrance: Entrance = {
      id: `entrance-${Date.now()}-${Math.random()}`,
      longitude,
      latitude,
      rotation,
      width,
      timestamp: Date.now(),
    };
    setEntrances((prev) => [...prev, newEntrance]);
    return newEntrance;
  }, []);

  const removeEntrance = useCallback((id: string) => {
    setEntrances((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const updateEntrance = useCallback((id: string, updates: Partial<Omit<Entrance, 'id' | 'timestamp'>>) => {
    setEntrances((prev) => prev.map((entrance) => (entrance.id === id ? { ...entrance, ...updates } : entrance)));
  }, []);

  const clearEntrances = useCallback(() => {
    setEntrances([]);
    setSelectedEntranceId(null);
    localStorage.removeItem(ENTRANCES_STORAGE_KEY);
  }, []);

  const handleMapContextMenu: HandleMapContextMenuFn = useCallback(
    (mapRef: React.RefObject<MapRef | null>) => (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault();

      if (!mapRef.current) return;

      const canvas = mapRef.current.getCanvas();
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const lngLat = mapRef.current.unproject([x, y]);

      if (buildMode === 'polygon') {
        addPoint(lngLat.lng, lngLat.lat);
      } else if (buildMode === 'entrance') {
        addEntrance(lngLat.lng, lngLat.lat);
      }
    },
    [addPoint, addEntrance, buildMode],
  );

  const handleMapClick: HandleMapClickFn = useCallback(
    (mapRef: React.RefObject<MapRef | null>) => (e: MouseEvent<HTMLDivElement>) => {
      if (!mapRef.current) return;
      if (buildMode !== 'polygon') return; // ポリゴンモードのみ辺への点挿入を有効化
      if (points.length < 2) return;

      const canvas = mapRef.current.getCanvas();
      const rect = canvas.getBoundingClientRect();
      const clickPoint = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      const projectedPoints = points.map((point) => mapRef.current!.project([point.longitude, point.latitude]));

      let minDistance = Number.POSITIVE_INFINITY;
      let insertIndex = -1;
      const lastIndex = projectedPoints.length - 1;

      for (let i = 0; i < projectedPoints.length - 1; i += 1) {
        const v = projectedPoints[i];
        const w = projectedPoints[i + 1];
        const distance = getDistanceToSegment(clickPoint, v, w);
        if (distance < minDistance) {
          minDistance = distance;
          insertIndex = i + 1;
        }
      }

      if (projectedPoints.length > 2) {
        const v = projectedPoints[lastIndex];
        const w = projectedPoints[0];
        const distance = getDistanceToSegment(clickPoint, v, w);
        if (distance < minDistance) {
          minDistance = distance;
          insertIndex = points.length;
        }
      }

      const THRESHOLD_PX = 10;
      if (insertIndex < 0 || minDistance > THRESHOLD_PX) return;

      const lngLat = mapRef.current.unproject([clickPoint.x, clickPoint.y]);
      insertPointAt(insertIndex, lngLat.lng, lngLat.lat);
    },
    [getDistanceToSegment, insertPointAt, points, buildMode],
  );

  const polygonFeature = useMemo<PolygonFeature>(() => {
    if (points.length < 3) return null;

    const ring = points.map((point) => [point.longitude, point.latitude]);
    const first = ring[0];
    const last = ring[ring.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      ring.push([first[0], first[1]]);
    }

    return {
      type: 'Feature',
      properties: {
        color: selectedColor,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [ring],
      },
    };
  }, [points, selectedColor]);

  const generateGeoJSON = useCallback((): FeatureCollection => {
    const pointFeatures: Feature<Point>[] = points.map((point) => ({
      type: 'Feature',
      properties: {
        id: point.id,
        timestamp: point.timestamp,
      },
      geometry: {
        type: 'Point',
        coordinates: [point.longitude, point.latitude],
      },
    }));

    const features = polygonFeature ? [polygonFeature, ...pointFeatures] : pointFeatures;

    return {
      type: 'FeatureCollection',
      features,
    };
  }, [points, polygonFeature]);

  const copyToClipboard = useCallback(async () => {
    const geojson = generateGeoJSON();
    const json = JSON.stringify(geojson, null, 2);
    await navigator.clipboard.writeText(json);
  }, [generateGeoJSON]);

  const pasteFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();

      const geojson: FeatureCollection = JSON.parse(text);

      if (!geojson.features || !Array.isArray(geojson.features)) {
        throw new Error('Invalid GeoJSON format');
      }

      // ポイントフィーチャーのみを抽出
      const pointFeatures = geojson.features.filter((feature) => feature.geometry.type === 'Point');

      if (pointFeatures.length === 0) {
        throw new Error('No point features found in GeoJSON');
      }

      // 新しい点を復元
      const newPoints: BuildingPoint[] = pointFeatures.map((feature) => {
        const coords = (feature.geometry as Point).coordinates;
        return {
          id: `point-${Date.now()}-${Math.random()}`,
          longitude: coords[0],
          latitude: coords[1],
          timestamp: Date.now(),
        };
      });

      setPoints(newPoints);
      setSelectedPointId(null);
    } catch (error) {
      console.error('Failed to paste GeoJSON:', error);
      alert('GeoJSONの貼り付けに失敗しました。正しいGeoJSON形式か確認してください。');
    }
  }, []);

  const panel = (
    <GeoJSONPanel
      points={points}
      entrances={entrances}
      buildMode={buildMode}
      onChangeBuildMode={setBuildMode}
      onClear={clearPoints}
      onClearEntrances={clearEntrances}
      onCopy={copyToClipboard}
      onPaste={pasteFromClipboard}
      selectedColor={selectedColor}
      onSelectColor={setSelectedColor}
    />
  );
  const buildPolygon = (
    <>
      <MarkerPoints
        points={points}
        selectedPointId={selectedPointId}
        onSelectPoint={setSelectedPointId}
        onRemovePoint={removePoint}
        onUpdatePoint={updatePoint}
      />
      <BuildPolygon polygonFeature={polygonFeature} selectedColor={selectedColor} />
    </>
  );

  const entranceMarkers = (
    <EntranceMarkers
      entrances={entrances}
      selectedEntranceId={selectedEntranceId}
      onSelectEntrance={setSelectedEntranceId}
      onRemoveEntrance={removeEntrance}
      onUpdateEntrance={updateEntrance}
    />
  );

  return {
    points,
    entrances,
    polygonFeature,
    selectedColor,
    selectedPointId,
    selectedEntranceId,
    buildMode,

    handleMapContextMenu,
    handleMapClick,

    // entrance operations
    addEntrance,
    removeEntrance,
    updateEntrance,
    setSelectedEntranceId,

    // components
    panel,
    buildPolygon,
    entranceMarkers,
  };
};
