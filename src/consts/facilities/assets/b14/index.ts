import type { FloorImages } from '@/types/facilities';
import f1 from './1f.png';
import f2 from './2f.png';
import f3 from './3f.png';
import f4 from './4f.png';
import f5 from './5f.png';
import f6 from './6f.png';
import f7 from './7f.png';

export const B14 = {
  '1': f1,
  '2': f2,
  '3': f3,
  '4': f4,
  '5': f5,
  '6': f6,
  '7': f7,
} as const satisfies FloorImages;
