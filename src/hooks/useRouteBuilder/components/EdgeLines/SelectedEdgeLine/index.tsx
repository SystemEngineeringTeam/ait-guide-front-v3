import styles from './index.module.scss';
import { useGetNodeFn } from '@/hooks/useRouteBuilder/hooks/useNodes';
import { RouteEdge } from '@/hooks/useRouteBuilder/types/route';
import { Coord } from '@/types/coord';
import { Marker } from 'react-map-gl/maplibre';

interface Props {
  edge: RouteEdge;
}

export default function SelectedEdgeMarker({ edge }: Props) {
  const getNode = useGetNodeFn();
  const originNode = getNode(edge.nodeIds[0]);
  const destinationNode = getNode(edge.nodeIds[1]);

  const center: Coord = [
    (originNode.coord[0] + destinationNode.coord[0]) / 2,
    (originNode.coord[1] + destinationNode.coord[1]) / 2,
  ];

  const rotation: number =
    -(
      Math.atan2(destinationNode.coord[1] - originNode.coord[1], destinationNode.coord[0] - originNode.coord[0]) * 180
    ) / Math.PI;

  return (
    <Marker draggable latitude={center[1]} longitude={center[0]} rotation={rotation}>
      <div className={styles.marker}>
        <div></div>
        <div></div>
      </div>
    </Marker>
  );
}
