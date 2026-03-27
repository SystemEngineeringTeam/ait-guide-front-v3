import Panel from '@/components/Panel';
import RouteModeSwitcher from './ModeSwitcher';
import EdgePanelContent from './EdgePanelContent';
import NodePanelContent from './NodePanelContent';

export default function RouteBuilderPanel() {
  return (
    <Panel title="RouteBuilder">
      <RouteModeSwitcher edgeMode={<EdgePanelContent />} nodeMode={<NodePanelContent />} />
    </Panel>
  );
}
