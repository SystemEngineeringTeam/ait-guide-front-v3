export const BUILDING_FILL_COLORS = ['#c4d5ff', '#d0c4ff', '#ffe2c4', '#ffc4e2', '#ffc4c4', '#ff0000'] as const;
export const DEFAULT_COLOR = BUILDING_FILL_COLORS[0];

export type BuildingFillColor = (typeof BUILDING_FILL_COLORS)[number];
