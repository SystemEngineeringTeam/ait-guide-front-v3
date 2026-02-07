import { Coord } from '@/types/coord';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { locationAtom } from './useGeoLocation';
import { toValidCoordinate } from '@/utils/convert';
import { ofetch } from 'ofetch';
import { errorToast, infoToast } from '@/utils/toast';
import { useCallback } from 'react';
import type { SelectedFacilityId } from './useSelectedFacilityId';
import type { FacilityId } from '@/consts/facilityId';

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

const destinationIdAtom = atom<SelectedFacilityId>(undefined);

export function useSetRouteDestinationId() {
  const [destinationId, setDestinationId_] = useAtom(destinationIdAtom);
  const location = useAtomValue(locationAtom);
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

      if (location == undefined) {
        errorToast('位置情報がありません');
        return;
      }

      const start = toValidCoordinate(location.latitude, location.longitude);
      const route = await fetchRoute(start, newDestinationId);
      setRoute(route);
    },
    [setDestinationId_, destinationId, location, setRoute],
  );

  return setDestinationId;
}

export function useDestinationIdValue() {
  return useAtomValue(destinationIdAtom);
}

export function useDestinationId() {
  const destinationId = useDestinationIdValue();
  const setDestinationId = useSetRouteDestinationId();

  return [destinationId, setDestinationId] as const;
}
