'use client';

import styles from './index.module.scss';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useSearchResults } from '@/hooks/useSearch';
import { useSelectedFacilityId } from '@/hooks/useSelectedFacilityId';
import { FACILITIES_MAP } from '@/consts/facilities';

export default function SearchResults() {
  const [selectedId, setSelectedId] = useSelectedFacilityId();
  const searchResults = useSearchResults();
  const router = useRouter();

  const handleSelectFacility = useCallback(
    (id: string) => () => {
      setSelectedId(id);
      router.push('/');
    },
    [router, setSelectedId],
  );

  return (
    <section className={styles.searchResults}>
      <h2>検索結果</h2>

      <div className={styles.group} data-hidden={searchResults.secret.length === 0}>
        <h3>シークレット</h3>
        <div className={styles.buttons}>
          {searchResults.secret.map((s) => (
            <Button className={styles.secretButtons} type="button" key={s.id} onClick={s.event}>
              {s.word}
            </Button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <h3>建物</h3>
        <div className={styles.buttons}>
          {searchResults.facility.length === 0 && <p>なし</p>}
          {searchResults.facility.map((f) => (
            <Button className={styles.facilityButtons} type="button" key={f.id} onClick={handleSelectFacility(f.id)}>
              {f.name}
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
              className={styles.roomButton}
              type="button"
              key={r.id}
              onClick={handleSelectFacility(r.facilityId)}
              data-active={r.facilityId === selectedId}
            >
              <span className={styles.facilityName}>{FACILITIES_MAP[r.facilityId].name}</span>
              <span className={styles.roomName}>{r.room}</span>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
