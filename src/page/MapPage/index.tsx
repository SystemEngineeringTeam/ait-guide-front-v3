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
import { useRoute } from '@/hooks/useRoute';
import Overlay from '@/components/Overlay';
import SearchArea from '@/components/SearchArea';
import { useSearchText } from '@/hooks/useSearch';

export default function MapPage() {
  const [searchText, setSearchText] = useSearchText();
  const { isOpen: bottomSheetOpen, close: closeBottomSheet } = useBottomSheet();
  const [selectedId, setSelectedFacilityId] = useSelectedFacilityId();
  const [coord, setCoord] = useState<GeoLocationCoordinates>();
  const [bearing, setBearing] = useState(0);
  const [hoverId, setHoverId] = useState<string | undefined>();
  const [zoomForDeer, setZoomForDeer] = useState(17);
  const [showEntrances, setShowEntrances] = useState(false);
  const [showDeer, setShowDeer] = useState(false);
  const route = useRoute();

  useKeyboardShortcut({
    onEscape: () => {
      setSelectedFacilityId(undefined);
      closeBottomSheet();
    },
  });

  const handleClickFeature: HandleClickFeatureFn = useCallback(
    (id) => setSelectedFacilityId(id),
    [setSelectedFacilityId],
  );

  const handleBottomSheetClose = useCallback(() => {
    setSelectedFacilityId(undefined);
    closeBottomSheet();
  }, [closeBottomSheet, setSelectedFacilityId]);

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
      <Overlay>
        <SearchArea text={searchText} setText={setSearchText} />
      </Overlay>

      <MapControlPanel coord={coord} bearing={bearing} />

      <Map
        onClickFeature={handleClickFeature}
        onHoverFeature={setHoverId}
        onRotate={setBearing}
        onMove={handleMapMove}
        onClickNotFeature={handleBottomSheetClose}
      >
        {showDeer && <Deers zoom={zoomForDeer} />}
        <LocationIndicator onChange={setCoord} />
        <FacilityPolygons facilities={[...GEO_JSON_FACILITIES, ...GEO_JSON_PASSAGES]} />
        <EntranceMarkers entrances={GEO_JSON_ENTRANCES} show={showEntrances} />
        {selectedId && <FacilityHighlight id={selectedId} key={`select-${selectedId}`} outline fill />}
        {hoverId && <FacilityHighlight id={hoverId} key={`hover-${hoverId}`} outline />}
        <RouteLine route={route} />
        <FacilityNames facilities={GEO_JSON_FACILITIES} />
      </Map>

      <BottomSheet open={bottomSheetOpen} onClose={handleBottomSheetClose}>
        <FacilityData id={selectedId} />
      </BottomSheet>
    </>
  );
}
