'use client';

import styles from './index.module.scss';
import { useGeoJSONBuilder } from '@/hooks/useGeoJSONBuilder';
import PageLayout from '@/layout/PageLayout';
import Map from '@/components/Map';
import { useEffect, useState } from 'react';

export default function GeoJsonBuildPage() {
  const { buildPolygon, panel: geoJSONBuilderPanel, handleMapContextMenu } = useGeoJSONBuilder();
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
    <PageLayout className={styles.mapPage} data-ctrl-down={ctrlKeyPressed}>
      {geoJSONBuilderPanel}
      <Map handleMapContextMenu={handleMapContextMenu} maxZoom={20}>
        {buildPolygon}
      </Map>
    </PageLayout>
  );
}
