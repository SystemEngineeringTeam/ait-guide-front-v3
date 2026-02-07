import type { FloorImages } from '@/types/facilities';
import f1 from './1f.png';
import mf1 from './m1f.png';
import f2 from './2f.png';
import f3 from './3f.png';
import m3f from './m3f.png';
import f4 from './4f.png';

export const LIBRARY = {
  '1': f1,
  M1: mf1,
  '2': f2,
  M3: m3f,
  '3': f3,
  '4': f4,
} as const satisfies FloorImages;
