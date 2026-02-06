'use client';

import styles from './index.module.scss';
import { useRoadBuilder } from '@/hooks/useRoadBuilder';
import Map from '@/components/Map';
import { useEffect, useState } from 'react';
import FacilitiesPolygons from '@/components/FacilityPolygons';
import { GEO_JSON_FACILITIES } from '@/consts/facilities';
import { GEO_JSON_PASSAGES } from '@/consts/passages';

export default function RoadConnectionPage() {
  const {
    markers,
    lines,
    panel: roadPanel,
    handleMapContextMenu,
    handleMapClick,
  } = useRoadBuilder();
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
      {roadPanel}
      <Map
        className={styles.map}
        onMapContextMenu={handleMapContextMenu}
        onMapClick={handleMapClick}
        minZoom={0}
        maxZoom={24}
        data-ctrl-down={ctrlKeyPressed}
      >
        {lines}
        {markers}
        <FacilitiesPolygons facilities={[...GEO_JSON_FACILITIES, ...GEO_JSON_PASSAGES]} />
      </Map>
    </>
  );
}
