import { Coord } from '@/types/coord';
import { atom, useAtomValue } from 'jotai';
import { GeoLocationCoordinates, locationAtom } from './useGeoLocation';
import { selectedFacilityIdAtom } from './useSelectedFacilityId';

async function fetchRoute(location: GeoLocationCoordinates, facilityId: string): Promise<Coord[] | undefined> {
  if (!location) return undefined;

  const apiHost = process.env.NEXT_PUBLIC_API_URL;

  if (apiHost === undefined) {
    throw new Error('process.env.NEXT_PUBLIC_API_URL is undefined');
  }

  const url = new URL('/api/get/route', apiHost);
  url.searchParams.append('lat', location.latitude.toString());
  url.searchParams.append('lng', location.longitude.toString());
  url.searchParams.append('end', facilityId);

  const res = await fetch(url.toString())
    .then((res) => res.json())
    .then((data) => data as { route: Coord[] | null })
    .catch((_e) => undefined);

  if (!res || !res.route) return undefined;
  return res.route;
}

const routeAtom = atom<Promise<Coord[] | undefined>>(async (get) => {
  const location = get(locationAtom);
  const facilityId = get(selectedFacilityIdAtom);

  if (location == undefined || facilityId == undefined) return undefined;

  return await fetchRoute(location, facilityId);
});

export function useRoute() {
  return useAtomValue(routeAtom);
}
