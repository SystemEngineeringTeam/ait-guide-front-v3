'use client';

import styles from './index.module.scss';
import { default as GMap, ViewState } from 'react-map-gl/maplibre';
import * as mapLib from 'maplibre-gl';
import { useGeoLocation } from '@/hooks/useGeoLocation';
import { useSearchParams } from 'next/navigation';
import Location from './Location';
import AccuracyCircle from './AccuracyCircle';
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
  const searchParams = useSearchParams();
  const coord = useGeoLocation({
    override: {
      latitude: searchParams.get('lat') ? Number(searchParams.get('lat')) : undefined,
      longitude: searchParams.get('lon') ? Number(searchParams.get('lon')) : undefined,
    },
  });

  return (
    <div className={styles.map}>
      <GMap
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
      </GMap>
    </div>
  );
}
