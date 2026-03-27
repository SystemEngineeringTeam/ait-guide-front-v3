import { UserId } from '../types/userId';
import { useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

const userIdAtom = atomWithStorage<UserId | null>('userId', null);

export const useUserIdSetter = () => {
  const set = useSetAtom(userIdAtom);

  const setUserId = (userId: string | null) => {
    set(userId as UserId | null);
  };

  return setUserId;
};

export const useUserIdValue = () => {
  return useAtomValue(userIdAtom) as UserId | null;
};

export const useUserId = () => {
  const userId = useUserIdValue();
  const setUserId = useUserIdSetter();

  return [userId, setUserId] as const;
};

export const useGetUserIdFn = () => {
  const userId = useUserIdValue();

  const getUserId = () => {
    if (!userId) {
      throw new Error('User ID is not set.');
    }
    return userId;
  };

  return getUserId;
};
