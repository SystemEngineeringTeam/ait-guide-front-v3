import styles from './index.module.scss';
import { GEO_JSON_FACILITIES } from '@/consts/facilities';
import FloorMaps from './FloorMaps';
import FacilityDataHeader from './FacilityDataHeader';

interface Props {
  id?: string;
}

export default function FacilityData({ id }: Props) {
  const facility = GEO_JSON_FACILITIES.find((f) => f.id === id);
  if (!facility) return null;

  return (
    <section className={styles.container}>
      <FacilityDataHeader facility={facility} />
      {facility.floorImages ? (
        <FloorMaps floorImages={facility.floorImages} key={id} />
      ) : (
        <p>フロアマップはありません</p>
      )}
    </section>
  );
}
