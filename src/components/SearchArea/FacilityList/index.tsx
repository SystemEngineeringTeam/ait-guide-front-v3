'use client';

import Button from '@/components/Button';
import { GROUPED_FACILITY_MAP } from '@/const/facility';
import { pickupFacilityAtom, pickupFacilityIdAtom } from '@/stores/pickupAtom';
import { searchFocusAtom } from '@/stores/searchAtom';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import styles from './index.module.scss';

export default function FacilityList() {
  const [isFocus, setFocus] = useAtom(searchFocusAtom);
  const setPickup = useSetAtom(pickupFacilityIdAtom);
  const facility = useAtomValue(pickupFacilityAtom);
  const router = useRouter();

  const changePickup = useCallback(
    (facilityId: number) => {
      setFocus(false);
      setPickup(facilityId);
      router.push('/');
    },
    [router, setFocus, setPickup],
  );

  return (
    <section className={styles.facilitylist} id="facility-list" data-focus={isFocus}>
      <h2>施設一覧</h2>
      <div className={styles.container}>
        {GROUPED_FACILITY_MAP.map((g, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={i} className={styles.buttons}>
            {g.map((f) => (
              <Button
                type="button"
                key={f.id}
                className={styles.button}
                data-active={f.id === facility?.id}
                onClick={() => {
                  changePickup(f.id);
                }}
              >
                {f.name}
              </Button>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
