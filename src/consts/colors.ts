export const FACILITY_FILL_COLORS = ['#c4d5ff', '#aae4ba', '#ffe2c4', '#ffc4e2', '#ff9190', '#f2edfd'] as const;
export const DEFAULT_COLOR = FACILITY_FILL_COLORS[0];

export type FacilityFillColor = (typeof FACILITY_FILL_COLORS)[number];
