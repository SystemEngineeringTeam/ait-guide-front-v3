import { COORD_AIT_CENTER } from '@/consts/coords';
import { GEO_JSON_FACILITIES } from '@/consts/facilities';
import { Coord } from '@/types/coord';
import { center } from '@turf/center';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useRef } from 'react';

const coordAtom = atom<Coord>(COORD_AIT_CENTER);

export function useFlyTo() {
  return useSetAtom(coordAtom);
}

export function useFlyToFacility() {
  const setCoord = useSetAtom(coordAtom);

  return useCallback((id: string) => {
    const facility = GEO_JSON_FACILITIES.find((f) => f.id === id);
    if (!facility) return;
    const c = center(facility.data).geometry.coordinates;
    setCoord([c[0], c[1]]);
  }, []);
}

export function useFlyToEvent(onFlyTo: (coord: Coord) => void) {
  const coord = useAtomValue(coordAtom);
  const prevCoordRef = useRef<Coord>(coord);

  if (prevCoordRef.current !== coord) {
    prevCoordRef.current = coord;
    onFlyTo(coord);
  }
}
