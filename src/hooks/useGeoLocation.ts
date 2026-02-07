import { errorToast } from '@/utils/toast';
import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';

export interface GeoLocationCoordinates {
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  latitude: number;
  longitude: number;
  speed: number | null;
}

export const locationAtom = atom<GeoLocationCoordinates | undefined>(undefined);

interface UseGeoLocationOptions {
  override?: Partial<GeoLocationCoordinates>;
  onChange?: (coord: GeoLocationCoordinates) => void;
}

export function useGeoLocation(options?: UseGeoLocationOptions) {
  const [coord, setCoord] = useAtom(locationAtom);

  const override = options?.override;

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      ({ coords }) => {
        setCoord({
          accuracy: override?.accuracy ?? coords.accuracy,
          altitude: override?.altitude ?? coords.altitude,
          altitudeAccuracy: override?.altitudeAccuracy ?? coords.altitudeAccuracy,
          heading: override?.heading ?? coords.heading,
          speed: override?.speed ?? coords.speed,
          latitude: override?.latitude ?? coords.latitude,
          longitude: override?.longitude ?? coords.longitude,
        });
        options?.onChange?.({
          accuracy: override?.accuracy ?? coords.accuracy,
          altitude: override?.altitude ?? coords.altitude,
          altitudeAccuracy: override?.altitudeAccuracy ?? coords.altitudeAccuracy,
          heading: override?.heading ?? coords.heading,
          speed: override?.speed ?? coords.speed,
          latitude: override?.latitude ?? coords.latitude,
          longitude: override?.longitude ?? coords.longitude,
        });
      },
      (error) => {
        if (error.PERMISSION_DENIED) errorToast('位置情報の利用を許可してください');
        else if (error.POSITION_UNAVAILABLE) errorToast('位置情報が利用できません');
        else errorToast('位置情報の取得に失敗しました');
      },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return coord;
}
