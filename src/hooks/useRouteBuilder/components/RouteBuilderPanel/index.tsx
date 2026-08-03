import styles from './index.module.scss';
import Panel from '@/components/Panel';
import RouteModeSwitcher from './ModeSwitcher';
import EdgePanelContent from './EdgePanelContent';
import NodePanelContent from './NodePanelContent';
import CSVExport from './CSVExport';
import EdgeRemove from './EdgeRemove';

export default function RouteBuilderPanel() {
  return (
    <Panel title="RouteBuilder" className={styles.container}>
      <RouteModeSwitcher edgeMode={<EdgePanelContent />} nodeMode={<NodePanelContent />} />
      <EdgeRemove />
      <CSVExport />
    </Panel>
  );
}
