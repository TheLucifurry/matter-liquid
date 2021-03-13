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
  readonly engine: Matter.Engine
  readonly render: Matter.Render
  readonly world: Matter.World
  readonly radius: number // Interaction radius
  readonly isRegionalComputing: boolean
  readonly isWrappedX: boolean
  readonly isWrappedY: boolean
  readonly liquids: Required<TLiquidPrototype>[]

  bordersBounce: number
  isPaused: boolean
  gravityRatio: number
  spatialHash: CSpatialHash
  renderBoundsPadding: TFourNumbers
  activeBoundsPadding: TFourNumbers
  particles: TParticle[]
  liquidOfParticleId: { [key: number]: TLiquidPrototype },
  freeParticleIds: number[]
  springs: TSpringList
  tick: number
  everyFrame: number
  timeScale: number
};

// Liquid & particle
type TLiquidPrototype = {
  color?: string
  texture?: OffscreenCanvas
  plasticity?: number // a
  // stiffness?: number // k
};
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
  particleRemove: (particle: TParticle, particleId: number, liquid: TLiquidPrototype)=>void
};

// Basic
type TRect = [ x1: number, y1: number, x2: number, y2: number ];
type TPadding = [top_vertical: number, right_horizontal: number, bottom?: number, left?: number];
type TVector = [number, number];
type TFourNumbers = [ number, number, number, number ];
