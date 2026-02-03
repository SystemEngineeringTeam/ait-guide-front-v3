'use client';

import styles from './index.module.scss';
import { default as GMap, ViewState, MapRef } from 'react-map-gl/maplibre';
import * as mapLib from 'maplibre-gl';
import { useGeoLocation } from '@/hooks/useGeoLocation';
import { useGeoJSONBuilder } from '@/hooks/useGeoJSONBuilder';
import { useSearchParams } from 'next/navigation';
import { useRef } from 'react';
import Location from './Location';
import AccuracyCircle from './AccuracyCircle';
import GeoJSONPanel from '../../hooks/useGeoJSONBuilder/components/GeoJSONPanel';
import { getNumSearchParam } from '@/utils/searchParam';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAX_PITCH = 85 as const;
const MAX_ZOOM = 18 as const;
const MIN_ZOOM = 16 as const;

const INIT_VIEW_STATE: Partial<ViewState> = {
  longitude: 137.1134981,
  latitude: 35.1839876,
  zoom: 16,
  pitch: 0,
  bearing: 0,
};

export default function Map() {
  const mapRef = useRef<MapRef>(null);
  const searchParams = useSearchParams();
  const coord = useGeoLocation({
    override: {
      latitude: getNumSearchParam(searchParams, 'lat'),
      longitude: getNumSearchParam(searchParams, 'lon'),
      accuracy: getNumSearchParam(searchParams, 'acc'),
    },
  });
  const { buildPolygon, panel: geoJSONBuilderPanel, handleMapContextMenu } = useGeoJSONBuilder();

  return (
    <div className={styles.map} onContextMenu={handleMapContextMenu(mapRef)}>
      <GMap
        ref={mapRef}
        mapLib={mapLib}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json"
        initialViewState={INIT_VIEW_STATE}
        maxPitch={MAX_PITCH}
        maxZoom={MAX_ZOOM}
        minZoom={MIN_ZOOM}
      >
        {/* 現在地表示 */}
        {coord && <Location coord={coord} />}
        {coord && <AccuracyCircle coord={coord} />}

        {/* GeoJSON Builder */}
        {buildPolygon}
      </GMap>

      {/* GeoJSON Builder */}
      {geoJSONBuilderPanel}
    </div>
  );
}
