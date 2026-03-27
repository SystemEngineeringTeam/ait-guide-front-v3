import EdgeLines from './components/EdgeLines';
import NodeMarkers from './components/NodeMarkers';
import RouteBuilderPanel from './components/RouteBuilderPanel';
import { useRouteController } from './hooks/useRouteController';

export const useRouteBuilder = () => {
  const {
    addMiddleNode,
    moveNode,
    removeNodeAndEdges,
    clickFeature,
    handleMapContextMenu,
    handleClickNotFeature,
  } = useRouteController();

  const panel = <RouteBuilderPanel />;
  const nodeMarkers = <NodeMarkers />;
  const edgeLines = <EdgeLines />;

  return {
    addMiddleNode,
    moveNode,
    removeNodeAndEdges,
    clickFeature,
    handleMapContextMenu,
    handleClickNotFeature,

    // components
    panel,
    nodeMarkers,
    edgeLines,
  };
};
