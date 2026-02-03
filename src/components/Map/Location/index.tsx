import styles from './index.module.scss';
import { GeoLocationCoordinates } from '@/hooks/useGeoLocation';
import { Marker } from 'react-map-gl/maplibre';

interface Props {
  coord: GeoLocationCoordinates;
}

export default function Location({ coord }: Props) {
  return (
    <>
      <Marker longitude={coord.longitude} latitude={coord.latitude} color="red">
        <div className={styles.location}></div>
      </Marker>
    </>
  );
}
