import { GEO_JSON_FACILITIES } from '@/consts/facilities';
import { ROOMS } from '@/consts/room';
import { SECRETS } from '@/consts/secret';
import { toHankakuUpperCase } from '@/utils/convert';
import { atom, useAtom, useAtomValue } from 'jotai';

export const searchAtom = atom('');

export const searchResultsAtom = atom((get) => {
  const search = get(searchAtom);

  const resFacility = GEO_JSON_FACILITIES.filter((f) => {
    return f.name.includes(toHankakuUpperCase(search));
  });
  const resRoom = ROOMS.filter((r) => {
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
