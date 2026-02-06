import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useRef } from 'react';
import { useOverlay } from './useOverlay';
import { useRouter } from 'next/navigation';
import { useBottomSheetOpen } from './useBottomSheet';
import { useFlyToFacility } from './useFlyTo';

const selectedFacilityIdAtom = atom<string | undefined>(undefined);

export function useSelectedFacilityId() {
  const id = useAtomValue(selectedFacilityIdAtom);
  const setId = useSetSelectedFacilityId();
  return [id, setId] as const;
}

export function useSelectedFacilityIdValue() {
  return useAtomValue(selectedFacilityIdAtom);
}

export function useSetSelectedFacilityId() {
  const set = useSetAtom(selectedFacilityIdAtom);
  const { close: closeOverlay } = useOverlay();
  const router = useRouter();
  const openBottomSheet = useBottomSheetOpen();
  const flyTo = useFlyToFacility();

  const setSelectedFacilityId = useCallback(
    (id: string | undefined) => {
      set(id);
      router.push('/');
      openBottomSheet();
      closeOverlay();
      if (id) flyTo(id);
    },
    [set, router, openBottomSheet, closeOverlay, flyTo],
  );

  return setSelectedFacilityId;
}

export function useSelectedFacilityIdEvent(onChange: (id: string | undefined) => void) {
  const selectedFacilityId = useSelectedFacilityIdValue();
  const prevFacilityIdRef = useRef<string | undefined>(undefined);

  if (prevFacilityIdRef.current !== selectedFacilityId) {
    prevFacilityIdRef.current = selectedFacilityId;
    onChange(selectedFacilityId);
  }
}
