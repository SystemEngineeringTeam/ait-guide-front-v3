import { GEO_JSON_FACILITIES } from '@/consts/facilities';
import { FacilityId } from '@/consts/facilityId';
import { type Room, ROOMS } from '@/consts/room';
import { SECRETS } from '@/consts/secret';
import { toHankakuUpperCase } from '@/utils/convert';
import { entries, values } from '@/utils/object';
import { atom, useAtom, useAtomValue } from 'jotai';

export const searchAtom = atom('');
interface RoomWithFacilityId extends Room {
  facilityId: FacilityId;
}

const FLAT_ROOMS = entries(ROOMS)
  .flatMap(
    ([facilityId, building]) =>
      building &&
      values(building).map((room) => ({
        ...room,
        facilityId: facilityId as FacilityId,
      })),
  )
  .filter((r): r is RoomWithFacilityId => r != undefined);

export const searchResultsAtom = atom((get) => {
  const search = get(searchAtom);

  const resFacility = GEO_JSON_FACILITIES.filter((f) => {
    return (
      f.name.includes(toHankakuUpperCase(search)) ||
      f.candidate?.some((alias) => alias.includes(toHankakuUpperCase(search)))
    );
  });
  const resRoom = FLAT_ROOMS.filter((r) => {
    return r.room.includes(toHankakuUpperCase(search));
  });
  const resSecret = SECRETS.filter((s) => {
    return s.word.includes(toHankakuUpperCase(search));
  });

  return {
    facility: resFacility,
    room: resRoom,
    secret: resSecret,
  };
});

export function useSearchText() {
  return useAtom(searchAtom);
}

export function useSearchResults() {
  return useAtomValue(searchResultsAtom);
}
