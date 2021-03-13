declare const DEV: boolean;

// Core
type TLiquidConfig = {
  engine: Matter.Engine
  render: Matter.Render
  liquids: TLiquidPrototype[]

  isAdvancedAlgorithm?: boolean
  isRegionalComputing?: boolean
  gravityRatio?: number
  radius?: number
  isPaused?: boolean
  updateEveryFrame?: number
  timeScale?: number
  worldWrapping: boolean | [boolean, boolean]
  bordersBounce : number
  isDebug?: boolean
  particleTextureScale?: number
};
type TStore = {
  readonly e: Matter.Engine // Engine
  readonly r: Matter.Render // Render
  readonly w: Matter.World // World
  readonly h: number // Interaction radius
  readonly irc: boolean // isRegionalComputing
  readonly iwx: boolean // isWrappedX
  readonly iwy: boolean // isWrappedX
  readonly l: TLiquidPrototypeComputed[] // Liquids prototypes
  readonly sh: CSpatialHash // SpatialHash
  readonly p: TParticle[] // Particles
  readonly lpl: { [key: number]: TLiquidPrototypeComputed }, // LiquidPrototypeLink
  readonly fpids: number[] // FreeParticleIds
  readonly s: TSpringList // Springs

  bb: number // BordersBounce
  ip: boolean // IsPaused
  g: number // GravityRatio
  rbp: TFourNumbers // RenderBoundsPadding
  abp: TFourNumbers // ActiveBoundsPadding
  t: number // Tick
  ef: number // EveryFrame
  dt: number // Delta time
};

// Liquid & particle
type TLiquidPrototype = {
  color?: string
  texture?: OffscreenCanvas
  // plasticity?: number // a
  // stiffness?: number // k
};
type TLiquidPrototypeComputed = [
  string, // Color
  OffscreenCanvas, // Texture
];
type TParticle = Float32Array;

// Spatial hash
type TSHCellId = string;
type TSHItem = number;

// Compute cache
type TOriginalBodyData = { x: number, y: number, a: number };
type TSpringList = {
  [key: string]: TSpring
};
type TSpring = number;
type TSavedParticlesPositions = {
  [key: number]: TVector
};

// Events
type TEvents = {
  pauseChange: (isPaused: boolean)=>void
  particleRemove: (particle: TParticle, particleId: number, liquid: TLiquidPrototypeComputed)=>void
};

// Basic
type TRect = [ x1: number, y1: number, x2: number, y2: number ];
type TPadding = [top_vertical: number, right_horizontal: number, bottom?: number, left?: number];
type TVector = [number, number];
type TFourNumbers = [ number, number, number, number ];
