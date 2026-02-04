'use client';

import Map, { HandleClickFeatureFn } from '@/components/Map';
import FacilitiesPolygons from '@/components/FacilitiesPolygon';
import { GEO_JSON_FACILITIES } from '@/consts/facilities';
import BottomSheet from '@/components/BottomSheet';
import { useCallback, useRef, useState } from 'react';
import FacilityHighlight from '@/components/FacilityHighlight';
import FacilityData from '@/components/FacilityData';
import LocationIndicator from '@/components/LocationIndicator';
import MapControlPanel from '@/components/MapControlPanel';
import { type MapRef } from 'react-map-gl/maplibre';
import { GeoLocationCoordinates } from '@/hooks/useGeoLocation';
import { GEO_JSON_ENTRANCES } from '@/consts/entrances';
import EntranceMarkers from '@/components/EntranceMarkers';
import { useSelectedFacilityId } from '@/hooks/useSelectedFacilityId';

export default function MapPage() {
  const [selectedId, setSelectedId] = useSelectedFacilityId();
  const [coord, setCoord] = useState<GeoLocationCoordinates>();
  const [bearing, setBearing] = useState(0);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [hoverId, setHoverId] = useState<string | undefined>();
  const mapRef = useRef<MapRef>(null);

  const handleClickFeature: HandleClickFeatureFn = useCallback((id) => {
    setSelectedId(id);
    setBottomSheetOpen(true);
  }, []);

  const handleBottomSheetClose = useCallback(() => {
    setBottomSheetOpen(false);
    setSelectedId(undefined);
  }, []);

  return (
    <>
      <MapControlPanel mapRef={mapRef} coord={coord} bearing={bearing} />

      <Map ref={mapRef} onClickFeature={handleClickFeature} onHoverFeature={setHoverId} onRotate={setBearing}>
        <LocationIndicator onChange={setCoord} />
        <FacilitiesPolygons facilities={GEO_JSON_FACILITIES} />
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
