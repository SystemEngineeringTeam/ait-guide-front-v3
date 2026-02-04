'use client';

import { useEffect, useState } from 'react';
import { GeoLocationCoordinates } from '@/hooks/useGeoLocation';
import { circle } from '@turf/turf';
import { Layer, Source } from 'react-map-gl/maplibre';

interface Props {
  coord: GeoLocationCoordinates;
  animation?: boolean;
}

const OPACITY = 0.1;
const ANIMATION_DURATION = 4000;

export default function AccuracyCircle({ coord, animation }: Props) {
  const [radiusKm, setRadiusKm] = useState(0);
  const [opacity, setOpacity] = useState(OPACITY);

  useEffect(() => {
    if (!animation) {
      setRadiusKm(coord.accuracy / 1000);
      setOpacity(OPACITY);
      return;
    }

    let start: number;
    const duration = ANIMATION_DURATION;

    const animate = (t: number) => {
      if (!start) start = t;

      const progress = ((t - start) % duration) / duration;

      setRadiusKm((coord.accuracy / 1000) * progress);
      setOpacity(OPACITY * (1 - progress));

      requestAnimationFrame(animate);
    };

    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [coord.longitude, coord.latitude, coord.accuracy, animation]);

  const data = circle([coord.longitude, coord.latitude], radiusKm, {
    steps: 64,
    units: 'kilometers',
  });

  return (
    <Source type="geojson" data={data}>
      <Layer
        type="fill"
        paint={{
          'fill-color': 'blue',
          'fill-opacity': opacity,
        }}
      />
    </Source>
  );
}
