'use client';

import styles from './index.module.scss';
import { default as GMap, ViewState, MapRef, MapLayerMouseEvent } from 'react-map-gl/maplibre';
import * as mapLib from 'maplibre-gl';
import { useGeoLocation } from '@/hooks/useGeoLocation';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useRef } from 'react';
import Location from './Location';
import AccuracyCircle from './AccuracyCircle';
import { getNumSearchParam } from '@/utils/searchParam';
import classNames from 'classnames';
import 'maplibre-gl/dist/maplibre-gl.css';
import { GEO_JSON_DATA } from '@/consts/buildings';

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

export type HandleMapContextMenuFn = (
  mapRef: React.RefObject<MapRef | null>,
) => (e: React.MouseEvent<HTMLDivElement>) => void;

export type HandleMapClickFn = (
  mapRef: React.RefObject<MapRef | null>,
) => (e: React.MouseEvent<HTMLDivElement>) => void;

export type HandleClickFeatureFn = (id: string) => void;

export type HandleHoverFeatureFn = (id: string) => void;

interface Props {
  children?: React.ReactNode;
  className?: string;

  onMapContextMenu?: HandleMapContextMenuFn;
  onMapClick?: HandleMapClickFn;
  onClickFeature?: HandleClickFeatureFn;
  onHoverFeature?: HandleHoverFeatureFn;

  maxPitch?: number;
  minZoom?: number;
  maxZoom?: number;
  initialViewState?: Partial<ViewState>;
}

export default function Map({
  children,
  className,

  onMapContextMenu,
  onMapClick,
  onClickFeature,
  onHoverFeature,

  maxPitch = MAX_PITCH,
  minZoom = MIN_ZOOM,
  maxZoom = MAX_ZOOM,
  initialViewState = INIT_VIEW_STATE,
}: Props) {
  return (
    <Suspense>
      <InnerMap
        className={className}
        onMapContextMenu={onMapContextMenu}
        onMapClick={onMapClick}
        onClickFeature={onClickFeature}
        onHoverFeature={onHoverFeature}
        maxPitch={maxPitch}
        minZoom={minZoom}
        maxZoom={maxZoom}
        initialViewState={initialViewState}
      >
        {children}
      </InnerMap>
    </Suspense>
  );
}

function InnerMap({
  children,
  className,

  onMapContextMenu,
  onMapClick,
  onClickFeature,
  onHoverFeature,

  maxPitch = MAX_PITCH,
  minZoom = MIN_ZOOM,
  maxZoom = MAX_ZOOM,
  initialViewState = INIT_VIEW_STATE,
}: Props) {
  const mapRef = useRef<MapRef>(null);
  const isMouseDownRef = useRef(false);
  const isDraggingRef = useRef(false);
  const searchParams = useSearchParams();
  const coord = useGeoLocation({
    override: {
      latitude: getNumSearchParam(searchParams, 'lat'),
      longitude: getNumSearchParam(searchParams, 'lon'),
      accuracy: getNumSearchParam(searchParams, 'acc'),
    },
  });

  const handleMouseDown = useCallback(() => {
    isMouseDownRef.current = true;
    isDraggingRef.current = false;
  }, []);

  const handleMouseMove = useCallback(() => {
    if (!isMouseDownRef.current) return;
    isDraggingRef.current = true;
  }, []);

  const handleMouseUp = useCallback(() => {
    isMouseDownRef.current = false;
  }, []);

  const handleClickOuter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        return;
      }
      // PopupやMarker内からのクリックイベントを無視
      const target = e.target as HTMLElement;
      if (target.closest('.maplibregl-popup') || target.closest('.maplibregl-marker')) {
        return;
      }
      onMapClick?.(mapRef)(e);
    },
    [onMapClick],
  );

  const handleClickFeature = useCallback(
    (e: MapLayerMouseEvent) => {
      const feature = e.features?.[0];
      if (!feature) return;

      onClickFeature?.(feature.layer.id);
    },
    [onClickFeature],
  );

  const handleHoverFeature = useCallback(
    (e: MapLayerMouseEvent) => {
      const feature = e.features?.[0];
      if (!feature) return;

      onHoverFeature?.(feature.layer.id);
    },
    [onHoverFeature],
  );

  return (
    <div
      className={classNames(styles.map, className)}
      onContextMenu={onMapContextMenu?.(mapRef)}
      onClick={handleClickOuter}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <GMap
        ref={mapRef}
        mapLib={mapLib}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json"
        initialViewState={initialViewState}
        maxPitch={maxPitch}
        maxZoom={maxZoom}
        minZoom={minZoom}
        onClick={handleClickFeature}
        onMouseMove={handleHoverFeature}
        interactiveLayerIds={GEO_JSON_DATA.map((b) => b.id).filter((id): id is string => id != undefined)}
      >
        {/* 現在地表示 */}
        {coord && <Location coord={coord} />}
        {coord && <AccuracyCircle coord={coord} />}

        {children}
      </GMap>
    </div>
  );
}
