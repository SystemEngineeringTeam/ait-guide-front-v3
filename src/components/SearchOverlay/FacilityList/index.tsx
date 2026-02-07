'use client';

import styles from './index.module.scss';
import Button from '@/components/Button';
import { useCallback } from 'react';
import { GEO_JSON_FACILITIES } from '@/consts/facilities';
import { GeoJSONFacilities } from '@/types/facilities';
import { FACILITY_TYPES } from '@/consts/facilityType';
import type { SelectedFacilityId, SetSelectedFacilityIdFn } from '@/hooks/useSelectedFacilityId';
import { CLUTUAL_CLUBS, SPORTS_CLUBS } from '@/consts/clubs';
import type { FacilityId } from '@/consts/facilityId';

const GROUPED_FACILITY_MAP: GeoJSONFacilities[][] = FACILITY_TYPES.map((type) =>
  GEO_JSON_FACILITIES.filter((f) => f.type === type),
);

interface Props {
  selectedId: SelectedFacilityId;
  setSelectedId: SetSelectedFacilityIdFn;
}

export default function FacilityList({ selectedId, setSelectedId }: Props) {
  const handleSelectFacility = useCallback((id: FacilityId) => () => setSelectedId(id), [setSelectedId]);

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
