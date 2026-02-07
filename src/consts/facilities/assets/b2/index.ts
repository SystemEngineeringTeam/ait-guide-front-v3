import type { FloorImages } from '@/types/facilities';
import bf2 from './b2f.png';
import bf1 from './b1f.png';
import f1 from './1f.png';
import f2 from './2f.png';
import f3 from './3f.png';
import f4 from './4f.png';
import f5 from './5f.png';
import f6 from './6f.png';

export const B2 = {
  B2: bf2,
  B1: bf1,
  '1': f1,
  '2': f2,
  '3': f3,
  '4': f4,
  '5': f5,
  '6': f6,
} as const satisfies FloorImages;
