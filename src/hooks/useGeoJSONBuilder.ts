import { useState, useCallback, useMemo } from 'react';
import { Feature, FeatureCollection, Point, Polygon } from 'geojson';

export const BUILDING_FILL_COLORS = ['#c4d5ff', '#d0c4ff', '#ffe2c4', '#ffc4e2', '#ffc4c4', '#ff0000'] as const;

export type BuildingFillColor = (typeof BUILDING_FILL_COLORS)[number];

export interface BuildingPoint {
  id: string;
  longitude: number;
  latitude: number;
  timestamp: number;
}

export const useGeoJSONBuilder = () => {
  const [points, setPoints] = useState<BuildingPoint[]>([]);
  const [selectedColor, setSelectedColor] = useState<BuildingFillColor>(BUILDING_FILL_COLORS[0]);

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
    setPoints((prev) =>
      prev.map((point) => (point.id === id ? { ...point, longitude, latitude } : point)),
    );
  }, []);

  const clearPoints = useCallback(() => {
    setPoints([]);
  }, []);

  const polygonFeature = useMemo<Feature<Polygon> | null>(() => {
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
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }, [generateGeoJSON]);

  return {
    points,
    addPoint,
    removePoint,
    updatePoint,
    clearPoints,
    generateGeoJSON,
    copyToClipboard,
    polygonFeature,
    selectedColor,
    setSelectedColor,
  };
};
