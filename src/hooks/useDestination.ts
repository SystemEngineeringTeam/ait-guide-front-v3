import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

export const destinationIdAtom = atom<string | null>(null);

export function useDestinationId() {
  const [destinationId, setDestinationId] = useAtom(destinationIdAtom);
  return [destinationId, setDestinationId] as const;
}

export function useSetDestinationId() {
  return useSetAtom(destinationIdAtom);
}

export function useDestinationIdValue() {
  return useAtomValue(destinationIdAtom);
}
