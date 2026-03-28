import { useEdgesValue } from './useEdges';
import { useGetNodeFn, useNodesValue } from './useNodes';

export const useCSVExport = () => {
  const nodes = useNodesValue();
  const edges = useEdgesValue();
  const getNode = useGetNodeFn();

  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const nodeHeader = 'id,lat,lng,type';
    const edgeHeader = 'id,node_id_from,node_id_target,distance,level,has_stairs,is_accessible,is_indoor';

    const nodeRows = nodes.map((node) => `${node.uuid},${node.coord[1]},${node.coord[0]},${node.type}`);
    const edgeRows = edges.map((edge) => {
      const nodeFrom = getNode(edge.nodeIds[0]);
      const nodeTo = getNode(edge.nodeIds[1]);

      const distance = Math.sqrt(
        Math.pow(nodeFrom.coord[0] - nodeTo.coord[0], 2) + Math.pow(nodeFrom.coord[1] - nodeTo.coord[1], 2),
      );
      return `${edge.uuid},${edge.nodeIds[0]},${edge.nodeIds[1]},${distance},${edge.level},${edge.hasStairs},${edge.isAccessible},${edge.isIndoor}`;
    });

    downloadCSV([nodeHeader, ...nodeRows].join('\n'), 'nodes.csv');
    downloadCSV([edgeHeader, ...edgeRows].join('\n'), 'edges.csv');
  };

  return exportCSV;
};
