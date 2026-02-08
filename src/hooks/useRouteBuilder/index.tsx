import { useState, useCallback, useMemo, useEffect, type MouseEvent } from 'react';
import { type MapRef } from 'react-map-gl/maplibre';
import { HandleMapClickFn, HandleMapContextMenuFn } from '@/components/Map';
import RoadMarkerPoints from './components/RoadMarkerPoints/index';
import RoadPanel from './components/RoadPanel/index';
import RoadLines from './components/RoadLines/index';
import { errorToast, infoToast } from '@/utils/toast';

export type PointType = 'facility' | 'entrance' | 'point';

export interface RoadPoint {
  id: string;
  lat: number;
  lng: number;
  type: PointType;
  name?: string;
  timestamp: number;
}

export interface RouteOptions {
  mainRoute?: boolean;
  stair?: boolean;
  elevator?: boolean;
  backroad?: boolean;
}

export interface Road {
  id: string;
  pointIds: string[];
  options: RouteOptions;
  timestamp: number;
}

interface StoredData {
  points: RoadPoint[];
  roads: Road[];
}

const DB_NAME = 'RoadBuilder';
const STORE_NAME = 'data';
const DB_KEY = 'roadData';

let db: IDBDatabase | null = null;

const initDB = async (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const database = request.result;
      resolve(database);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };
  });
};

const loadFromDB = async (): Promise<StoredData> => {
  if (!db) {
    db = await initDB();
  }

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(DB_KEY);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const result = request.result as StoredData | undefined;
      resolve(result || { points: [], roads: [] });
    };
  });
};

const saveToDB = async (data: StoredData): Promise<void> => {
  if (!db) {
    db = await initDB();
  }

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(data, DB_KEY);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const useRouteBuilder = () => {
  const [points, setPoints] = useState<RoadPoint[]>([]);
  const [roads, setRoads] = useState<Road[]>([]);
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [dataMode, setDataMode] = useState<'points' | 'roads'>('points');
  const [pointAddMode, setPointAddMode] = useState<PointType>('point');
  const [lastSelectedPointId, setLastSelectedPointId] = useState<string | null>(null);

  // Initialize from IndexedDB
  useEffect(() => {
    const initializeData = async () => {
      try {
        const storedData = await loadFromDB();
        setPoints(storedData.points);
        setRoads(storedData.roads);
      } catch (error) {
        console.error('Failed to load data from IndexedDB:', error);
        errorToast('IndexedDBからのデータ読み込みに失敗しました。');
      }
    };

    initializeData();
  }, []);

  // Save to IndexedDB whenever data changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await saveToDB({ points, roads });
      } catch (error) {
        console.error('Failed to save data to IndexedDB:', error);
        errorToast('IndexedDBへのデータ保存に失敗しました。');
      }
    };

    saveData();
  }, [points, roads]);

  const createPoint = useCallback((lng: number, lat: number, type: PointType = 'point') => {
    return {
      id: `point-${Date.now()}-${Math.random()}`,
      lng,
      lat,
      type,
      timestamp: Date.now(),
    } as RoadPoint;
  }, []);

  const isFacilityOrEntrance = (type?: PointType) => type === 'facility' || type === 'entrance';
  const shouldSkipAutoConnect = (prevType?: PointType, nextType?: PointType) => {
    return isFacilityOrEntrance(prevType) && isFacilityOrEntrance(nextType);
  };

  const addPoint = useCallback(
    (lng: number, lat: number, type: PointType = 'point') => {
      const newPoint = createPoint(lng, lat, type);
      setPoints((prev) => [...prev, newPoint]);

      // If there was a previously selected point, create a road connecting them
      setLastSelectedPointId((prevId) => {
        if (prevId) {
          const prevPoint = points.find((point) => point.id === prevId);
          if (shouldSkipAutoConnect(prevPoint?.type, newPoint.type)) {
            return newPoint.id;
          }
          // Create road between previous point and new point
          const newRoad: Road = {
            id: `road-${Date.now()}-${Math.random()}`,
            pointIds: [prevId, newPoint.id],
            options: {},
            timestamp: Date.now(),
          };
          setRoads((prev) => [...prev, newRoad]);
        }
        return newPoint.id;
      });

      return newPoint;
    },
    [createPoint, points],
  );

  const removePoint = useCallback((id: string) => {
    setPoints((prev) => prev.filter((p) => p.id !== id));
    // Remove point from all roads
    setRoads((prev) =>
      prev
        .filter((road) => road.pointIds.length > 1)
        .map((road) => ({
          ...road,
          pointIds: road.pointIds.filter((pId) => pId !== id),
        })),
    );
    setLastSelectedPointId((prevId) => (prevId === id ? null : prevId));
  }, []);

  const updatePoint = useCallback((id: string, lng: number, lat: number, type?: PointType) => {
    setPoints((prev) => prev.map((point) => (point.id === id ? { ...point, lng, lat, ...(type && { type }) } : point)));
  }, []);

  const changePointType = useCallback((id: string, type: PointType) => {
    setPoints((prev) =>
      prev.map((point) => {
        if (point.id !== id) return point;
        if (type !== 'facility') {
          return { ...point, type, name: undefined };
        }
        return { ...point, type };
      }),
    );
  }, []);

  const updatePointName = useCallback((id: string, name: string) => {
    setPoints((prev) => prev.map((point) => (point.id === id ? { ...point, name } : point)));
  }, []);

  const clearPoints = useCallback(() => {
    setPoints([]);
    setRoads([]);
    setSelectedPointId(null);
    setLastSelectedPointId(null);
  }, []);

  const addRoad = useCallback((pointIds: string[], options: RouteOptions = {}) => {
    if (pointIds.length < 2) return null;

    const newRoad: Road = {
      id: `road-${Date.now()}-${Math.random()}`,
      pointIds,
      options,
      timestamp: Date.now(),
    };

    setRoads((prev) => [...prev, newRoad]);
    return newRoad;
  }, []);

  const removeRoad = useCallback((id: string) => {
    setRoads((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const updateRoad = useCallback((id: string, updates: Partial<Omit<Road, 'id' | 'timestamp'>>) => {
    setRoads((prev) => prev.map((road) => (road.id === id ? { ...road, ...updates } : road)));
  }, []);

  const handlePointClickForRoad = useCallback(
    (pointId: string) => {
      if (dataMode !== 'roads') return;

      // If there's a previously selected point, create a road
      setLastSelectedPointId((prevId) => {
        if (prevId && prevId !== pointId) {
          const prevPoint = points.find((point) => point.id === prevId);
          const nextPoint = points.find((point) => point.id === pointId);
          if (shouldSkipAutoConnect(prevPoint?.type, nextPoint?.type)) {
            return pointId;
          }
          // Create road between previous and current point
          const newRoad: Road = {
            id: `road-${Date.now()}-${Math.random()}`,
            pointIds: [prevId, pointId],
            options: {},
            timestamp: Date.now(),
          };
          setRoads((prev) => [...prev, newRoad]);
        }
        return pointId;
      });
      setSelectedPointId(pointId);
    },
    [dataMode, points],
  );

  const handleMapContextMenu: HandleMapContextMenuFn = useCallback(
    (mapRef: React.RefObject<MapRef | null>) => (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault();

      if (!mapRef.current) return;

      const canvas = mapRef.current.getCanvas();
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const lngLat = mapRef.current.unproject([x, y]);
      addPoint(lngLat.lng, lngLat.lat, pointAddMode);
    },
    [addPoint, pointAddMode],
  );

  const handleMapClick: HandleMapClickFn = useCallback(
    (mapRef: React.RefObject<MapRef | null>) => (e: MouseEvent<HTMLDivElement>) => {
      // Currently no special behavior needed
    },
    [],
  );

  const copyPointsToClipboard = useCallback(async () => {
    const data = JSON.stringify(points, null, 2);
    try {
      await navigator.clipboard.writeText(data);
      infoToast('ポイントデータをコピーしました');
    } catch (error) {
      console.error('Failed to copy:', error);
      errorToast('コピーに失敗しました');
    }
  }, [points]);

  const copyRoadsToClipboard = useCallback(async () => {
    const data = JSON.stringify(roads, null, 2);
    try {
      await navigator.clipboard.writeText(data);
      infoToast('経路データをコピーしました');
    } catch (error) {
      console.error('Failed to copy:', error);
      errorToast('コピーに失敗しました');
    }
  }, [roads]);

  const pastePointsFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const parsedPoints = JSON.parse(text) as RoadPoint[];

      if (!Array.isArray(parsedPoints)) {
        throw new Error('Invalid format');
      }

      const newPoints = parsedPoints.map((p) => ({
        ...p,
        id: `point-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
      }));

      setPoints(newPoints);
      setRoads([]);
      infoToast('ポイントデータを貼り付けました');
    } catch (error) {
      console.error('Failed to paste:', error);
      errorToast('貼り付けに失敗しました。正しいJSON形式か確認してください。');
    }
  }, []);

  const pasteRoadsFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const parsedRoads = JSON.parse(text) as Road[];

      if (!Array.isArray(parsedRoads)) {
        throw new Error('Invalid format');
      }

      const newRoads = parsedRoads.map((r) => ({
        ...r,
        id: `road-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
      }));

      setRoads(newRoads);
      infoToast('経路データを貼り付けました');
    } catch (error) {
      console.error('Failed to paste:', error);
      errorToast('貼り付けに失敗しました。正しいJSON形式か確認してください。');
    }
  }, []);

  const panel = (
    <RoadPanel
      points={points}
      roads={roads}
      dataMode={dataMode}
      pointAddMode={pointAddMode}
      onChangeDataMode={setDataMode}
      onChangePointAddMode={setPointAddMode}
      onCopyPoints={copyPointsToClipboard}
      onPastePoints={pastePointsFromClipboard}
      onCopyRoads={copyRoadsToClipboard}
      onPasteRoads={pasteRoadsFromClipboard}
      onClear={clearPoints}
    />
  );

  const markers = (
    <RoadMarkerPoints
      points={points}
      roads={roads}
      selectedPointId={selectedPointId}
      selectedForRoad={lastSelectedPointId}
      dataMode={dataMode}
      onSelectPoint={(id) => {
        if (id === null) {
          setSelectedPointId(null);
          return;
        }
        if (dataMode === 'roads') {
          handlePointClickForRoad(id);
        } else {
          setSelectedPointId(id);
        }
      }}
      onRemovePoint={removePoint}
      onUpdatePoint={updatePoint}
      onUpdatePointName={updatePointName}
      onChangePointType={changePointType}
    />
  );

  const lines = <RoadLines points={points} roads={roads} />;

  return {
    points,
    roads,
    selectedPointId,
    dataMode,
    pointAddMode,
    // Point operations
    addPoint,
    removePoint,
    updatePoint,
    updatePointName,
    changePointType,
    clearPoints,

    // Road operations
    addRoad,
    removeRoad,
    updateRoad,
    handlePointClickForRoad,

    // Map handlers
    handleMapContextMenu,
    handleMapClick,

    // Components
    panel,
    markers,
    lines,
  };
};
