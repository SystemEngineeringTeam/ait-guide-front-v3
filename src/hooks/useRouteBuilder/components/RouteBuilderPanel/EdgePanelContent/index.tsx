import { useSelectedEdgeValue } from '@/hooks/useRouteBuilder/hooks/useSelectedTarget';
import styles from './index.module.scss';
import SelectedEdge from './SelectedEdge';

export default function EdgePanelContent() {
  const selected = useSelectedEdgeValue();

  return (
    <div className={styles.container}>
      {selected && <SelectedEdge edge={selected} />}
    </div>
  );
}
