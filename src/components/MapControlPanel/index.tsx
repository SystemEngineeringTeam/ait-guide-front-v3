import IconButton from '@/components/IconButton';
import { CompassIcon, LocationIcon, SchoolIcon } from '@/components/Icons';
import styles from './index.module.scss';
import { useCallback } from 'react';
import { type MapRef } from 'react-map-gl/maplibre';
import { GeoLocationCoordinates } from '@/hooks/useGeoLocation';
import { COORD_AIT_BUILDING_1 } from '@/consts/coords';

interface Props {
  mapRef: React.RefObject<MapRef | null>;
  coord: GeoLocationCoordinates | undefined;
  bearing: number;
}

export default function MapControlPanel({ mapRef, coord, bearing }: Props) {
  const handleLocationClick = useCallback(() => {
    if (mapRef.current && coord) {
      mapRef.current.flyTo({
        center: [coord.longitude, coord.latitude],
        zoom: 18,
        duration: 1000,
      });
    }
  }, [coord]);

  const handleSchoolClick = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: COORD_AIT_BUILDING_1,
        zoom: 18,
        duration: 1000,
      });
    }
  }, []);

  const handleCompassClick = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.resetNorth({ duration: 300 });
    }
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
