import { Coord } from '@/types/coord';
import { atom, useAtomValue } from 'jotai';
import { locationAtom } from './useGeoLocation';
import { destinationIdAtom } from './useDestination';
import { toValidCoordinate } from '@/utils/convert';
import { ofetch } from 'ofetch';

interface RouteResponse {
  route: { lat: number; lng: number }[] | null;
}

async function fetchRoute(location: Coord, destinationId: string): Promise<Coord[]> {
  if (!location) return [];

  try {
    const data = await ofetch<RouteResponse>(
      `/api/get/route?lat=${location[1]}&lng=${location[0]}&end=${destinationId}`,
    );
    return data.route?.map((p) => [p.lng, p.lat]) ?? [];
  } catch (e) {
    console.error('Failed to fetch route:', e);
    return [];
  }
}

const routeAtom = atom<Promise<Coord[]>>(async (get) => {
  const location = get(locationAtom);
  const destinationId = get(destinationIdAtom);

  if (location == undefined || destinationId == undefined) return [];

  const start = toValidCoordinate(location.latitude, location.longitude);
  return await fetchRoute(start, destinationId);
});

export function useRoute() {
  return useAtomValue(routeAtom);
}
