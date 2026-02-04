import styles from './index.module.scss';
import { GEO_JSON_FACILITIES } from '@/consts/facilities';

interface Props {
  id?: string;
}

export default function FacilityData({ id }: Props) {
  const facility = GEO_JSON_FACILITIES.find((f) => f.id === id);

  if (!facility || facility.type === 'passage') {
    return <section className={styles.container}>Facility not found</section>;
  }

  return (
    <section className={styles.container}>
      <h2>{facility.name}</h2>
    </section>
  );
}
