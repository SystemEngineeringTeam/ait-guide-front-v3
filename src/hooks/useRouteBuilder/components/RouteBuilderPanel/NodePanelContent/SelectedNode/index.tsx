'use client';

import styles from './index.module.scss';
import { useSelectedNodeValue } from '../../../../hooks/useSelectedTarget';
import PanelButton from '@/components/PanelButton';
import { useNodesSetter } from '@/hooks/useRouteBuilder/hooks/useNodes';
import type { RouteNodeId, RouteNodeType } from '@/hooks/useRouteBuilder/types/route';
import { TYPE_NAMES } from '@/hooks/useRouteBuilder/consts/routeMode';

export default function SelectedNode() {
  const selectedNode = useSelectedNodeValue();
  const { changeNodeType, removeNode } = useNodesSetter();

  const handleChangeNodeType = (nodeId: RouteNodeId, type: RouteNodeType) => () => {
    changeNodeType(nodeId, type);
  };

  const handleRemoveNode = (nodeId: RouteNodeId) => () => {
    removeNode(nodeId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttons}>
        {selectedNode &&
          TYPE_NAMES.map((type) => (
            <PanelButton
              key={type.type}
              selected={selectedNode.type === type.type}
              onClick={handleChangeNodeType(selectedNode.id, type.type)}
            >
              {TYPE_NAMES.find((t) => t.type === type.type)?.name || type.type}
            </PanelButton>
          ))}
      </div>

      {selectedNode && (
        <PanelButton emoji="🗑️" onClick={handleRemoveNode(selectedNode.id)} danger>
          ノード削除
        </PanelButton>
      )}

      {!selectedNode && <div>ノードを選択してください</div>}
    </div>
  );
}
