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

export default function RouteSummary() {
  const flyToFacility = useFlyToFacility();
  const flyTo = useFlyTo();
  const [isOpen, setIsOpen] = useState(false);
  const [destinationId, setDestinationId] = useDestinationId();
  const [searchText, setSearchText] = useState('');
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
    setIsOpen(true);
  }, [setIsOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleSelectFacilityId = useCallback(
    (id: SelectedFacilityId) => {
      flyToFacility(id);
      setDestinationId(id);
      setIsOpen(false);
    },
    [setDestinationId, setIsOpen, flyToFacility],
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
