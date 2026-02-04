'use client';

import styles from './index.module.scss';
import { default as GMap, ViewState, MapRef } from 'react-map-gl/maplibre';
import * as mapLib from 'maplibre-gl';
import { useGeoLocation } from '@/hooks/useGeoLocation';
import { useSearchParams } from 'next/navigation';
import { useCallback, useRef } from 'react';
import Location from './Location';
import AccuracyCircle from './AccuracyCircle';
import { getNumSearchParam } from '@/utils/searchParam';
import classNames from 'classnames';
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

export type HandleMapContextMenuFn = (
  mapRef: React.RefObject<MapRef | null>,
) => (e: React.MouseEvent<HTMLDivElement>) => void;

export type HandleMapClickFn = (
  mapRef: React.RefObject<MapRef | null>,
) => (e: React.MouseEvent<HTMLDivElement>) => void;

interface Props {
  children?: React.ReactNode;
  className?: string;
  handleMapContextMenu?: HandleMapContextMenuFn;
  handleMapClick?: HandleMapClickFn;

  maxPitch?: number;
  minZoom?: number;
  maxZoom?: number;
  initialViewState?: Partial<ViewState>;
}

export default function Map({
  children,
  className,
  handleMapContextMenu,
  handleMapClick,

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

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        return;
      }
      handleMapClick?.(mapRef)(e);
    },
    [handleMapClick],
  );

  return (
    <div
      className={classNames(styles.map, className)}
      onContextMenu={handleMapContextMenu?.(mapRef)}
      onClick={handleClick}
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
      >
        {/* 現在地表示 */}
        {coord && <Location coord={coord} />}
        {coord && <AccuracyCircle coord={coord} />}

        {children}
      </GMap>
    </div>
  );
}
