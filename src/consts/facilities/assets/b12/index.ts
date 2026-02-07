import type { FloorImages } from '@/types/facilities';
import bf1 from './b1f.png';
import f1 from './1f.png';
import f2 from './2f.png';
import f3 from './3f.png';
import f4 from './4f.png';

export const B12 = {
  'B1': bf1,
  '1': f1,
  '2': f2,
  '3': f3,
  '4': f4,
} as const satisfies FloorImages;
