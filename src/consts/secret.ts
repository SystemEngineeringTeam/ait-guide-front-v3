import { ID } from '@/utils/id';
import { observe } from 'jotai-effect';
import { showPenguin } from '@/hooks/usePenguin';
import { flyTo } from '@/hooks/useFlyTo';
import { COORD_NARA_PARK } from './coords';
import { setOverlayOpen } from '@/hooks/useOverlay';

export interface SecretMap {
  id: number;
  word: string;
  event?: () => void;
}

const id = new ID();

export const SECRETS: SecretMap[] = [
  {
    id: id.get(),
    word: 'ペンギン',
    event: () =>
      observe((_get, set) => {
        setOverlayOpen(set, false);
        showPenguin(set);
      }),
  },
  {
    id: id.get(),
    word: 'シカ',
    event: () =>
      observe((_get, set) => {
        setOverlayOpen(set, false);
        flyTo(set, COORD_NARA_PARK);
      }),
  },
];
