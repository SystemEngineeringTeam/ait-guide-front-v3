'use client';

import { useGeoLocation } from '@/hooks/useGeoLocation';
import { getNumSearchParam } from '@/utils/searchParam';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Location from './Location';
import AccuracyCircle from './AccuracyCircle';

export default function LocationIndicator() {
  return (
    <Suspense>
      <Inner />
    </Suspense>
  );
}

function Inner() {
  const searchParams = useSearchParams();
  const coord = useGeoLocation({
    override: {
      latitude: getNumSearchParam(searchParams, 'lat'),
      longitude: getNumSearchParam(searchParams, 'lon'),
      accuracy: getNumSearchParam(searchParams, 'acc'),
    },
  });

  return (
    <>
      {coord && <Location coord={coord} />}
      {coord && <AccuracyCircle coord={coord} />}
    </>
  );
}
