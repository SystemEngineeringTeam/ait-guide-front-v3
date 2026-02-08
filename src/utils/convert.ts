import { MAX_LAT, MAX_LNG, MIN_LAT, MIN_LNG } from '@/consts/map';
import { COORD_AIT_MAIN_GATE } from '@/consts/coords';
import { Coord } from '@/types/coord';

// 文字列を半角,大文字に変換, ーをｰに変換, 、を,に変換, ひらがなをカタカナに変換
export function toHankakuUpperCase(str: string) {
  return str
    .replace('ごう', '号')
    .replace('かん', '館')
    .replace(/-/, 'ー')
    .replace(/、/, ',')
    .toUpperCase()
    .replace(/[Ａ-Ｚ０-９]/g, (s) => {
      return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
    })
    .replace(/[ぁ-ん]/g, (s) => {
      return String.fromCharCode(s.charCodeAt(0) + 0x60);
    });
}

/**
 * 座標が範囲外なら正門の座標を返す
 * @param lat 緯度
 * @param lng 経度
 * @returns 正門 or [緯度, 経度]
 */
export function toValidCoordinate(lat: number, lon: number): Coord {
  if (lat < MIN_LAT) return COORD_AIT_MAIN_GATE;
  if (lat > MAX_LAT) return COORD_AIT_MAIN_GATE;
  if (lon < MIN_LNG) return COORD_AIT_MAIN_GATE;
  if (lon > MAX_LNG) return COORD_AIT_MAIN_GATE;

  return [lon, lat];
}

/**
 * 座標が範囲内かを判定する
 * @param lat 緯度
 * @param lng 経度
 * @returns 範囲内ならtrue
 */
export function isValidCoordinate(lat: number, lon: number): boolean {
  if (lat < MIN_LAT) return false;
  if (lat > MAX_LAT) return false;
  if (lon < MIN_LNG) return false;
  if (lon > MAX_LNG) return false;

  return true;
}
