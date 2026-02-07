import type { FloorImages } from '@/types/facilities';
import b1 from './b1f.png';
import f1 from './1f.png';
import f2 from './2f.png';
import mf2 from './m2f.png';

export const CEA = {
  'B1': b1,
  '1': f1,
  '2': f2,
  'M2': mf2,
} as const satisfies FloorImages;
