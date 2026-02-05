import IconButton from '@/components/IconButton';
import { RouteIcon } from '@/components/Icons';
import styles from './index.module.scss';
import { GEO_JSON_FACILITIES } from '@/consts/facilities';
import { useSetDestinationId } from '@/hooks/useDestination';
import { useCallback } from 'react';

interface Props {
  id?: string;
}

export default function FacilityData({ id }: Props) {
  const setDestination = useSetDestinationId();

  const facility = GEO_JSON_FACILITIES.find((f) => f.id === id);
  if (!facility) return null;

  const handleClickRoute = useCallback(() => {
    setDestination(facility.id);
  }, [facility.id, setDestination]);

  return (
    <section className={styles.container}>
      <h2 className={styles.header}>
        <span className={styles.name}>{facility.name}</span>
        <IconButton className={styles.button} icon={<RouteIcon />} onClick={handleClickRoute} />
      </h2>
    </section>
  );
}
