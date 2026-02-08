type KeyOption = {
  key: string;
  shift?: boolean;
  meta?: boolean;
};

export function isExactKey(e: KeyboardEvent, { key, shift = false, meta = false }: KeyOption) {
  return e.key === key && e.shiftKey === shift && e.metaKey === meta && !e.ctrlKey && !e.altKey;
}
