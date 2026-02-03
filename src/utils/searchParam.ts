import { type ReadonlyURLSearchParams } from 'next/navigation';

export function getNumSearchParam(param: ReadonlyURLSearchParams, key: string): number | undefined {
  const value = param.get(key);
  return value ? Number(value) : undefined;
}
