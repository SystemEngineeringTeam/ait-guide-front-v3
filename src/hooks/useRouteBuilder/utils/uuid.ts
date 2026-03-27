import { UUID } from '@/types/route';
import { v4 as uuidv4 } from 'uuid';

export const uuid = (): UUID => {
  return uuidv4() as UUID;
};
