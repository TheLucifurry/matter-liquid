export const DEFAULT_WORLD_WIDTH = 32_768;
export const DEFAULT_INTERACTION_RADIUS = 32;
export const DEFAULT_GRAVITY_RADIUS = 0.1;
export const DEF_EVERY_FRAME = 2;
export const DEF_TIME_SCALE = 1;

export const PARTICLE_PROPS = {
  X: 0,
  Y: 1,
  VEL_X: 2,
  VEL_Y: 3,
  LIQUID_ID: 4,
};

export const WORKER_METHODS = {
  UPDATE: 0,
  SET_RENDER_BOUNDS: 1,
}

export const WORKER_EVENTS = {
  RENDER_DATA: 0,
}