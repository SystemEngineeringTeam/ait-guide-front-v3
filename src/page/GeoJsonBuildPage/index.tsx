'use client';

import styles from './index.module.scss';
import { useGeoJSONBuilder } from '@/hooks/useGeoJSONBuilder';
import Map from '@/components/Map';
import { useEffect, useState } from 'react';
import FacilitiesPolygons from '@/components/FacilitiesPolygon';
import { GEO_JSON_FACILITIES, GEO_JSON_PASSAGES } from '@/consts/facilities';

export default function GeoJsonBuildPage() {
  const {
    facilityPolygon,
    entranceMarkers,
    panel: geoJSONBuilderPanel,
    handleMapContextMenu,
    handleMapClick,
  } = useGeoJSONBuilder();
  const [ctrlKeyPressed, setCtrlKeyPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control') setCtrlKeyPressed(true);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control') setCtrlKeyPressed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <>
      {geoJSONBuilderPanel}
      <Map
        className={styles.map}
        onMapContextMenu={handleMapContextMenu}
        onMapClick={handleMapClick}
        minZoom={0}
        maxZoom={24}
        data-ctrl-down={ctrlKeyPressed}
      >
        {entranceMarkers}
        {facilityPolygon}
        <FacilitiesPolygons facilities={[...GEO_JSON_FACILITIES, ...GEO_JSON_PASSAGES]} />
      </Map>
    </>
  );
}
