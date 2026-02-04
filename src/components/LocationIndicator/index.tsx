'use client';

import { GeoLocationCoordinates, useGeoLocation } from '@/hooks/useGeoLocation';
import { getNumSearchParam } from '@/utils/searchParam';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Location from './Location';
import AccuracyCircle from './AccuracyCircle';

interface Props {
  onChange?: (coord: GeoLocationCoordinates) => void;
}

export default function LocationIndicator({ onChange }: Props) {
  return (
    <Suspense>
      <Inner onChange={onChange} />
    </Suspense>
  );
}

function Inner({ onChange }: Props) {
  const searchParams = useSearchParams();
  const coord = useGeoLocation({
    onChange,
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
