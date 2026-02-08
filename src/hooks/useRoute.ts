import { Coord } from '@/types/coord';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { toValidCoordinate } from '@/utils/convert';
import { ofetch } from 'ofetch';
import { errorToast, infoToast } from '@/utils/toast';
import { useCallback } from 'react';
import type { SelectedFacilityId } from './useSelectedFacilityId';
import type { FacilityId } from '@/consts/facilityId';
import { MAX_LAT, MIN_LAT, MAX_LNG, MIN_LNG } from '@/consts/map';
import { useGeoLocationCoord } from './useGeoLocation';

interface RouteResponse {
  route: { lat: number; lng: number }[] | null;
}

async function fetchRoute(location: Coord, destinationId: FacilityId): Promise<Coord[]> {
  if (!location) return [];

  try {
    const data = await ofetch<RouteResponse>(
      `/api/get/route?lat=${location[1]}&lng=${location[0]}&end=${destinationId}`,
    );

    if (data.route == null) {
      errorToast('経路情報が見つかりませんでした');
      return [];
    }

    if (data.route.length === 1) {
      infoToast('目的地付近です');
      return [];
    }

    return data.route.map((p) => [p.lng, p.lat]);
  } catch (e) {
    console.error('Failed to fetch route:', e);
    errorToast('経路情報取得に失敗しました');
    return [];
  }
}

const routeAtom = atom<Coord[]>([]);

export function useRoute() {
  return useAtomValue(routeAtom);
}

const startCoordAtom = atom<Coord | undefined>(undefined);

export function useStartCoord() {
  return useAtomValue(startCoordAtom);
}

const destinationIdAtom = atom<SelectedFacilityId>(undefined);

export function useSetRouteDestinationId() {
  const [destinationId, setDestinationId_] = useAtom(destinationIdAtom);
  const location = useGeoLocationCoord();
  const startCoord = useAtomValue(startCoordAtom);
  const setRoute = useSetAtom(routeAtom);

  const setDestinationId = useCallback(
    async (newDestinationId: SelectedFacilityId) => {
      // 同じ目的地なら何もしない
      if (destinationId === newDestinationId) return;

      setDestinationId_(newDestinationId);

      if (newDestinationId == undefined) {
        setRoute([]);
        return;
      }

      // startCoord が設定されていれば使用、なければ現在位置を使用
      const start = startCoord || (location ? toValidCoordinate(location.latitude, location.longitude) : undefined);

      if (start == undefined) {
        errorToast('位置情報がありません');
        return;
      }

      const route = await fetchRoute(start, newDestinationId);
      setRoute(route);
    },
    [setDestinationId_, destinationId, location, startCoord, setRoute],
  );

  return setDestinationId;
}

export function useDestinationIdValue() {
  return useAtomValue(destinationIdAtom);
}

export function useSetStartCoord() {
  const setStartCoord = useSetAtom(startCoordAtom);
  const destinationId = useAtomValue(destinationIdAtom);
  const setRoute = useSetAtom(routeAtom);

  const updateStartCoord = useCallback(
    async (coord: Coord) => {
      // 座標を範囲内にクリップ (Coord は [lng, lat])
      const clippedCoord: Coord = [
        Math.max(MIN_LNG, Math.min(MAX_LNG, coord[0])),
        Math.max(MIN_LAT, Math.min(MAX_LAT, coord[1])),
      ];

      setStartCoord(clippedCoord);

      if (destinationId == undefined) {
        setRoute([]);
        return;
      }

      const fetchedRoute = await fetchRoute(clippedCoord, destinationId);
      const fullRoute = [clippedCoord, ...fetchedRoute];
      setRoute(fullRoute);
    },
    [setStartCoord, destinationId, setRoute],
  );

  return updateStartCoord;
}

export function useResetStartCoord() {
  const setStartCoord = useSetAtom(startCoordAtom);
  const setRoute = useSetAtom(routeAtom);

  const resetStartCoord = useCallback(() => {
    setStartCoord(undefined);
    setRoute([]);
  }, [setStartCoord, setRoute]);

  return resetStartCoord;
}

export function useDestinationId() {
  const destinationId = useDestinationIdValue();
  const setDestinationId = useSetRouteDestinationId();

  return [destinationId, setDestinationId] as const;
}
