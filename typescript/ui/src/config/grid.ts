// 16:9 grid with fine granularity
export const ASPECT_WIDTH = 16;
export const ASPECT_HEIGHT = 9;
export const CELLS_PER_ASPECT = 10;

export const GRID_COLS = ASPECT_WIDTH * CELLS_PER_ASPECT;
export const GRID_ROWS = ASPECT_HEIGHT * CELLS_PER_ASPECT;
export const ASPECT = ASPECT_WIDTH / ASPECT_HEIGHT; // 16:9

// Maximum padding (px) added to try to letterbox to 16:9
export const MAX_PADDING = 500;
export const MIN_PADDING = 10;
