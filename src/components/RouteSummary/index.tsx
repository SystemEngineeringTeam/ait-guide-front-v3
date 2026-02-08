'use client';

import styles from './index.module.scss';
import { useDestinationId, useRoute, useStartCoord } from '@/hooks/useRoute';
import { ArrowRightIcon, ClearIcon } from '@/components/Icons';
import IconButton from '@/components/IconButton';
import { FACILITIES_MAP } from '@/consts/facilities';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { useCallback, useState } from 'react';
import SearchOverlay from '@/components/SearchOverlay';
import type { SelectedFacilityId } from '@/hooks/useSelectedFacilityId';
import { useFlyTo, useFlyToFacility } from '@/hooks/useFlyTo';
import { useIsValidGeoLocation } from '@/hooks/useGeoLocation';
import { COORD_AIT_MAIN_GATE } from '@/consts/coords';
import { infoToast } from '@/utils/toast';
import { useSearchText } from '@/hooks/useSearch';
import { useOverlay } from '@/hooks/useOverlay';

export default function RouteSummary() {
  const flyToFacility = useFlyToFacility();
  const flyTo = useFlyTo();
  const { isOpen, open, close } = useOverlay('change');
  const [destinationId, setDestinationId] = useDestinationId();
  const [searchText, setSearchText] = useSearchText();
  const isValidLocation = useIsValidGeoLocation();
  const startCoord = useStartCoord();
  const route = useRoute();

  useKeyboardShortcut({
    onClear: () => setDestinationId(undefined),
  });

  const handleClickFrom = useCallback(() => {
    infoToast('開始地点をドラッグして変更できます');

    if (startCoord) flyTo(startCoord);
    else if (!isValidLocation) flyTo(COORD_AIT_MAIN_GATE);
    else if (route.length > 0) flyTo(route[0]);
  }, [startCoord, flyTo, route]);

  const handleClickTo = useCallback(() => {
    open();
  }, [open]);

  const handleClose = useCallback(() => {
    close();
  }, [close]);

  const handleSelectFacilityId = useCallback(
    (id: SelectedFacilityId) => {
      flyToFacility(id);
      setDestinationId(id);
      close();
    },
    [setDestinationId, close, flyToFacility],
  );

  const destination = destinationId && FACILITIES_MAP[destinationId];
  if (destination == null) return null;

  const from = startCoord ? '指定位置' : isValidLocation ? '現在地' : '正門';

  return (
    <div className={styles.wrapper}>
      <div className={styles.routeSummary}>
        <IconButton
          icon={<ClearIcon className={styles.icon} />}
          className={styles.closeButton}
          onClick={() => setDestinationId(undefined)}
        />
        <button className={styles.fromButton} onClick={handleClickFrom}>
          {from}
        </button>

        <ArrowRightIcon />

        <button className={styles.toButton} onClick={handleClickTo}>
          {destination.name}
        </button>
        <SearchOverlay
          overlayKey="change"
          isOpen={isOpen}
          close={handleClose}
          text={searchText}
          setText={setSearchText}
          selectedFacilityId={destinationId}
          setSelectedFacilityId={handleSelectFacilityId}
        />
      </div>
    </div>
  );
}
