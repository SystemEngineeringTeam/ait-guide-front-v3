import type { FloorImages } from '@/types/facilities';
import f1 from './1f.png';
import f2 from './2f.png';
import f3 from './3f.png';
import m3f from './m3f.png';

export const B7 = {
  '1': f1,
  '2': f2,
  '3': f3,
  M3: m3f,
} as const satisfies FloorImages;
