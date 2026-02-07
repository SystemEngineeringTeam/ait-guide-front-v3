import type { FloorImages } from '@/types/facilities';
import f1 from './1f.png';
import f2 from './2f.png';
import mf3 from './m3f.png';

export const AIWA = {
  '1': f1,
  '2': f2,
  M3: mf3,
} as const satisfies FloorImages;
