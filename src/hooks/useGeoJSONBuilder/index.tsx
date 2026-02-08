import { useState, useCallback, useMemo, useEffect, type MouseEvent } from 'react';
import { Feature, FeatureCollection, Point, Polygon, MultiPolygon } from 'geojson';
import { type MapRef } from 'react-map-gl/maplibre';
import MarkerPoints from './components/MarkerPoints';
import FacilityPolygon from './components/FacilityPolygon';
import GeoJSONPanel from './components/GeoJSONPanel';
import EntranceMarkers from './components/EntranceMarkers';
import { HandleMapClickFn, HandleMapContextMenuFn } from '@/components/Map';
import { FacilityFillColor, DEFAULT_COLOR } from '@/consts/colors';
import { errorToast } from '@/utils/toast';

export type PolygonFeature = Feature<Polygon> | null;
export type MultiPolygonFeature = Feature<MultiPolygon> | null;
export type PolygonSubMode = 'outline' | 'floor';

export interface FacilityPoint {
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

export type FacilityMode = 'polygon' | 'entrance';

const POINTS_STORAGE_KEY = 'geojson-builder:points';
const ENTRANCES_STORAGE_KEY = 'geojson-builder:entrances';
const FLOOR_POINTS_STORAGE_KEY = 'geojson-builder:floor-points';

export const useGeoJSONBuilder = () => {
  const [points, setPoints] = useState<FacilityPoint[]>([]);
  const [floorPoints, setFloorPoints] = useState<FacilityPoint[]>([]);
  const [entrances, setEntrances] = useState<Entrance[]>([]);
  const [selectedColor, setSelectedColor] = useState<FacilityFillColor>(DEFAULT_COLOR);
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [selectedFloorPointId, setSelectedFloorPointId] = useState<string | null>(null);
  const [selectedEntranceId, setSelectedEntranceId] = useState<string | null>(null);
  const [facilityMode, setFacilityMode] = useState<FacilityMode>('polygon');
  const [polygonSubMode, setPolygonSubMode] = useState<PolygonSubMode>('outline');

  useEffect(() => {
    const saved = localStorage.getItem(POINTS_STORAGE_KEY);
    if (saved) setPoints(JSON.parse(saved));
    const savedFloorPoints = localStorage.getItem(FLOOR_POINTS_STORAGE_KEY);
    if (savedFloorPoints) setFloorPoints(JSON.parse(savedFloorPoints));
    const savedEntrances = localStorage.getItem(ENTRANCES_STORAGE_KEY);
    if (savedEntrances) setEntrances(JSON.parse(savedEntrances));
  }, []);

  useEffect(() => {
    localStorage.setItem(POINTS_STORAGE_KEY, JSON.stringify(points));
  }, [points]);

  useEffect(() => {
    localStorage.setItem(FLOOR_POINTS_STORAGE_KEY, JSON.stringify(floorPoints));
  }, [floorPoints]);

  useEffect(() => {
    localStorage.setItem(ENTRANCES_STORAGE_KEY, JSON.stringify(entrances));
  }, [entrances]);

  const createPoint = useCallback((longitude: number, latitude: number) => {
    return {
      id: `point-${Date.now()}-${Math.random()}`,
      longitude,
      latitude,
      timestamp: Date.now(),
    } as FacilityPoint;
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

  const addFloorPoint = useCallback((longitude: number, latitude: number) => {
    const newPoint = createPoint(longitude, latitude);
    setFloorPoints((prev) => [...prev, newPoint]);
    return newPoint;
  }, [createPoint]);

  const insertFloorPointAt = useCallback(
    (index: number, longitude: number, latitude: number) => {
      const newPoint = createPoint(longitude, latitude);
      setFloorPoints((prev) => {
        const next = [...prev];
        const insertIndex = Math.max(0, Math.min(index, next.length));
        next.splice(insertIndex, 0, newPoint);
        return next;
      });
      return newPoint;
    },
    [createPoint],
  );

  const removeFloorPoint = useCallback((id: string) => {
    setFloorPoints((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updateFloorPoint = useCallback((id: string, longitude: number, latitude: number) => {
    setFloorPoints((prev) => prev.map((point) => (point.id === id ? { ...point, longitude, latitude } : point)));
  }, []);

  const clearFloorPoints = useCallback(() => {
    setFloorPoints([]);
    setSelectedFloorPointId(null);
    localStorage.removeItem(FLOOR_POINTS_STORAGE_KEY);
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

      if (facilityMode === 'polygon') {
        if (polygonSubMode === 'outline') {
          addPoint(lngLat.lng, lngLat.lat);
        } else {
          // 1階ポイント追加時に外枠にスナップ
          let finalLng = lngLat.lng;
          let finalLat = lngLat.lat;

          const SNAP_THRESHOLD_PX = 15;
          const clickPoint = { x, y };
          let minDistance = Number.POSITIVE_INFINITY;

          // 外枠のポイントから最も近い点を探す
          if (points.length > 0) {
            for (const point of points) {
              const projectedPoint = mapRef.current.project([point.longitude, point.latitude]);
              const dist = Math.hypot(clickPoint.x - projectedPoint.x, clickPoint.y - projectedPoint.y);

              if (dist < minDistance) {
                minDistance = dist;
                finalLng = point.longitude;
                finalLat = point.latitude;
              }
            }
          }

          // 外枠の線分から最も近い点を探す
          if (points.length > 1) {
            const projectedPoints = points.map((point) => mapRef.current!.project([point.longitude, point.latitude]));

            for (let i = 0; i < projectedPoints.length; i += 1) {
              const v = projectedPoints[i];
              const w = projectedPoints[(i + 1) % projectedPoints.length];

              // 線分上の最も近い点を計算
              const l2 = (w.x - v.x) ** 2 + (w.y - v.y) ** 2;
              let t = 0;
              if (l2 !== 0) {
                t = Math.max(0, Math.min(1, ((clickPoint.x - v.x) * (w.x - v.x) + (clickPoint.y - v.y) * (w.y - v.y)) / l2));
              }

              const closestPoint = {
                x: v.x + t * (w.x - v.x),
                y: v.y + t * (w.y - v.y),
              };

              const dist = Math.hypot(clickPoint.x - closestPoint.x, clickPoint.y - closestPoint.y);

              if (dist < minDistance) {
                minDistance = dist;
                const lngLatOnSegment = mapRef.current!.unproject([closestPoint.x, closestPoint.y]);
                finalLng = lngLatOnSegment.lng;
                finalLat = lngLatOnSegment.lat;
              }
            }
          }

          if (minDistance <= SNAP_THRESHOLD_PX) {
            addFloorPoint(finalLng, finalLat);
          } else {
            addFloorPoint(lngLat.lng, lngLat.lat);
          }
        }
      } else if (facilityMode === 'entrance') {
        addEntrance(lngLat.lng, lngLat.lat);
      }
    },
    [addPoint, addFloorPoint, addEntrance, facilityMode, polygonSubMode, points],
  );

  const handleMapClick: HandleMapClickFn = useCallback(
    (mapRef: React.RefObject<MapRef | null>) => (e: MouseEvent<HTMLDivElement>) => {
      if (!mapRef.current) return;
      if (facilityMode !== 'polygon') return;
      
      const ptsToUse = polygonSubMode === 'outline' ? points : floorPoints;
      if (ptsToUse.length < 2) return;

      const canvas = mapRef.current.getCanvas();
      const rect = canvas.getBoundingClientRect();
      const clickPoint = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      const projectedPoints = ptsToUse.map((point) => mapRef.current!.project([point.longitude, point.latitude]));

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
          insertIndex = ptsToUse.length;
        }
      }

      const THRESHOLD_PX = 10;
      if (insertIndex < 0 || minDistance > THRESHOLD_PX) return;

      const lngLat = mapRef.current.unproject([clickPoint.x, clickPoint.y]);
      if (polygonSubMode === 'outline') {
        insertPointAt(insertIndex, lngLat.lng, lngLat.lat);
      } else {
        insertFloorPointAt(insertIndex, lngLat.lng, lngLat.lat);
      }
    },
    [getDistanceToSegment, insertPointAt, insertFloorPointAt, points, floorPoints, facilityMode, polygonSubMode],
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

  const floorPolygonFeature = useMemo<PolygonFeature>(() => {
    if (floorPoints.length < 3) return null;

    const ring = floorPoints.map((point) => [point.longitude, point.latitude]);
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
  }, [floorPoints, selectedColor]);

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

    let polygonToUse = polygonFeature;

    // 1階があれば、外枠ポリゴンと1階ポリゴンをMultiPolygonで統合
    if (polygonFeature && floorPolygonFeature) {
      const outerRing = (polygonFeature.geometry as Polygon).coordinates[0];
      const floorRing = (floorPolygonFeature.geometry as Polygon).coordinates[0];

      polygonToUse = {
        type: 'Feature',
        properties: {
          color: selectedColor,
        },
        geometry: {
          type: 'MultiPolygon',
          coordinates: [[outerRing], [floorRing]],
        },
      } as any;
    }

    const features = polygonToUse ? [polygonToUse, ...pointFeatures] : pointFeatures;

    return {
      type: 'FeatureCollection',
      features,
    };
  }, [points, polygonFeature, floorPolygonFeature, selectedColor]);

  const generateEntrancesGeoJSON = useCallback((): FeatureCollection => {
    const entranceFeatures: Feature<Point>[] = entrances.map((entrance) => ({
      type: 'Feature',
      properties: {
        id: entrance.id,
        timestamp: entrance.timestamp,
        rotation: entrance.rotation,
        width: entrance.width,
        type: 'entrance',
      },
      geometry: {
        type: 'Point',
        coordinates: [entrance.longitude, entrance.latitude],
      },
    }));

    return {
      type: 'FeatureCollection',
      features: entranceFeatures,
    };
  }, [entrances]);

  const copyToClipboard = useCallback(async () => {
    const geojson = generateGeoJSON();
    const json = JSON.stringify(geojson, null, 2);
    await navigator.clipboard.writeText(json);
  }, [generateGeoJSON]);

  const copyEntrancesToClipboard = useCallback(async () => {
    const geojson = generateEntrancesGeoJSON();
    const json = JSON.stringify(geojson, null, 2);
    await navigator.clipboard.writeText(json);
  }, [generateEntrancesGeoJSON]);

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
      const newPoints: FacilityPoint[] = pointFeatures.map((feature) => {
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
      errorToast('GeoJSONの貼り付けに失敗しました。正しいGeoJSON形式か確認してください。');
    }
  }, []);

  const pasteEntrancesFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();

      const geojson: FeatureCollection = JSON.parse(text);

      if (!geojson.features || !Array.isArray(geojson.features)) {
        throw new Error('Invalid GeoJSON format');
      }

      // 出入り口フィーチャーのみを抽出
      const entranceFeatures = geojson.features.filter(
        (feature) => feature.geometry.type === 'Point' && feature.properties?.type === 'entrance',
      );

      if (entranceFeatures.length === 0) {
        throw new Error('No entrance features found in GeoJSON');
      }

      // 新しい出入り口を復元
      const newEntrances: Entrance[] = entranceFeatures.map((feature) => {
        const coords = (feature.geometry as Point).coordinates;
        const props = feature.properties || {};
        return {
          id: `entrance-${Date.now()}-${Math.random()}`,
          longitude: coords[0],
          latitude: coords[1],
          rotation: props.rotation || 0,
          width: props.width || 2,
          timestamp: Date.now(),
        };
      });

      setEntrances(newEntrances);
      setSelectedEntranceId(null);
    } catch (error) {
      console.error('Failed to paste entrances GeoJSON:', error);
      errorToast('出入り口GeoJSONの貼り付けに失敗しました。正しいGeoJSON形式か確認してください。');
    }
  }, []);

  const panel = (
    <GeoJSONPanel
      points={points}
      floorPoints={floorPoints}
      entrances={entrances}
      facilityMode={facilityMode}
      polygonSubMode={polygonSubMode}
      onChangeFacilityMode={setFacilityMode}
      onChangePolygonSubMode={setPolygonSubMode}
      onClear={clearPoints}
      onClearFloor={clearFloorPoints}
      onClearEntrances={clearEntrances}
      onCopy={copyToClipboard}
      onPaste={pasteFromClipboard}
      onCopyEntrances={copyEntrancesToClipboard}
      onPasteEntrances={pasteEntrancesFromClipboard}
      selectedColor={selectedColor}
      onSelectColor={setSelectedColor}
    />
  );
  const facilityPolygon = (
    <>
      <MarkerPoints
        points={points}
        selectedPointId={polygonSubMode === 'outline' ? selectedPointId : null}
        onSelectPoint={polygonSubMode === 'outline' ? setSelectedPointId : () => {}}
        onRemovePoint={removePoint}
        onUpdatePoint={updatePoint}
      />
      <MarkerPoints
        points={floorPoints}
        selectedPointId={polygonSubMode === 'floor' ? selectedFloorPointId : null}
        onSelectPoint={polygonSubMode === 'floor' ? setSelectedFloorPointId : () => {}}
        onRemovePoint={removeFloorPoint}
        onUpdatePoint={updateFloorPoint}
        markerColor="#4444ff"
      />
      <FacilityPolygon polygonFeature={polygonFeature} selectedColor={selectedColor} />
      <FacilityPolygon polygonFeature={floorPolygonFeature} selectedColor={selectedColor} isDashedLine={true} />
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
    floorPoints,
    entrances,
    polygonFeature,
    floorPolygonFeature,
    selectedColor,
    selectedPointId,
    selectedFloorPointId,
    selectedEntranceId,
    facilityMode,
    polygonSubMode,

    handleMapContextMenu,
    handleMapClick,

    // floor operations
    addFloorPoint,
    removeFloorPoint,
    updateFloorPoint,
    clearFloorPoints,

    // entrance operations
    addEntrance,
    removeEntrance,
    updateEntrance,

    // setters
    setPolygonSubMode,
    setSelectedPointId,
    setSelectedFloorPointId,
    setSelectedEntranceId,

    // components
    panel,
    facilityPolygon,
    entranceMarkers,
  };
};
