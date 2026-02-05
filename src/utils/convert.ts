import { MAP_MAX_X, MAP_MAX_Y, MAP_MIN_X, MAP_MIN_Y, MAX_LAT, MAX_LNG, MIN_LAT, MIN_LNG } from '@/consts/map';
import { COORD_AIT_MAIN_GATE } from '@/consts/coords';

// 文字列を半角,大文字に変換, ーをｰに変換, 、を,に変換, ひらがなをカタカナに変換
export function toHankakuUpperCase(str: string) {
  return str
    .replace('ごう', '号')
    .replace('かん', '館')
    .replace(/ー/, '-')
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
 * 緯度経度をパーセントに変換する
 * @param coordinate [緯度, 経度]
 * @param defaultLatLng デフォルトの緯度経度
 * @returns [緯度のパーセント, 経度のパーセント]
 */
export function toPercent(coordinate: [number, number] | undefined, defaultLatLng = [0, 0]): [number, number] {
  const latPercent =
    coordinate === undefined ? defaultLatLng[0] : ((coordinate[0] - MIN_LAT) / (MAX_LAT - MIN_LAT)) * 100;
  const lngPercent =
    coordinate === undefined ? defaultLatLng[1] : ((coordinate[1] - MIN_LNG) / (MAX_LNG - MIN_LNG)) * 100;

  return [latPercent, lngPercent];
}

/**
 * 座標が範囲外なら正門の座標を返す
 * @param lat 緯度
 * @param lng 経度
 * @returns 正門 or [緯度, 経度]
 */
export function toValidCoordinate(lat: number, lng: number): [number, number] {
  if (lat < MIN_LAT) return COORD_AIT_MAIN_GATE;
  if (lat > MAX_LAT) return COORD_AIT_MAIN_GATE;
  if (lng < MIN_LNG) return COORD_AIT_MAIN_GATE;
  if (lng > MAX_LNG) return COORD_AIT_MAIN_GATE;

  return [lat, lng];
}

/* 緯度経度をSVG座標に変換する */
export function toSvgPoint([lat, lng]: [number, number]): [number, number] {
  const xPercent = (lng - MIN_LNG) / (MAX_LNG - MIN_LNG);
  const yPercent = 1 - (lat - MIN_LAT) / (MAX_LAT - MIN_LAT);

  const x = MAP_MIN_X + xPercent * (MAP_MAX_X - MAP_MIN_X);
  const y = MAP_MIN_Y + yPercent * (MAP_MAX_Y - MAP_MIN_Y);

  return [x, y];
}

export function toTransformPoint(coordinate: [number, number] | undefined): [number, number] {
  const percent = toPercent(coordinate);
  const w = document.body.clientWidth;
  const h = document.body.clientHeight;
  const x = (percent[1] / 100) * w;
  const y = (1 - percent[0] / 100) * h;

  return [-x, -y];
}
