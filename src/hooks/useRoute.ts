import { Coord } from '@/types/coord';
import { atom, useAtomValue } from 'jotai';
import { locationAtom } from './useGeoLocation';
import { destinationIdAtom } from './useDestination';
import { toValidCoordinate } from '@/utils/convert';
import { ofetch } from 'ofetch';

interface RouteResponse {
  route: { lat: number; lng: number }[];
}

async function fetchRoute(location: Coord, destinationId: string): Promise<Coord[]> {
  if (!location) return [];

  const apiHost = process.env.NEXT_PUBLIC_API_URL;

  if (apiHost === undefined) {
    throw new Error('process.env.NEXT_PUBLIC_API_URL is undefined');
  }

  const url = new URL('/api/get/route', apiHost);
  url.searchParams.append('lat', location[1].toString());
  url.searchParams.append('lng', location[0].toString());
  url.searchParams.append('end', destinationId);

  try {
    const data = await ofetch<RouteResponse>(url.toString());
    return data.route.map((p) => [p.lng, p.lat]);
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
