import EdgeLines from './components/EdgeLines';
import NodeMarkers from './components/NodeMarkers';
import RouteBuilderPanel from './components/RouteBuilderPanel';
import { useRouteController } from './hooks/useRoute';

export const useRouteBuilder = () => {
  const { addMiddleNode } = useRouteController();

  const panel = <RouteBuilderPanel />;
  const nodeMarkers = <NodeMarkers />;
  const edgeLines = <EdgeLines />;

  return {
    addMiddleNode,

    // components
    panel,
    nodeMarkers,
    edgeLines,
  };
};
