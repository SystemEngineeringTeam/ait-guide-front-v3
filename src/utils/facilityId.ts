import { FacilityId } from '@/consts/facilityId';

export function isFacilityId(value: unknown): value is FacilityId {
  return Object.values(FacilityId).includes(value as FacilityId);
}
