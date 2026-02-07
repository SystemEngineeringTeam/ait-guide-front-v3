import type { FloorImages } from '@/types/facilities';
import f1 from './1f.png';
import f2 from './2f.png';

export const CLUBHOUSE5 = {
  '1': f1,
  '2': f2,
} as const satisfies FloorImages;
