import { RouteIcon } from '@/components/Icons';
import styles from './index.module.scss';
import IconButton from '@/components/IconButton';
import { GeoJSONFacilities } from '@/types/facilities';
import { useCallback } from 'react';
import { useDestinationId, useRouteLoading } from '@/hooks/useRoute';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import Spinner from '@/components/Spinner';

interface Props {
  facility: GeoJSONFacilities;
}

export default function FacilityDataHeader({ facility }: Props) {
  const [destinationId, setDestinationId] = useDestinationId();
  const isLoading = useRouteLoading();

  const handleClickRoute = useCallback(() => {
    if (facility?.id) setDestinationId(facility.id);
  }, [facility?.id, setDestinationId]);

  useKeyboardShortcut({
    onRouteSearch: () => handleClickRoute(),
  });

  return (
    <h2 className={styles.header}>
      <span className={styles.name}>{facility.name}</span>
      <IconButton
        icon={isLoading ? <Spinner className={styles.icon} /> : <RouteIcon className={styles.icon} />}
        onClick={handleClickRoute}
        className={styles.routeButton}
        data-active={destinationId === facility.id}
      >
        経路案内
      </IconButton>
    </h2>
  );
}
