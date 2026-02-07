import type { FloorImages } from '@/types/facilities';
import f1 from './1f.png';
import m1f from './m1f.png';

export const VIBRATION = {
  '1': f1,
  M1: m1f,
} as const satisfies FloorImages;
