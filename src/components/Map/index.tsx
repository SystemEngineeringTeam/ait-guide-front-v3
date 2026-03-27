'use client';

import styles from './index.module.scss';
import 'maplibre-gl/dist/maplibre-gl.css';
import { default as GMap, ViewState, MapRef, MapLayerMouseEvent, ViewStateChangeEvent } from 'react-map-gl/maplibre';
import * as mapLib from 'maplibre-gl';
import { useCallback, useRef } from 'react';
import classNames from 'classnames';
import { COORD_AIT_CENTER } from '@/consts/coords';
import { useFlyToEvent } from '@/hooks/useFlyTo';
import { useResetNorhEvent } from '@/hooks/useResetNorth';
import { FACILITY_POLYGON_FILL_LAYER_ID, FACILITY_POLYGON_LINE_LAYER_ID } from '@/consts/layerId';
import type { Coord } from '@/types/coord';

const MIN_PITCH = 0 as const;
const MAX_PITCH = 60 as const;
const MAX_ZOOM = 18 as const;
const MIN_ZOOM = 16 as const;

const INIT_VIEW_STATE: Partial<ViewState> = {
  longitude: COORD_AIT_CENTER[0],
  latitude: COORD_AIT_CENTER[1],
  zoom: 17,
  pitch: 0,
  bearing: 0,
};

export type HandleMapContextMenuFn = (coord: Coord, mapRef: MapRef) => void;
export type HandleMapClickFn = (e: React.MouseEvent<HTMLDivElement>, mapRef: MapRef) => void;
export type HandleClickFeatureFn<T extends string> = (id: T, featureTarget: string, coord: Coord) => void;
export type HandleClickNotFeatureFn = () => void;
export type HandleHoverFeatureFn = (id: string | undefined) => void;
export type HandleRotateFn = (bearing: number) => void;
export type HandleMoveFn = (viewState: ViewState) => void;

interface Props<T extends string = string> {
  children?: React.ReactNode;
  className?: string;

  onMapContextMenu?: HandleMapContextMenuFn;
  onMapClick?: HandleMapClickFn;
  onClickFeature?: HandleClickFeatureFn<T>;
  onRightClickFeature?: HandleClickFeatureFn<T>;
  onClickNotFeature?: HandleClickNotFeatureFn;
  onHoverFeature?: HandleHoverFeatureFn;
  onRotate?: HandleRotateFn;
  onMove?: HandleMoveFn;

  featureTargets?: string[];
  interactiveLayerIds?: string[];

  minPitch?: number;
  maxPitch?: number;
  minZoom?: number;
  maxZoom?: number;
  dragRotate?: boolean;
  initialViewState?: Partial<ViewState>;
}

export default function Map<T extends string = string>({
  children,
  className,

  onMapContextMenu,
  onMapClick,
  onClickFeature,
  onRightClickFeature,
  onClickNotFeature,
  onHoverFeature,
  onRotate,
  onMove,

  featureTargets = ['facilityId'],
  interactiveLayerIds = [FACILITY_POLYGON_FILL_LAYER_ID, FACILITY_POLYGON_LINE_LAYER_ID],

  minPitch = MIN_PITCH,
  maxPitch = MAX_PITCH,
  minZoom = MIN_ZOOM,
  maxZoom = MAX_ZOOM,
  dragRotate = true,
  initialViewState = INIT_VIEW_STATE,
}: Props<T>) {
  const isMouseDownRef = useRef(false);
  const isDraggingRef = useRef(false);
  const mapRef = useRef<MapRef>(null);

  useFlyToEvent((coord) => {
    mapRef.current?.flyTo({
      center: coord,
      zoom: 18,
      duration: 1000,
      pitch: 0,
    });
  });

  useResetNorhEvent(() => {
    mapRef.current?.flyTo({
      duration: 500,
      pitch: 0,
      bearing: 0,
    });
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
      onMapClick?.(e, mapRef.current!);
    },
    [onMapClick],
  );

  const handleClickFeature = useCallback(
    (e: MapLayerMouseEvent) => {
      const feature = e.features?.[0];

      const isFeatureClicked = featureTargets.some((target) => {
        const targetId: T | undefined = feature?.properties?.[target];
        if (targetId) {
          const coord: Coord = [e.lngLat.lng, e.lngLat.lat];
          onClickFeature?.(targetId, target, coord);
          return true;
        }
        return false;
      });

      if (!isFeatureClicked) {
        onClickNotFeature?.();
      }
    },
    [onClickFeature, onClickNotFeature],
  );

  const handleClickRightFeature = useCallback(
    (e: MapLayerMouseEvent) => {
      const feature = e.features?.[0];

      featureTargets.some((target) => {
        const targetId: T | undefined = feature?.properties?.[target];
        if (targetId) {
          const coord: Coord = [e.lngLat.lng, e.lngLat.lat];
          onRightClickFeature?.(targetId, target, coord);
          return true;
        }
        return false;
      });
    },
    [onRightClickFeature, featureTargets],
  );

  const handleHoverFeature = useCallback(
    (e: MapLayerMouseEvent) => {
      const feature = e.features?.[0];

      const isFeatureHovered = featureTargets.some((target) => {
        const targetId: T | undefined = feature?.properties?.[target];
        if (targetId) {
          onHoverFeature?.(targetId);
          mapRef.current?.getCanvas().style.setProperty('cursor', 'pointer');
          return true;
        }
        return false;
      });

      if (!isFeatureHovered) {
        onHoverFeature?.(undefined);
        mapRef.current?.getCanvas().style.setProperty('cursor', 'grab');
      }
    },
    [onHoverFeature],
  );

  const handleRotate = useCallback(
    (e: ViewStateChangeEvent) => {
      onRotate?.(e.viewState.bearing);
    },
    [onRotate],
  );

  const handleMove = useCallback(
    (e: ViewStateChangeEvent) => {
      onMove?.(e.viewState);
    },
    [onMove],
  );

  const handleMapContextMenu = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!mapRef.current) return;

      const canvas = mapRef.current.getCanvas();
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const lngLat = mapRef.current.unproject([x, y]);
      onMapContextMenu?.([lngLat.lng, lngLat.lat], mapRef.current);
    },
    [onMapContextMenu],
  );

  return (
    <div
      className={classNames(styles.map, className)}
      onContextMenu={handleMapContextMenu}
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
        dragRotate={dragRotate}
        onClick={handleClickFeature}
        onContextMenu={handleClickRightFeature}
        onMouseMove={handleHoverFeature}
        onRotate={handleRotate}
        onMove={handleMove}
        interactiveLayerIds={interactiveLayerIds}
      >
        {children}
      </GMap>
    </div>
  );
}
