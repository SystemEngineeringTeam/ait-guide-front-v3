/**
 * URLのクエリパラメータから値を取得する
 */
export function getFromQueryParam(key: string): string | undefined {
  const params = new URLSearchParams(window.location.search);
  return params.get(key) ?? undefined;
}

/**
 * useSyncExternalStore用
 */
export function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback);

  // pushState / replaceState も拾う
  const origPush = history.pushState;
  const origReplace = history.replaceState;

  history.pushState = function (...args) {
    origPush.apply(this, args);
    callback();
  };

  history.replaceState = function (...args) {
    origReplace.apply(this, args);
    callback();
  };

  return () => {
    window.removeEventListener('popstate', callback);
    history.pushState = origPush;
    history.replaceState = origReplace;
  };
}

/**
 * URLのクエリパラメータに値をセットする
 */
export function setQueryParam(key: string, value: string | undefined) {
  const url = new URL(window.location.href);

  if (value) url.searchParams.set(key, value);
  else url.searchParams.delete(key);

  history.pushState({}, '', url);
}
