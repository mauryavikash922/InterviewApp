export const ROW_COUNT = 10;
export const LEFT_BLOCK: readonly string[] = ['A', 'B', 'C'];
export const RIGHT_BLOCK: readonly string[] = ['D', 'E', 'F'];
export const ALL_COLUMNS: readonly string[] = [...LEFT_BLOCK, ...RIGHT_BLOCK];
export const WINDOW_COLUMNS: readonly string[] = ['A', 'F'];
export const AISLE_COLUMNS: readonly string[] = ['C', 'D'];
export const MAX_ADJACENT_GROUP = LEFT_BLOCK.length;

export const HOLD_DURATION_MS = 5 * 60 * 1000;
export const HOLD_TICK_MS = 1000;

export const MIN_PASSENGERS = 1;
export const MAX_PASSENGERS = 6;

export const OCCUPANCY_RATIO = 0.25;
export const MOCK_LATENCY_MS = 400;
