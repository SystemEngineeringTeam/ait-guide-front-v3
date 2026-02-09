'use client';

import styles from './index.module.scss';
import { useDestinationId, useRoute, useStartCoord } from '@/hooks/useRoute';
import { ArrowRightIcon, ClearIcon, LinkIcon } from '@/components/Icons';
import IconButton from '@/components/IconButton';
import { FACILITIES_MAP } from '@/consts/facilities';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { use, useCallback, useState } from 'react';
import SearchOverlay from '@/components/SearchOverlay';
import type { SelectedFacilityId } from '@/hooks/useSelectedFacilityId';
import { useFlyTo, useFlyToFacility } from '@/hooks/useFlyTo';
import { useIsValidGeoLocation } from '@/hooks/useGeoLocation';
import { COORD_AIT_MAIN_GATE } from '@/consts/coords';
import { errorToast, infoToast } from '@/utils/toast';
import { useSearchText } from '@/hooks/useSearch';
import { useOverlay } from '@/hooks/useOverlay';
import type { Coord } from '@/types/coord';

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
    // 指定位置がある場合
    if (startCoord) {
      flyTo(startCoord);
      return;
    }

    infoToast('開始地点をドラッグして変更できます');

    // 現在地が範囲外の場合
    if (!isValidLocation) flyTo(COORD_AIT_MAIN_GATE);
    // 現在地
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

  const copyLink = useCallback(
    (from: Coord, to: SelectedFacilityId) => () => {
      if (to == undefined) {
        errorToast('目的地が選択されていません');
        return;
      }

      const url = new URL('/share', window.location.href);
      url.searchParams.set('from', `${from[0].toFixed(5)},${from[1].toFixed(5)}`);
      url.searchParams.set('toId', to.toString());
      navigator.clipboard.writeText(url.toString());
      infoToast('共有リンクをコピーしました');
    },
    [],
  );

  const destination = destinationId && FACILITIES_MAP[destinationId];
  if (destination == null || route.length === 0) return null;

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

        <IconButton
          className={styles.linkButton}
          icon={<LinkIcon className={styles.link} />}
          onClick={copyLink(route[0], destinationId)}
        />
      </div>
    </div>
  );
}
