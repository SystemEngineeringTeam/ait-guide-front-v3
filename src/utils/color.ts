import { GeoJSONData } from '@/types/facilities';

export function darkenColor(hex: string, amount: number = 0.3): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.floor((num >> 16) * (1 - amount)));
  const g = Math.max(0, Math.floor(((num >> 8) & 0x00ff) * (1 - amount)));
  const b = Math.max(0, Math.floor((num & 0x0000ff) * (1 - amount)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export function getFeaturesColor(facility: GeoJSONData): string | undefined {
  return facility.data.features.map((f) => f?.properties?.color).find((color) => color);
}
