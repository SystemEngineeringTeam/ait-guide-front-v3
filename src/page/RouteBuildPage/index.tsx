'use client';

import { GEO_JSON_FACILITIES } from '@/consts/facilities';
import styles from './index.module.scss';
import Map from '@/components/Map';
import FacilitiesPolygons from '@/components/FacilityPolygons';
import EntranceMarkers from '@/components/EntranceMarkers';
import FacilityNames from '@/components/FacilitiesNames';
import { GEO_JSON_PASSAGES } from '@/consts/passages';
import { GEO_JSON_ENTRANCES } from '@/consts/entrances';
import { useRouteBuilder } from '@/hooks/useRouteBuilder';
import { RouteEdgeId, RouteNodeId } from '@/hooks/useRouteBuilder/types/route';
import { ROUTE_EDGE_LINE_LAYER_ID, ROUTE_NODE_MARKER_LAYER_ID } from '@/consts/layerId';

export default function RouteBuildPage() {
  const {
    panel,
    nodeMarkers,
    edgeLines,
    addMiddleNode,
    handleMapContextMenu,
    clickFeature,
    handleClickNotFeature,
  } = useRouteBuilder();

  return (
    <>
      {panel}
      <Map<RouteNodeId | RouteEdgeId>
        className={styles.map}
        minZoom={16}
        maxZoom={24}
        dragRotate={false}
        featureTargets={['nodeId', 'edgeId']}
        interactiveLayerIds={[ROUTE_NODE_MARKER_LAYER_ID, ROUTE_EDGE_LINE_LAYER_ID]}
        onClickFeature={clickFeature}
        onMapContextMenu={handleMapContextMenu}
        onRightClickFeature={addMiddleNode}
        onClickNotFeature={handleClickNotFeature}
      >
        <FacilitiesPolygons facilities={[...GEO_JSON_FACILITIES, ...GEO_JSON_PASSAGES]} />
        <EntranceMarkers entrances={GEO_JSON_ENTRANCES} />
        <FacilityNames facilities={GEO_JSON_FACILITIES} />
        {edgeLines}
        {nodeMarkers}
      </Map>
    </>
  );
}
