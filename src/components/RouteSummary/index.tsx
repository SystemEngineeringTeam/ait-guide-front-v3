'use client';

import styles from './index.module.scss';
import { useDestinationId } from '@/hooks/useRoute';
import { ArrowRightIcon, ClearIcon } from '@/components/Icons';
import IconButton from '@/components/IconButton';
import { FACILITIES_MAP } from '@/consts/facilities';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { useCallback, useState } from 'react';
import SearchOverlay from '@/components/SearchOverlay';
import type { SelectedFacilityId } from '@/hooks/useSelectedFacilityId';
import { useFlyToFacility } from '@/hooks/useFlyTo';
import { useIsValidGeoLocation } from '@/hooks/useGeoLocation';

export default function RouteSummary() {
  const flyTo = useFlyToFacility();
  const [isOpen, setIsOpen] = useState(false);
  const [destinationId, setDestinationId] = useDestinationId();
  const [searchText, setSearchText] = useState('');
  const isValidLocation = useIsValidGeoLocation();

  useKeyboardShortcut({
    onClear: () => setDestinationId(undefined),
  });

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleSelectFacilityId = useCallback(
    (id: SelectedFacilityId) => {
      flyTo(id);
      setDestinationId(id);
      setIsOpen(false);
    },
    [setDestinationId, setIsOpen],
  );

  const destination = destinationId && FACILITIES_MAP[destinationId];
  if (destination == null) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.routeSummary}>
        <IconButton
          icon={<ClearIcon className={styles.icon} />}
          className={styles.closeButton}
          onClick={() => setDestinationId(undefined)}
        />
        <span>{isValidLocation ? '現在地' : '正門'}</span>

        <ArrowRightIcon />

        <button className={styles.destinationButton} onClick={handleOpen}>
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
