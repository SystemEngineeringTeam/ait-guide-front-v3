import IconButton from '@/components/IconButton';
import { CompassIcon, LocationIcon, SchoolIcon } from '@/components/Icons';
import styles from './index.module.scss';
import { useCallback } from 'react';
import { GeoLocationCoordinates } from '@/hooks/useGeoLocation';
import { COORD_AIT_BUILDING_1 } from '@/consts/coords';
import { useFlyTo } from '@/hooks/useFlyTo';
import { useResetNorth } from '@/hooks/useResetNorth';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';

interface Props {
  coord: GeoLocationCoordinates | undefined;
  bearing: number;
}

export default function MapControlPanel({ coord, bearing }: Props) {
  const flyTo = useFlyTo();
  const resetNorth = useResetNorth();

  useKeyboardShortcut({
    onReset: () => resetNorth(),
    onFlyToLocation: () => {
      if (coord) flyTo([coord.longitude, coord.latitude]);
    },
    onFlyToUniversity() {
      flyTo(COORD_AIT_BUILDING_1);
    },
  });

  const handleLocationClick = useCallback(() => {
    if (!coord) return;
    flyTo([coord.longitude, coord.latitude]);
  }, [coord]);

  const handleSchoolClick = useCallback(() => {
    flyTo(COORD_AIT_BUILDING_1);
  }, []);

  const handleCompassClick = useCallback(() => {
    resetNorth();
  }, []);

  return (
    <div className={styles.panel}>
      <IconButton icon={<LocationIcon />} onClick={handleLocationClick} disabled={!coord}></IconButton>
      <IconButton icon={<SchoolIcon />} onClick={handleSchoolClick}></IconButton>
      <IconButton
        icon={<CompassIcon className={styles.commpass} style={{ ['--bearing' as string]: `${-bearing + 135}deg` }} />}
        onClick={handleCompassClick}
        disabled={bearing === 0}
      ></IconButton>
    </div>
  );
}
