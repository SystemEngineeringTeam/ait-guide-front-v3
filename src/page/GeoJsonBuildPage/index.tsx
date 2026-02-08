'use client';

import styles from './index.module.scss';
import { useGeoJSONBuilder } from '@/hooks/useGeoJSONBuilder';
import Map from '@/components/Map';
import { useEffect, useState } from 'react';
import FacilitiesPolygons from '@/components/FacilityPolygons';
import { GEO_JSON_FACILITIES } from '@/consts/facilities';
import { GEO_JSON_PASSAGES } from '@/consts/passages';
import FacilityNames from '@/components/FacilitiesNames';

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
        minZoom={16}
        maxZoom={24}
        dragRotate={false}
        data-ctrl-down={ctrlKeyPressed}
      >
        <FacilitiesPolygons facilities={[...GEO_JSON_FACILITIES, ...GEO_JSON_PASSAGES]} />
        {entranceMarkers}
        {facilityPolygon}
        <FacilityNames facilities={GEO_JSON_FACILITIES} />
      </Map>
    </>
  );
}
