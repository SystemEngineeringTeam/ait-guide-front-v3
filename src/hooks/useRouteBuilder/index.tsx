import EdgeLines from './components/EdgeLines';
import NodeMarkers from './components/NodeMarkers';
import RouteBuilderPanel from './components/RouteBuilderPanel';

export const useRouteBuilder = () => {
  const panel = <RouteBuilderPanel />;
  const nodeMarkers = <NodeMarkers />;
  const edgeLines = <EdgeLines />;

  return {
    // components
    panel,
    nodeMarkers,
    edgeLines,
  };
};
