'use client';

import styles from './index.module.scss';
import { default as GMap, ViewState, MapRef, MapLayerMouseEvent } from 'react-map-gl/maplibre';
import * as mapLib from 'maplibre-gl';
import { useCallback, useRef } from 'react';
import classNames from 'classnames';
import 'maplibre-gl/dist/maplibre-gl.css';
import { GEO_JSON_DATA } from '@/consts/buildings';
import { COORD_AIT_CENTER } from '@/consts/coords';

const MIN_PITCH = 0 as const;
const MAX_PITCH = 0 as const;
const MAX_ZOOM = 18 as const;
const MIN_ZOOM = 16 as const;

const INIT_VIEW_STATE: Partial<ViewState> = {
  longitude: COORD_AIT_CENTER[0],
  latitude: COORD_AIT_CENTER[1],
  zoom: 17,
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

export type HandleHoverFeatureFn = (id: string | undefined) => void;

interface Props {
  children?: React.ReactNode;
  className?: string;
  ref?: React.RefObject<MapRef | null>;

  onMapContextMenu?: HandleMapContextMenuFn;
  onMapClick?: HandleMapClickFn;
  onClickFeature?: HandleClickFeatureFn;
  onHoverFeature?: HandleHoverFeatureFn;

  minPitch?: number;
  maxPitch?: number;
  minZoom?: number;
  maxZoom?: number;
  initialViewState?: Partial<ViewState>;
}

export default function Map({
  children,
  className,
  ref,

  onMapContextMenu,
  onMapClick,
  onClickFeature,
  onHoverFeature,

  minPitch = MIN_PITCH,
  maxPitch = MAX_PITCH,
  minZoom = MIN_ZOOM,
  maxZoom = MAX_ZOOM,
  initialViewState = INIT_VIEW_STATE,
}: Props) {
  const isMouseDownRef = useRef(false);
  const isDraggingRef = useRef(false);
  const innerRef = useRef<MapRef>(null);
  const mapRef = ref ?? innerRef;

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

      if (feature) {
        onHoverFeature?.(feature.layer.id);
        mapRef.current?.getCanvas().style.setProperty('cursor', 'pointer');
      } else {
        onHoverFeature?.(undefined);
        mapRef.current?.getCanvas().style.setProperty('cursor', 'grab');
      }
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
        minPitch={minPitch}
        maxPitch={maxPitch}
        maxZoom={maxZoom}
        minZoom={minZoom}
        onClick={handleClickFeature}
        onMouseMove={handleHoverFeature}
        interactiveLayerIds={GEO_JSON_DATA.map((b) => b.id).filter((id): id is string => id != undefined)}
      >
        {children}
      </GMap>
    </div>
  );
}
