'use client';

import Button from '@/components/Button';
import { pickupFacilityIdAtom } from '@/stores/pickupAtom';
import { searchFocusAtom, searchResultsAtom } from '@/stores/searchAtom';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import styles from './index.module.scss';

export default function SearchResults() {
  const searchResults = useAtomValue(searchResultsAtom);
  const [isFocus, setFocus] = useAtom(searchFocusAtom);
  const setPickup = useSetAtom(pickupFacilityIdAtom);
  const router = useRouter();

  const selectFacility = useCallback(
    (facilityId: number) => {
      setFocus(false);
      setPickup(facilityId);
      router.push('/');
    },
    [router, setFocus, setPickup],
  );

  return (
    <section className={styles.searchResults} id="search-results" data-focus={isFocus}>
      <h2>検索結果</h2>

      <div className={styles.group} data-hidden={searchResults.secret.length === 0}>
        <h3>シークレット</h3>
        <div className={styles.buttons}>
          {searchResults.secret.map((s) => (
            <Button className={styles.button} type="button" key={s.id} onClick={s.event}>
              {s.word}
            </Button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <h3>教室</h3>
        <div className={styles.buttons}>
          {searchResults.room.length === 0 && <p>なし</p>}
          {searchResults.room.map((r) => (
            <Button
              className={styles.button}
              type="button"
              key={r.id}
              onClick={() => {
                selectFacility(r.facilityId);
              }}
            >
              {r.room}
            </Button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <h3>建物</h3>
        <div className={styles.buttons}>
          {searchResults.facility.length === 0 && <p>なし</p>}
          {searchResults.facility.map((f) => (
            <Button
              className={styles.button}
              type="button"
              key={f.id}
              onClick={() => {
                selectFacility(f.id);
              }}
            >
              {f.name}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
