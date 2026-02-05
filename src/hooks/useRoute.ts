import { Coord } from '@/types/coord';
import { atom, useAtomValue } from 'jotai';
import { GeoLocationCoordinates, locationAtom } from './useGeoLocation';
import { selectedFacilityIdAtom } from './useSelectedFacilityId';

async function fetchRoute(location: GeoLocationCoordinates, facilityId: string): Promise<Coord[]> {
  if (!location) return [];

  const apiHost = process.env.NEXT_PUBLIC_API_URL;

  if (apiHost === undefined) {
    throw new Error('process.env.NEXT_PUBLIC_API_URL is undefined');
  }

  const url = new URL('/api/get/route', apiHost);
  url.searchParams.append('lat', location.latitude.toString());
  url.searchParams.append('lng', location.longitude.toString());
  url.searchParams.append('end', facilityId);

  try {
    const res = await fetch(url.toString());
    const data = (await res.json()) as { route: Coord[] | null };
    return data.route ?? [];
  } catch (e) {
    console.error('Failed to fetch route:', e);
    return [];
  }
}

const routeAtom = atom<Promise<Coord[]>>(async (get) => {
  const location = get(locationAtom);
  const facilityId = get(selectedFacilityIdAtom);

  if (location == undefined || facilityId == undefined) return [];

  return await fetchRoute(location, facilityId);
});

export function useRoute() {
  return useAtomValue(routeAtom);
}
