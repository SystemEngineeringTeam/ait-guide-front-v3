import { Feature } from 'geojson';

export interface EntranceData {
  id: string;
  longitude: number;
  latitude: number;
  rotation: number;
  width: number;
}

/**
 * 出入り口の座標から2本の平行線のGeoJSON LineStringフィーチャーを生成
 * @param entrance 出入り口データ
 * @param lineLength 線の長さ（メートル）
 * @returns 2本の平行線を表すLineStringフィーチャーの配列
 */
export function generateEntranceLines(entrance: EntranceData, lineLength: number = 2): Feature<GeoJSON.LineString>[] {
  const { id, longitude, latitude, rotation, width } = entrance;

  // 回転角度をラジアンに変換
  const angleRad = (rotation * Math.PI) / 180;

  // 壁に垂直な方向（線の方向）
  const perpX = Math.cos(angleRad);
  const perpY = Math.sin(angleRad);

  // 幅方向（線と垂直な方向）
  const widthX = -Math.sin(angleRad);
  const widthY = Math.cos(angleRad);

  // 緯度経度での近似的なオフセット（小さなスケールなので簡易計算）
  const metersToLng = 1 / (111320 * Math.cos((latitude * Math.PI) / 180));
  const metersToLat = 1 / 110540;

  // 幅の半分だけ左右にオフセット
  const halfWidth = width / 2;

  // 左側の線
  const line1Start = [
    longitude + (widthX * halfWidth - (perpX * lineLength) / 2) * metersToLng,
    latitude + (widthY * halfWidth - (perpY * lineLength) / 2) * metersToLat,
  ];
  const line1End = [
    longitude + (widthX * halfWidth + (perpX * lineLength) / 2) * metersToLng,
    latitude + (widthY * halfWidth + (perpY * lineLength) / 2) * metersToLat,
  ];

  // 右側の線
  const line2Start = [
    longitude + (-widthX * halfWidth - (perpX * lineLength) / 2) * metersToLng,
    latitude + (-widthY * halfWidth - (perpY * lineLength) / 2) * metersToLat,
  ];
  const line2End = [
    longitude + (-widthX * halfWidth + (perpX * lineLength) / 2) * metersToLng,
    latitude + (-widthY * halfWidth + (perpY * lineLength) / 2) * metersToLat,
  ];

  return [
    {
      type: 'Feature',
      properties: { entranceId: id },
      geometry: {
        type: 'LineString',
        coordinates: [line1Start, line1End],
      },
    },
    {
      type: 'Feature',
      properties: { entranceId: id },
      geometry: {
        type: 'LineString',
        coordinates: [line2Start, line2End],
      },
    },
  ];
}
