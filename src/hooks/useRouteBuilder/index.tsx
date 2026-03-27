import EdgeLines from './components/EdgeLines';
import NodeMarkers from './components/NodeMarkers';
import RouteBuilderPanel from './components/RouteBuilderPanel';
import { useRouteController } from './hooks/useRouteController';

export const useRouteBuilder = () => {
  const { addMiddleNode, moveNode, removeNodeAndEdges, handleFeatureClick, handleMapContextMenu, handleClickNotFeature } =
    useRouteController();

  const panel = <RouteBuilderPanel />;
  const nodeMarkers = <NodeMarkers />;
  const edgeLines = <EdgeLines />;

  return {
    addMiddleNode,
    moveNode,
    removeNodeAndEdges,
    handleFeatureClick,
    handleMapContextMenu,
    handleClickNotFeature,

    // components
    panel,
    nodeMarkers,
    edgeLines,
  };
};
