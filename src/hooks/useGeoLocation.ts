import { useEffect, useState } from 'react';

export interface GeoLocationCoordinates {
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  latitude: number;
  longitude: number;
  speed: number | null;
}

interface UseGeoLocationOptions {
  override?: Partial<GeoLocationCoordinates>;
}

export function useGeoLocation(options?: UseGeoLocationOptions) {
  const [coord, setCoord] = useState<GeoLocationCoordinates>();

  const override = options?.override;

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(({ coords }) => {
      setCoord({
        accuracy: override?.accuracy ?? coords.accuracy,
        altitude: override?.altitude ?? coords.altitude,
        altitudeAccuracy: override?.altitudeAccuracy ?? coords.altitudeAccuracy,
        heading: override?.heading ?? coords.heading,
        speed: override?.speed ?? coords.speed,
        latitude: override?.latitude ?? coords.latitude,
        longitude: override?.longitude ?? coords.longitude,
      });
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return coord;
}
