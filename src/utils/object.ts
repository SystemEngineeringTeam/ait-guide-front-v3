export function values<T extends object>(obj: T): T[keyof T][] {
  return Object.values(obj) as T[keyof T][];
}

export const entries = <T extends object>(
  obj: T
): [keyof T, T[keyof T]][] =>
  Object.entries(obj) as any;
