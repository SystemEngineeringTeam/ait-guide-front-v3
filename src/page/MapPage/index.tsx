'use client';

import Map, { HandleClickFeatureFn } from '@/components/Map';
import BuildingPolygons from '@/components/BuildingsPolygon';
import { GEO_JSON_BUILDINGS } from '@/consts/buildings';
import BottomSheet from '@/components/BottomSheet';
import { useCallback, useRef, useState } from 'react';
import BuildingHighlight from '@/components/BuildingHighlight';
import BuildingData from '@/components/BuildingData';
import LocationIndicator from '@/components/LocationIndicator';
import MapControlPanel from '@/components/MapControlPanel';
import { type MapRef } from 'react-map-gl/maplibre';
import { GeoLocationCoordinates } from '@/hooks/useGeoLocation';
import { GEO_JSON_ENTRANCES } from '@/consts/entrances';
import EntranceMarkers from '@/components/EntranceMarkers';

export default function MapPage() {
  const [coord, setCoord] = useState<GeoLocationCoordinates>();
  const [bearing, setBearing] = useState(0);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();
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
        <BuildingPolygons buildings={GEO_JSON_BUILDINGS} />
        <EntranceMarkers entrances={GEO_JSON_ENTRANCES} />
        {selectedId && <BuildingHighlight id={selectedId} key={`select-${selectedId}`} outline fill />}
        {hoverId && <BuildingHighlight id={hoverId} key={`hover-${hoverId}`} outline />}
      </Map>

      <BottomSheet open={bottomSheetOpen} onClose={handleBottomSheetClose}>
        <BuildingData id={selectedId} />
      </BottomSheet>
    </>
  );
}
