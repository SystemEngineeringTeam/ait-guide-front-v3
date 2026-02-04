'use client';

import styles from './index.module.scss';
import { useGeoJSONBuilder } from '@/hooks/useGeoJSONBuilder';
import Map from '@/components/Map';
import { useEffect, useState } from 'react';
import BuildingPolygons from '@/components/BuildingsPolygon';
import { GEO_JSON_BUILDINGS } from '@/consts/buildings';

export default function GeoJsonBuildPage() {
  const {
    buildPolygon,
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
        {buildPolygon}
        <BuildingPolygons buildings={GEO_JSON_BUILDINGS} />
      </Map>
    </>
  );
}
