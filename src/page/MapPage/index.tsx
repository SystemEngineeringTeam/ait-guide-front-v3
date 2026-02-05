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
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import RouteLine from '@/components/RouteLine';
import { useRoute } from '@/hooks/useRoute';

export default function MapPage() {
  const { isOpen: bottomSheetOpen, open: openBottomSheet, close: closeBottomSheet } = useBottomSheet();
  const [selectedId, setSelectedId] = useSelectedFacilityId();
  const [coord, setCoord] = useState<GeoLocationCoordinates>();
  const [bearing, setBearing] = useState(0);
  const [hoverId, setHoverId] = useState<string | undefined>();
  const [zoom, setZoom] = useState(17);
  const route = useRoute();

  useKeyboardShortcut({
    onEscape: () => closeBottomSheet(),
  });

  const handleClickFeature: HandleClickFeatureFn = useCallback((id) => {
    setSelectedId(id);
    openBottomSheet();
  }, []);

  const handleBottomSheetClose = useCallback(() => {
    closeBottomSheet();
  }, []);

  const handleMapClick = useCallback(() => {
    setSelectedId(undefined);
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
        onClickNotFeature={handleMapClick}
      >
        <Deers zoom={zoom} />
        <RouteLine
          route={[
            [35.1818472, 137.1097419],
            [35.1827803, 137.1107841],
            [35.184813, 137.1149168],
          ]}
        />
        <LocationIndicator onChange={setCoord} />
        <FacilitiesPolygons facilities={[...GEO_JSON_FACILITIES, ...GEO_JSON_PASSAGES]} />
        <EntranceMarkers entrances={GEO_JSON_ENTRANCES} zoom={zoom} />
        {selectedId && <FacilityHighlight id={selectedId} key={`select-${selectedId}`} outline fill />}
        {hoverId && <FacilityHighlight id={hoverId} key={`hover-${hoverId}`} outline />}
      </Map>

      <BottomSheet open={bottomSheetOpen} onClose={handleBottomSheetClose}>
        <FacilityData id={selectedId} />
      </BottomSheet>
    </>
  );
}
