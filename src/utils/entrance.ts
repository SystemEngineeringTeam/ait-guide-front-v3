import { Feature } from 'geojson';

export interface EntranceData {
  id: string;
  longitude: number;
  latitude: number;
  rotation: number;
  width: number;
}

/**
 * 出入り口の座標から平行線のGeoJSON LineStringフィーチャーを生成
 * 幅が2mを超える場合、2mごとに追加の線を描画する
 * @param entrance 出入り口データ
 * @param lineLength 線の長さ（メートル）
 * @returns 平行線を表すLineStringフィーチャーの配列
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

  const halfWidth = width / 2;
  const lineInterval = 2; // 2mごとに線を引く
  const lines: Feature<GeoJSON.LineString>[] = [];

  // 線を配置する位置を計算（-halfWidth から +halfWidth まで lineInterval ごと）
  const numLines = Math.ceil(width / lineInterval) + 1;

  for (let i = 0; i < numLines; i++) {
    // -halfWidth から始めて lineInterval ずつ進む
    const offset = -halfWidth + i * lineInterval;

    // 最後の線は必ず右端に配置
    const actualOffset = i === numLines - 1 ? halfWidth : Math.min(offset, halfWidth);

    const lineStart = [
      longitude + (widthX * actualOffset - (perpX * lineLength) / 2) * metersToLng,
      latitude + (widthY * actualOffset - (perpY * lineLength) / 2) * metersToLat,
    ];
    const lineEnd = [
      longitude + (widthX * actualOffset + (perpX * lineLength) / 2) * metersToLng,
      latitude + (widthY * actualOffset + (perpY * lineLength) / 2) * metersToLat,
    ];

    lines.push({
      type: 'Feature',
      properties: { entranceId: id },
      geometry: {
        type: 'LineString',
        coordinates: [lineStart, lineEnd],
      },
    });

    // 右端に到達したらループを終了
    if (actualOffset >= halfWidth) break;
  }

  return lines;
}
