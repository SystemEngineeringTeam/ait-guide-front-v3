import styles from './index.module.scss';
import { GEO_JSON_DATA } from '@/consts/buildings';

interface Props {
  id?: string;
}

export default function BuildingData({ id }: Props) {
  const building = GEO_JSON_DATA.find((b) => b.id === id);

  if (!building) {
    return <section className={styles.container}>Building not found</section>;
  }

  return (
    <section className={styles.container}>
      <h2>{building.name}</h2>
    </section>
  );
}
