'use client';

import Map, { type HandleMoveFn } from '@/components/Map';
import FacilityPolygons from '@/components/FacilityPolygons';
import { GEO_JSON_FACILITIES } from '@/consts/facilities';
import { GEO_JSON_PASSAGES } from '@/consts/passages';
import LocationIndicator from '@/components/LocationIndicator';
import MapControlPanel from '@/components/MapControlPanel';
import { GEO_JSON_ENTRANCES } from '@/consts/entrances';
import EntranceMarkers from '@/components/EntranceMarkers';
import RouteLine from '@/components/RouteLine';
import FacilityNames from '@/components/FacilitiesNames';
import { Suspense, useCallback, useMemo, useState } from 'react';
import type { GeoLocationCoordinates } from '@/hooks/useGeoLocation';
import { fetchRoute } from '@/hooks/useRoute';
import { useSearchParams } from 'next/navigation';
import type { Coord } from '@/types/coord';
import { FacilityId } from '@/consts/facilityId';
import useSWR from 'swr';
import { values } from '@/utils/object';
import { errorToast } from '@/utils/toast';
import { COORD_AIT_MAIN_GATE } from '@/consts/coords';

export default function ShareMapPage() {
  return (
    <Suspense>
      <Inner />
    </Suspense>
  );
}

function Inner() {
  const [coord, setCoord] = useState<GeoLocationCoordinates>();
  const [bearing, setBearing] = useState(0);
  const [showEntrances, setShowEntrances] = useState(false);
  const searchParams = useSearchParams();

  const fromCoord: Coord = useMemo(() => {
    const from = searchParams.get('from');
    const coordRaw = from?.split(',').map((v) => Number(v));
    if (coordRaw && coordRaw.length === 2 && !coordRaw.some(isNaN)) return [coordRaw[0], coordRaw[1]];
    return COORD_AIT_MAIN_GATE;
  }, [searchParams]);
  const toId: FacilityId | null = useMemo(() => {
    const toId = searchParams.get('toId');
    if (!toId) return null;

    if (values(FacilityId).includes(toId as FacilityId)) return toId as FacilityId;

    return null;
  }, [searchParams]);

  const { data: route, isLoading } = useSWR(['/api/user', fromCoord, toId], ([_, fromCoord, toId]) => {
    if (!toId) {
      errorToast('目的地が設定されていません');
      return [];
    }
    return fetchRoute(fromCoord, toId);
  });

  const handleMapMove: HandleMoveFn = useCallback((view) => setShowEntrances(view.zoom > 17.5), [setShowEntrances]);

  return (
    <>
      <MapControlPanel coord={coord} bearing={bearing} />

      <Map onMove={handleMapMove} onRotate={setBearing} maxZoom={20}>
        <LocationIndicator onChange={setCoord} />
        <FacilityPolygons facilities={[...GEO_JSON_FACILITIES, ...GEO_JSON_PASSAGES]} />
        <EntranceMarkers entrances={GEO_JSON_ENTRANCES} show={showEntrances} />
        <RouteLine route={route} canChangeStartPoint={false} />
        <FacilityNames facilities={GEO_JSON_FACILITIES} />
      </Map>
    </>
  );
}
