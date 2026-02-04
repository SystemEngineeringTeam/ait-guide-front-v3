export const FACILITY_FILL_COLORS = ['#c4d5ff', '#d0c4ff', '#ffe2c4', '#ffc4e2', '#ffc4c4', '#ff9190'] as const;
export const DEFAULT_COLOR = FACILITY_FILL_COLORS[0];

export type FacilityFillColor = (typeof FACILITY_FILL_COLORS)[number];
