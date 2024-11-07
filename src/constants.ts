// Defaults
export const WORLD_WIDTH = 32_768
export const INTERACTION_RADIUS = 32
export const GRAVITY_RATIO = 0.2
export const UPDATE_STEP = 2
export const TIME_SCALE = 1
export const IS_REGIONAL_COMPUTING = false
export const IS_WORLD_WRAPPED = false
export const PARTICLE_TEX_RADIUS_SCALE = 0.3
export const BORDERS_BOUNCE_VALUE = 0.5
export const PARTICLE_COLOR = '#fff'
export const CHEMICS_ITERATION_STEP = 10 // every 10 frame (6 FPS for 60 FPS of engine)

// Constants
export const VELOCITY_LIMIT_FACTOR = 0.75

/** Particle structure pointer to value of X position */
export const X = 0
/** Particle structure pointer to value of Y position */
export const Y = 1
/** Particle structure pointer to value of X velocity */
export const VEL_X = 2
/** Particle structure pointer to value of Y velocity */
export const VEL_Y = 3

export const F_ID = 0
export const F_COLOR = 1
export const F_COLOR_VEC4 = 2
export const F_TEXTURE = 3
export const F_MASS = 4
