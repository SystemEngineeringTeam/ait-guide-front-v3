'use client';

import styles from './index.module.scss';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { GEO_JSON_FACILITIES } from '@/consts/facilities';
import { GeoJSONFacilities } from '@/types/facilities';
import { FACILITY_TYPES } from '@/consts/facilityType';
import { useSelectedFacilityId } from '@/hooks/useSelectedFacilityId';
import { useOverlayClose } from '@/hooks/useOverlay';
import { useFlyToFacility } from '@/hooks/useFlyTo';
import { useBottomSheetOpen } from '@/hooks/useBottomSheet';
import { CLUTUAL_CLUBS, SPORTS_CLUBS } from '@/consts/clubs';

const GROUPED_FACILITY_MAP: GeoJSONFacilities[][] = FACILITY_TYPES.map((type) =>
  GEO_JSON_FACILITIES.filter((f) => f.type === type),
);

export default function FacilityList() {
  const [selectedId, setSelectedId] = useSelectedFacilityId();
  const openBottomSheet = useBottomSheetOpen();
  const closeOverlay = useOverlayClose();
  const router = useRouter();
  const flyTo = useFlyToFacility();

  const handleSelectFacility = useCallback(
    (id: string) => () => {
      setSelectedId(id);
      openBottomSheet();
      router.push('/');
      flyTo(id);
      closeOverlay();
    },
    [router, setSelectedId, flyTo, closeOverlay, openBottomSheet],
  );

  return (
    <section className={styles.facilityList}>
      <h2>施設一覧</h2>
      <div className={styles.container}>
        {GROUPED_FACILITY_MAP.map((g, i) => (
          <div key={i} className={styles.buttons}>
            {g.map((f) => (
              <Button
                type="button"
                key={f.id}
                className={styles.button}
                onClick={handleSelectFacility(f.id)}
                data-active={f.id === selectedId}
              >
                {f.name}
              </Button>
            ))}
          </div>
        ))}
      </div>

      <h2>クラブ一覧</h2>
      <div className={styles.container}>
        <div className={styles.buttons}>
          {CLUTUAL_CLUBS.map((clug) => (
            <Button
              type="button"
              key={clug.id}
              className={styles.button}
              onClick={clug.room && handleSelectFacility(clug.room.facilityId)}
              disabled={!clug.room}
            >
              {clug.name}
            </Button>
          ))}
        </div>
        <div className={styles.buttons}>
          {SPORTS_CLUBS.map((clug) => (
            <Button
              type="button"
              key={clug.id}
              className={styles.button}
              onClick={clug.room && handleSelectFacility(clug.room.facilityId)}
              disabled={!clug.room}
            >
              {clug.name}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
