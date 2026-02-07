import { Coord } from '@/types/coord';
import { atom, useAtomValue } from 'jotai';
import { locationAtom } from './useGeoLocation';
import { destinationIdAtom } from './useDestination';
import { toValidCoordinate } from '@/utils/convert';
import { ofetch } from 'ofetch';
import { errorToast, infoToast } from '@/utils/toast';

interface RouteResponse {
  route: { lat: number; lng: number }[] | null;
}

async function fetchRoute(location: Coord, destinationId: string): Promise<Coord[]> {
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

let isFirst = true;
const routeAtom = atom<Promise<Coord[]>>(async (get) => {
  const location = get(locationAtom);
  const destinationId = get(destinationIdAtom);

  if (isFirst && destinationId == undefined) return [];

  isFirst = false;

  if (location == undefined) {
    errorToast('位置情報がありません');
    return [];
  }
  if (destinationId == undefined) {
    errorToast('目的地が設定されていません');
    return [];
  }

  const start = toValidCoordinate(location.latitude, location.longitude);
  return await fetchRoute(start, destinationId);
});

export function useRoute() {
  return useAtomValue(routeAtom);
}
