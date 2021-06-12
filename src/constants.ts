// Defaults
export const WORLD_WIDTH = 32_768;
export const INTERACTION_RADIUS = 32;
export const GRAVITY_RATIO = 0.2;
export const UPDATE_STEP = 2;
export const TIME_SCALE = 1;
export const IS_REGIONAL_COMPUTING = false;
export const IS_WORLD_WRAPPED = false;
export const PARTICLE_TEX_RADIUS_SCALE = 0.3;
export const BORDERS_BOUNCE_VALUE = 0.5;
export const PARTICLE_COLOR = '#fff';
export const CHEMICS_ITERATION_STEP = 10; // every 10 frame (6 FPS for 60 FPS of engine)

// Constants
export const VELOCITY_LIMIT_FACTOR = 0.75;
export const P = {
  X: 0,
  Y: 1,
  VEL_X: 2,
  VEL_Y: 3,
};
export const L = {
  ID: 0,
  COLOR: 1,
  COLOR_VEC4: 2,
  TEXTURE: 3,
  MASS: 4,
};
