import PanelButton from '@/components/PanelButton';
import styles from './index.module.scss';
import { useSelectedEdgeValue } from '@/hooks/useRouteBuilder/hooks/useSelectedTarget';
import { useEdgesSetter } from '@/hooks/useRouteBuilder/hooks/useEdges';

export default function EdgeRemove() {
  const selectedEdge = useSelectedEdgeValue();
  const { removeEdge } = useEdgesSetter();

  if (!selectedEdge) return null;

  return (
    <div className={styles.container}>
      <PanelButton emoji="🗑️" selected onClick={() => removeEdge(selectedEdge.uuid)} danger>
        エッジ削除
      </PanelButton>
    </div>
  );
}
