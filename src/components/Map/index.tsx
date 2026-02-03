'use client';

import styles from './index.module.scss';
import { default as GMap, ViewState, MapRef, Source, Layer } from 'react-map-gl/maplibre';
import * as mapLib from 'maplibre-gl';
import { useGeoLocation } from '@/hooks/useGeoLocation';
import { useGeoJSONBuilder } from '@/hooks/useGeoJSONBuilder';
import { useSearchParams } from 'next/navigation';
import { useRef, useCallback, type MouseEvent } from 'react';
import Location from './Location';
import AccuracyCircle from './AccuracyCircle';
import MarkerPoints from './MarkerPoints';
import GeoJSONPanel from './GeoJSONPanel';
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
  const {
    points,
    addPoint,
    removePoint,
    updatePoint,
    clearPoints,
    copyToClipboard,
    polygonFeature,
    selectedColor,
    setSelectedColor,
  } = useGeoJSONBuilder();

  const handleMapContextMenu = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault();

      if (!mapRef.current) return;

      const canvas = mapRef.current.getCanvas();
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const lngLat = mapRef.current.unproject([x, y]);
      addPoint(lngLat.lng, lngLat.lat);
    },
    [addPoint],
  );

  return (
    <div className={styles.map} onContextMenu={handleMapContextMenu}>
      <GMap
        ref={mapRef}
        mapLib={mapLib}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json"
        initialViewState={INIT_VIEW_STATE}
        maxPitch={MAX_PITCH}
        maxZoom={MAX_ZOOM}
        minZoom={MIN_ZOOM}
      >
        {coord && (
          <>
            <Location coord={coord} />
            <AccuracyCircle coord={coord} />
          </>
        )}
        <Source
          id="building-polygon"
          type="geojson"
          data={{
            type: 'FeatureCollection',
            features: polygonFeature ? [polygonFeature] : [],
          }}
        >
          <Layer
            id="building-fill"
            type="fill"
            paint={{
              'fill-color': selectedColor,
              'fill-opacity': 0.4,
            }}
          />
          <Layer
            id="building-outline"
            type="line"
            paint={{
              'line-color': selectedColor,
              'line-width': 2,
            }}
          />
        </Source>
        <MarkerPoints points={points} onRemovePoint={removePoint} onUpdatePoint={updatePoint} />
      </GMap>
      <GeoJSONPanel
        points={points}
        onClear={clearPoints}
        onCopy={copyToClipboard}
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
      />
    </div>
  );
}
