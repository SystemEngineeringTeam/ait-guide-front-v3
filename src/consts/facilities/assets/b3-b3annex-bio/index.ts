import type { FloorImages } from '@/types/facilities';
import f1 from './1f.png';
import f2 from './2f.png';
import f3 from './3f.png';
import f4 from './4f.png';

export const B3_B3ANNEX_BIO = {
  '1': f1,
  '2': f2,
  '3': f3,
  '4': f4,
} as const satisfies FloorImages;
