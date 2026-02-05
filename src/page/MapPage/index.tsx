'use client';

import Map, { HandleClickFeatureFn, HandleMoveFn } from '@/components/Map';
import FacilityPolygons from '@/components/FacilityPolygons';
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
import FacilityNames from '@/components/FacilitiesNames';
// import { useRoute } from '@/hooks/useRoute';

export default function MapPage() {
  const { isOpen: bottomSheetOpen, open: openBottomSheet, close: closeBottomSheet } = useBottomSheet();
  const [selectedId, setSelectedId] = useSelectedFacilityId();
  const [coord, setCoord] = useState<GeoLocationCoordinates>();
  const [bearing, setBearing] = useState(0);
  const [hoverId, setHoverId] = useState<string | undefined>();
  const [zoomForDeer, setZoomForDeer] = useState(17);
  const [showEntrances, setShowEntrances] = useState(true);
  const [showDeer, setShowDeer] = useState(false);
  // const route = useRoute();

  useKeyboardShortcut({
    onEscape: () => closeBottomSheet(),
  });

  const handleClickFeature: HandleClickFeatureFn = useCallback(
    (id) => {
      setSelectedId(id);
      openBottomSheet();
    },
    [openBottomSheet, setSelectedId],
  );

  const handleBottomSheetClose = useCallback(() => {
    closeBottomSheet();
  }, [closeBottomSheet]);

  const handleMapClick = useCallback(() => {
    setSelectedId(undefined);
    closeBottomSheet();
  }, [closeBottomSheet]);

  const handleMapMove: HandleMoveFn = useCallback(
    (view) => {
      const deer = view.longitude < 136;
      setShowDeer(deer);
      if (deer) setZoomForDeer(view.zoom);
      setShowEntrances(view.zoom > 17.5);
    },
    [setZoomForDeer, setShowDeer, setShowEntrances],
  );

  return (
    <>
      <MapControlPanel coord={coord} bearing={bearing} />

      <Map
        onClickFeature={handleClickFeature}
        onHoverFeature={setHoverId}
        onRotate={setBearing}
        onMove={handleMapMove}
        onClickNotFeature={handleMapClick}
      >
        {showDeer && <Deers zoom={zoomForDeer} />}
        <LocationIndicator onChange={setCoord} />
        <FacilityPolygons facilities={[...GEO_JSON_FACILITIES, ...GEO_JSON_PASSAGES]} />
        <EntranceMarkers entrances={GEO_JSON_ENTRANCES} show={showEntrances} />
        {selectedId && <FacilityHighlight id={selectedId} key={`select-${selectedId}`} outline fill />}
        {hoverId && <FacilityHighlight id={hoverId} key={`hover-${hoverId}`} outline />}
        <RouteLine
          route={[
            [137.10998, 35.182188],
            [137.110617, 35.182693],
            [137.110949, 35.182894],
            [137.110887, 35.183697],
            [137.113468, 35.183893],
            [137.113696, 35.184018],
            [137.113696, 35.184327],
            [137.114853, 35.184447],
            [137.114853, 35.184693],
            [137.114817, 35.184744],
            [137.114765, 35.184761],
            [137.114769, 35.184813],
            [137.114816, 35.184797],
          ]}
        />
        <FacilityNames facilities={GEO_JSON_FACILITIES} />
      </Map>

      <BottomSheet open={bottomSheetOpen} onClose={handleBottomSheetClose}>
        <FacilityData id={selectedId} />
      </BottomSheet>
    </>
  );
}
