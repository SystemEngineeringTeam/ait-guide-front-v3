import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useRef } from 'react';
import { useOverlay } from './useOverlay';
import { useRouter } from 'next/navigation';
import { useBottomSheetOpen } from './useBottomSheet';
import { useFlyToFacility } from './useFlyTo';
import { FacilityId } from '@/consts/facilityId';

export type SelectedFacilityId = FacilityId | undefined;

const selectedFacilityIdAtom = atom<SelectedFacilityId>(undefined);

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
  const { close: closeOverlay } = useOverlay('search');
  const router = useRouter();
  const openBottomSheet = useBottomSheetOpen();
  const flyTo = useFlyToFacility();

  const setSelectedFacilityId = useCallback(
    (id: SelectedFacilityId) => {
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

export function useSelectedFacilityIdEvent(onChange: (id: SelectedFacilityId) => void) {
  const selectedFacilityId = useSelectedFacilityIdValue();
  const prevFacilityIdRef = useRef<SelectedFacilityId>(undefined);

  if (prevFacilityIdRef.current !== selectedFacilityId) {
    prevFacilityIdRef.current = selectedFacilityId;
    onChange(selectedFacilityId);
  }
}

export type SetSelectedFacilityIdFn = ReturnType<typeof useSetSelectedFacilityId>;
