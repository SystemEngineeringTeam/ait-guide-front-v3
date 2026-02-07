'use client';

import styles from './index.module.scss';
import { useDestinationId } from '@/hooks/useRoute';
import { ArrowRightIcon, ClearIcon } from '@/components/Icons';
import IconButton from '@/components/IconButton';
import { FACILITIES_MAP } from '@/consts/facilities';

export default function RouteSummary() {
  const [destinationId, setDestinationId] = useDestinationId();
  const destination = destinationId && FACILITIES_MAP[destinationId];

  if (destination == null) return null;

  return (
    <div className={styles.wrapprt}>
      <div className={styles.routeSummary}>
        <IconButton
          icon={<ClearIcon className={styles.icon} />}
          className={styles.closeButton}
          onClick={() => setDestinationId(null)}
        />
        <span>現在地</span>
        <ArrowRightIcon />
        <span>{destination.name}</span>
      </div>
    </div>
  );
}
