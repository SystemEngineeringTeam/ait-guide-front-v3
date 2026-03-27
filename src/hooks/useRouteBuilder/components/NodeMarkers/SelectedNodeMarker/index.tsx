'use client';

import { RouteNode } from '@/hooks/useRouteBuilder/types/route';
import styles from './index.module.scss';
import { Marker, type MarkerDragEvent } from 'react-map-gl/maplibre';
import { useNodes } from '@/hooks/useRouteBuilder/hooks/useNodes';

interface Props {
  node: RouteNode;
}

export default function SelectedNodeMarker({ node }: Props) {
  const { moveNode } = useNodes();

  const handleDragStart = () => {};

  const handleDragEnd = (e: MarkerDragEvent) => {
    moveNode(node.uuid, [e.lngLat.lng, e.lngLat.lat]);
  };

  return (
    <Marker
      draggable
      latitude={node.coord[1]}
      longitude={node.coord[0]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.marker} data-type={node.type}></div>
    </Marker>
  );
}
