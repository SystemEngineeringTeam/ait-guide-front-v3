import { RouteIcon } from '@/components/Icons';
import styles from './index.module.scss';
import IconButton from '@/components/IconButton';
import { GeoJSONFacilities } from '@/types/facilities';
import { useCallback } from 'react';
import { useSetDestinationId } from '@/hooks/useDestination';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';

interface Props {
  facility: GeoJSONFacilities;
}

export default function FacilityDataHeader({ facility }: Props) {
  const setDestination = useSetDestinationId();

  const handleClickRoute = useCallback(() => {
    if (facility?.id) setDestination(facility.id);
  }, [facility?.id, setDestination]);

  useKeyboardShortcut({
    onRouteSearch: () => handleClickRoute(),
  });

  return (
    <h2 className={styles.header}>
      <span className={styles.name}>{facility.name}</span>
      <IconButton icon={<RouteIcon />} onClick={handleClickRoute}>
        経路案内
      </IconButton>
    </h2>
  );
}
