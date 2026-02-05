'use client';

import Map, { HandleClickFeatureFn } from '@/components/Map';
import FacilitiesPolygons from '@/components/FacilitiesPolygon';
import { GEO_JSON_FACILITIES } from '@/consts/facilities';
import { GEO_JSON_PASSAGES } from '@/consts/passages';
import BottomSheet from '@/components/BottomSheet';
import { useCallback, useRef, useState } from 'react';
import FacilityHighlight from '@/components/FacilityHighlight';
import FacilityData from '@/components/FacilityData';
import LocationIndicator from '@/components/LocationIndicator';
import MapControlPanel from '@/components/MapControlPanel';
import { GeoLocationCoordinates } from '@/hooks/useGeoLocation';
import { GEO_JSON_ENTRANCES } from '@/consts/entrances';
import EntranceMarkers from '@/components/EntranceMarkers';
import { useSelectedFacilityId } from '@/hooks/useSelectedFacilityId';
import { useBottomSheet } from '@/hooks/useBottomSheet';
import Deers from '@/components/Deers';

export default function MapPage() {
  const { isOpen: bottomSheetOpen, open: openBottomSheet, close: closeBottomSheet } = useBottomSheet();
  const [selectedId, setSelectedId] = useSelectedFacilityId();
  const [coord, setCoord] = useState<GeoLocationCoordinates>();
  const [bearing, setBearing] = useState(0);
  const [hoverId, setHoverId] = useState<string | undefined>();
  const [zoom, setZoom] = useState(17);

  const handleClickFeature: HandleClickFeatureFn = useCallback((id) => {
    setSelectedId(id);
    openBottomSheet();
  }, []);

  const handleBottomSheetClose = useCallback(() => {
    closeBottomSheet();
  }, []);

  return (
    <>
      <MapControlPanel coord={coord} bearing={bearing} />

      <Map
        onClickFeature={handleClickFeature}
        onHoverFeature={setHoverId}
        onRotate={setBearing}
        onMove={(viewState) => setZoom(viewState.zoom ?? 17)}
      >
        <Deers zoom={zoom} />
        <LocationIndicator onChange={setCoord} />
        <FacilitiesPolygons facilities={[...GEO_JSON_FACILITIES, ...GEO_JSON_PASSAGES]} />
        <EntranceMarkers entrances={GEO_JSON_ENTRANCES} />
        {selectedId && <FacilityHighlight id={selectedId} key={`select-${selectedId}`} outline fill />}
        {hoverId && <FacilityHighlight id={hoverId} key={`hover-${hoverId}`} outline />}
      </Map>

      <BottomSheet open={bottomSheetOpen} onClose={handleBottomSheetClose}>
        <FacilityData id={selectedId} />
      </BottomSheet>
    </>
  );
}
