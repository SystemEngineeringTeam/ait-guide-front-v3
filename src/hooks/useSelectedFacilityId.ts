import { atom, useAtom, useSetAtom } from 'jotai';

export const selectedFacilityIdAtom = atom<string | undefined>(undefined);

export function useSelectedFacilityId() {
  const [id, setId] = useAtom(selectedFacilityIdAtom);
  return [id, setId] as const;
}

export function useSetSelectedFacilityId() {
  return useSetAtom(selectedFacilityIdAtom);
}
