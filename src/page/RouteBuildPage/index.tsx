'use client';

import styles from './index.module.scss';
import { useRouteBuilder } from '@/hooks/useRouteBuilder';
import Map from '@/components/Map';
import { useEffect, useState } from 'react';
import FacilitiesPolygons from '@/components/FacilityPolygons';
import { GEO_JSON_FACILITIES } from '@/consts/facilities';
import { GEO_JSON_PASSAGES } from '@/consts/passages';
import FacilityNames from '@/components/FacilitiesNames';
import EntranceMarkers from '@/components/EntranceMarkers';
import { GEO_JSON_ENTRANCES } from '@/consts/entrances';
import { Popup } from 'react-map-gl/maplibre';

export default function RouteBuildPage() {
  const {
    markers,
    lines,
    panel: roadPanel,
    handleMapContextMenu,
    handleMapClick,
    popupCoords,
    selectedRoad,
    handleToggleMainRoute,
    handleToggleBackroad,
    handleToggleStair,
    setSelectedRoadId,
  } = useRouteBuilder();
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
        minZoom={16}
        maxZoom={24}
        dragRotate={false}
        data-ctrl-down={ctrlKeyPressed}
      >
        {lines}
        {markers}
        <FacilitiesPolygons facilities={[...GEO_JSON_FACILITIES, ...GEO_JSON_PASSAGES]} />
        <EntranceMarkers entrances={GEO_JSON_ENTRANCES} />
        <FacilityNames facilities={GEO_JSON_FACILITIES} />
        {popupCoords && selectedRoad && (
          <Popup
            longitude={popupCoords.longitude}
            latitude={popupCoords.latitude}
            onClose={() => setSelectedRoadId(null)}
            anchor="bottom"
            offset={20}
          >
            <div style={{ padding: '8px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>経路オプション</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    checked={selectedRoad.options.mainRoute || false}
                    onChange={handleToggleMainRoute}
                    style={{ marginRight: '8px', cursor: 'pointer' }}
                  />
                  🛤️ 本道
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    checked={selectedRoad.options.backroad || false}
                    onChange={handleToggleBackroad}
                    style={{ marginRight: '8px', cursor: 'pointer' }}
                  />
                  🏞️ 裏道
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    checked={selectedRoad.options.stair || false}
                    onChange={handleToggleStair}
                    style={{ marginRight: '8px', cursor: 'pointer' }}
                  />
                  🪜 階段
                </label>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </>
  );
}
