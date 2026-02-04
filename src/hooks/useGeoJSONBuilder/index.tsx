import { useState, useCallback, useMemo, type MouseEvent } from 'react';
import { Feature, FeatureCollection, Point, Polygon } from 'geojson';
import { type MapRef } from 'react-map-gl/maplibre';
import MarkerPoints from './components/MarkerPoints';
import BuildPolygon from './components/BuildPolygon';
import GeoJSONPanel from './components/GeoJSONPanel';
import { HandleMapContextMenuFn } from '@/components/Map';
import { BuildingFillColor, DEFAULT_COLOR } from '@/consts/colors';

export type PolygonFeature = Feature<Polygon> | null;

export interface BuildingPoint {
  id: string;
  longitude: number;
  latitude: number;
  timestamp: number;
}

export const useGeoJSONBuilder = () => {
  const [points, setPoints] = useState<BuildingPoint[]>([]);
  const [selectedColor, setSelectedColor] = useState<BuildingFillColor>(DEFAULT_COLOR);

  const addPoint = useCallback((longitude: number, latitude: number) => {
    const newPoint: BuildingPoint = {
      id: `point-${Date.now()}-${Math.random()}`,
      longitude,
      latitude,
      timestamp: Date.now(),
    };
    setPoints((prev) => [...prev, newPoint]);
    return newPoint;
  }, []);

  const removePoint = useCallback((id: string) => {
    setPoints((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updatePoint = useCallback((id: string, longitude: number, latitude: number) => {
    setPoints((prev) => prev.map((point) => (point.id === id ? { ...point, longitude, latitude } : point)));
  }, []);

  const clearPoints = useCallback(() => {
    setPoints([]);
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
      addPoint(lngLat.lng, lngLat.lat);
    },
    [addPoint],
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

    const features = polygonFeature ? [polygonFeature] : pointFeatures;

    return {
      type: 'FeatureCollection',
      features,
    };
  }, [points, polygonFeature]);

  const copyToClipboard = useCallback(async () => {
    const geojson = generateGeoJSON();
    const json = JSON.stringify(geojson, null, 2);

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(json);
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = json;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    await navigator.clipboard.writeText(textarea.value);
    document.body.removeChild(textarea);
  }, [generateGeoJSON]);

  const panel = (
    <GeoJSONPanel
      points={points}
      onClear={clearPoints}
      onCopy={copyToClipboard}
      selectedColor={selectedColor}
      onSelectColor={setSelectedColor}
    />
  );
  const buildPolygon = (
    <>
      <MarkerPoints points={points} onRemovePoint={removePoint} onUpdatePoint={updatePoint} />
      <BuildPolygon polygonFeature={polygonFeature} selectedColor={selectedColor} />
    </>
  );

  return {
    points,
    polygonFeature,
    selectedColor,

    handleMapContextMenu,

    // components
    panel,
    buildPolygon,
  };
};
