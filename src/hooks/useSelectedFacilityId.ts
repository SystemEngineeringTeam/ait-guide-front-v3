import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';
import { useOverlay } from './useOverlay';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBottomSheetOpen } from './useBottomSheet';
import { useFlyToFacility } from './useFlyTo';
import { FacilityId } from '@/consts/facilityId';
import { isFacilityId } from '@/utils/facilityId';
import { setQueryParam } from '@/utils/queryParams';

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
      setQueryParam('toId', id);
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

export function useSyncSelectedFacilityIdWithQuery() {
  const id = useAtomValue(selectedFacilityIdAtom);
  const flyTo = useFlyToFacility();
  const set = useSetAtom(selectedFacilityIdAtom);
  const searchParams = useSearchParams();
  const openBottomSheet = useBottomSheetOpen();
  const initializedFromQueryRef = useRef(false);

  useEffect(() => {
    if (initializedFromQueryRef.current) return;
    initializedFromQueryRef.current = true;
    if (id) return;

    const toId = searchParams.get('toId');
    if (!isFacilityId(toId)) return;
    set(toId);
    setTimeout(() => {
      flyTo(toId);
    }, 500);
  }, [id, searchParams, set, flyTo]);

  useEffect(() => {
    if (!id) return;
    openBottomSheet();
  }, [id, openBottomSheet]);
}
