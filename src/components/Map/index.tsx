'use client';

import styles from './index.module.scss';
import { default as GMap, ViewState } from 'react-map-gl/maplibre';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAX_PITCH = 85 as const; // マップの最大ピッチ角度
const MAX_ZOOM = 18 as const;
const MIN_ZOOM = 16 as const;

const InitialViewState: Partial<ViewState> = {
  longitude: 137.1134981,
  latitude: 35.1839876,
  zoom: 16,
  pitch: 45,
  bearing: 0,
};

export default function Map() {
  return (
    <div className={styles.map}>
      <GMap
        mapLib={maplibregl}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json"
        initialViewState={InitialViewState}
        maxPitch={MAX_PITCH}
        maxZoom={MAX_ZOOM}
        minZoom={MIN_ZOOM}
      />
    </div>
  );
}
