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
  const [selectedRoadId, setSelectedRoadId] = useState<string | null>(null);
  const [dataMode, setDataMode] = useState<'points' | 'roads'>('points');
  const [pointAddMode, setPointAddMode] = useState<PointType>('point');
  const [lastSelectedPointId, setLastSelectedPointId] = useState<string | null>(null);
  const [pointCounter, setPointCounter] = useState(0);
  const [roadCounter, setRoadCounter] = useState(0);

  // Initialize from IndexedDB
  useEffect(() => {
    const initializeData = async () => {
      try {
        const storedData = await loadFromDB();
        setPoints(storedData.points);
        setRoads(storedData.roads);

        // Update counters based on existing IDs to prevent duplicates
        if (storedData.points.length > 0) {
          const maxPointId = Math.max(...storedData.points.map((p) => parseInt(p.id, 10)));
          setPointCounter(maxPointId + 1);
        }
        if (storedData.roads.length > 0) {
          const maxRoadId = Math.max(...storedData.roads.map((r) => parseInt(r.id, 10)));
          setRoadCounter(maxRoadId + 1);
        }
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

  const createPoint = useCallback(
    (lng: number, lat: number, type: PointType = 'point') => {
      const newPoint = {
        id: pointCounter.toString(),
        lng,
        lat,
        type,
        timestamp: Date.now(),
      } as RoadPoint;
      setPointCounter((prev) => prev + 1);
      return newPoint;
    },
    [pointCounter],
  );

  const calculateRoadDistance = useCallback(
    (road: Road) => {
      const roadPoints = road.pointIds
        .map((pointId) => points.find((p) => p.id === pointId))
        .filter((p): p is RoadPoint => p !== undefined);
      if (roadPoints.length < 2) return null;

      let total = 0;
      for (let i = 1; i < roadPoints.length; i += 1) {
        const prev = roadPoints[i - 1];
        const next = roadPoints[i];
        const dx = next.lng - prev.lng;
        const dy = next.lat - prev.lat;
        total += Math.sqrt(dx * dx + dy * dy);
      }
      return total;
    },
    [points],
  );

  const addPoint = useCallback(
    (lng: number, lat: number, type: PointType = 'point') => {
      const newPoint = createPoint(lng, lat, type);
      setPoints((prev) => [...prev, newPoint]);

      // If there was a previously selected point, create a road connecting them
      setLastSelectedPointId((prevId) => {
        if (prevId) {
          const prevPoint = points.find((point) => point.id === prevId);
          // Create road between previous point and new point
          const newRoad: Road = {
            id: roadCounter.toString(),
            pointIds: [prevId, newPoint.id],
            options: {},
            timestamp: Date.now(),
          };
          setRoads((prev) => [...prev, newRoad]);
          setRoadCounter((prev) => prev + 1);
        }
        return newPoint.id;
      });

      return newPoint;
    },
    [createPoint, points, roadCounter],
  );

  const addPointToRoad = useCallback(
    (lng: number, lat: number, roadId: string) => {
      const road = roads.find((r) => r.id === roadId);
      if (!road) return null;

      const newPoint = createPoint(lng, lat, 'point');
      setPoints((prev) => [...prev, newPoint]);

      // Find the closest segment in the road and insert the point there
      const roadPoints = road.pointIds
        .map((pointId) => points.find((p) => p.id === pointId))
        .filter((p): p is RoadPoint => p !== undefined);

      if (roadPoints.length < 2) return newPoint;

      let minDistance = Infinity;
      let insertIndex = road.pointIds.length;

      // Calculate the closest segment
      for (let i = 1; i < roadPoints.length; i += 1) {
        const p1 = roadPoints[i - 1];
        const p2 = roadPoints[i];

        // Calculate perpendicular distance to the line segment
        const dx = p2.lng - p1.lng;
        const dy = p2.lat - p1.lat;
        const t = Math.max(0, Math.min(1, ((lng - p1.lng) * dx + (lat - p1.lat) * dy) / (dx * dx + dy * dy)));
        const closestLng = p1.lng + t * dx;
        const closestLat = p1.lat + t * dy;

        const distance = Math.sqrt((lng - closestLng) ** 2 + (lat - closestLat) ** 2);

        if (distance < minDistance) {
          minDistance = distance;
          insertIndex = i;
        }
      }

      // Insert the new point into the road
      setRoads((prev) =>
        prev.map((r) => {
          if (r.id !== roadId) return r;
          const newPointIds = [...r.pointIds];
          newPointIds.splice(insertIndex, 0, newPoint.id);
          return { ...r, pointIds: newPointIds };
        }),
      );

      return newPoint;
    },
    [createPoint, points, roads],
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

  const addRoad = useCallback(
    (pointIds: string[], options: RouteOptions = {}) => {
      if (pointIds.length < 2) return null;

      const newRoad: Road = {
        id: roadCounter.toString(),
        pointIds,
        options,
        timestamp: Date.now(),
      };

      setRoadCounter((prev) => prev + 1);
      setRoads((prev) => [...prev, newRoad]);
      return newRoad;
    },
    [roadCounter],
  );

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
          // Create road between previous and current point
          const newRoad: Road = {
            id: roadCounter.toString(),
            pointIds: [prevId, pointId],
            options: {},
            timestamp: Date.now(),
          };
          setRoads((prev) => [...prev, newRoad]);
          setRoadCounter((prev) => prev + 1);
        }
        return pointId;
      });
      setSelectedPointId(pointId);
    },
    [dataMode, points, roadCounter],
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
      // If a road is selected, add a point to it
      if (selectedRoadId && !mapRef.current) return;

      if (selectedRoadId && mapRef.current) {
        const canvas = mapRef.current.getCanvas();
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const lngLat = mapRef.current.unproject([x, y]);
        addPointToRoad(lngLat.lng, lngLat.lat, selectedRoadId);
        infoToast('経路に点を挿入しました');
      }
    },
    [selectedRoadId, addPointToRoad],
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
    const data = JSON.stringify(
      roads.map((road) => ({
        ...road,
        distance: calculateRoadDistance(road),
      })),
      null,
      2,
    );
    try {
      await navigator.clipboard.writeText(data);
      infoToast('経路データをコピーしました');
    } catch (error) {
      console.error('Failed to copy:', error);
      errorToast('コピーに失敗しました');
    }
  }, [roads, calculateRoadDistance]);

  const pastePointsFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const parsedPoints = JSON.parse(text) as RoadPoint[];

      if (!Array.isArray(parsedPoints)) {
        throw new Error('Invalid format');
      }

      const newPoints = parsedPoints.map((p, index) => ({
        ...p,
        id: (pointCounter + index).toString(),
        timestamp: Date.now(),
      }));

      setPointCounter((prev) => prev + newPoints.length);
      setPoints(newPoints);
      setRoads([]);
      infoToast('ポイントデータを貼り付けました');
    } catch (error) {
      console.error('Failed to paste:', error);
      errorToast('貼り付けに失敗しました。正しいJSON形式か確認してください。');
    }
  }, [pointCounter]);

  const pasteRoadsFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const parsedRoads = JSON.parse(text) as Array<Road & { distance?: number }>;

      if (!Array.isArray(parsedRoads)) {
        throw new Error('Invalid format');
      }

      const newRoads = parsedRoads.map((r, index) => {
        const { distance: _distance, ...rest } = r;
        return {
          ...rest,
          id: `road-${roadCounter + index}`,
          timestamp: Date.now(),
        };
      });

      setRoadCounter((prev) => prev + newRoads.length);
      setRoads(newRoads);
      infoToast('経路データを貼り付けました');
    } catch (error) {
      console.error('Failed to paste:', error);
      errorToast('貼り付けに失敗しました。正しいJSON形式か確認してください。');
    }
  }, [roadCounter]);

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

  const lines = (
    <RoadLines points={points} roads={roads} onSelectRoad={setSelectedRoadId} selectedRoadId={selectedRoadId} />
  );

  const selectedRoad = useMemo(() => {
    return roads.find((road) => road.id === selectedRoadId) || null;
  }, [roads, selectedRoadId]);

  const popupCoords = useMemo(() => {
    if (!selectedRoad) return null;
    const roadPoints = selectedRoad.pointIds
      .map((pointId) => points.find((p) => p.id === pointId))
      .filter((p): p is RoadPoint => p !== undefined);
    if (roadPoints.length === 0) return null;
    // 経路の中心点を計算
    const avgLng = roadPoints.reduce((sum, p) => sum + p.lng, 0) / roadPoints.length;
    const avgLat = roadPoints.reduce((sum, p) => sum + p.lat, 0) / roadPoints.length;
    return { longitude: avgLng, latitude: avgLat };
  }, [selectedRoad, points]);

  const selectedRoadDistance = useMemo(() => {
    if (!selectedRoad) return null;
    return calculateRoadDistance(selectedRoad);
  }, [selectedRoad, calculateRoadDistance]);

  const handleToggleMainRoute = useCallback(() => {
    if (!selectedRoadId || !selectedRoad) return;
    updateRoad(selectedRoadId, {
      options: {
        ...selectedRoad.options,
        mainRoute: !selectedRoad.options.mainRoute,
        backroad: false, // 本道を選択したら裏道を解除
      },
    });
  }, [selectedRoadId, selectedRoad, updateRoad]);

  const handleToggleBackroad = useCallback(() => {
    if (!selectedRoadId || !selectedRoad) return;
    updateRoad(selectedRoadId, {
      options: {
        ...selectedRoad.options,
        backroad: !selectedRoad.options.backroad,
        mainRoute: false, // 裏道を選択したら本道を解除
      },
    });
  }, [selectedRoadId, selectedRoad, updateRoad]);

  const handleToggleStair = useCallback(() => {
    if (!selectedRoadId || !selectedRoad) return;
    updateRoad(selectedRoadId, {
      options: {
        ...selectedRoad.options,
        stair: !selectedRoad.options.stair,
      },
    });
  }, [selectedRoadId, selectedRoad, updateRoad]);

  return {
    points,
    roads,
    selectedPointId,
    selectedRoadId,
    dataMode,
    pointAddMode,
    // Point operations
    addPoint,
    removePoint,
    updatePoint,
    updatePointName,
    changePointType,
    clearPoints,
    addPointToRoad,

    // Road operations
    addRoad,
    removeRoad,
    updateRoad,
    handlePointClickForRoad,
    setSelectedRoadId,

    // Map handlers
    handleMapContextMenu,
    handleMapClick,

    // Popup state
    popupCoords,
    selectedRoad,
    selectedRoadDistance,
    handleToggleMainRoute,
    handleToggleBackroad,
    handleToggleStair,

    // Components
    panel,
    markers,
    lines,
  };
};
