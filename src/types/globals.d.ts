declare const Matter: typeof import('matter-js');
declare const DEV: boolean;

// Core
type TLiquidConfig = {
  bounds: Matter.Bounds
  engine: Matter.Engine
  render: Matter.Render
  fluids: TFluidPrototype[]

  isPaused?: boolean
  enableChemics?: boolean
  isRegionalComputing?: boolean
  worldWrapping: boolean | [boolean, boolean]
  radius?: number
  timeScale?: number
  gravityRatio?: number
  bordersBounce?: number
  updateStep?: number
  particleTextureScale?: number

  // Dev-only
  isDebug?: boolean
};
type TLiquid = {
  readonly b: TBounds // World bounds
  readonly e: Matter.Engine // Engine
  readonly r: Matter.Render // Render
  readonly w: Matter.World // World
  readonly x: TChemicsStore // Chemics data storage
  readonly st: TStats // Statistics
  readonly c: WebGL2RenderingContext // Render context
  readonly h: number // Interaction radius
  readonly irc: boolean // isRegionalComputing
  readonly iwx: boolean // isWrappedX
  readonly iwy: boolean // isWrappedX
  readonly l: TFluidPrototypeComputed[] // Fluids prototypes
  readonly sh: TSpatialHash // SpatialHash
  readonly p: TParticle[] // Particles
  readonly fpl: { [key: number]: TFluidPrototypeComputed }, // FluidPrototypeLink by pid key
  readonly fnfid: { [key: string]: number }, // FluidNamesToFid
  readonly fpids: number[] // FreeParticleIds
  readonly ev: TEvents // Events store
  u: any // Compute update callback

  bb: number // BordersBounce
  ip: boolean // IsPaused
  g: number // GravityRatio
  rbp: number // RenderBoundsPadding
  abp: number // ActiveBoundsPadding
  dt: number // Delta time
};

type TStats = {
  // c: number // Particles count
  cl: number[] // Particles count by liquid prototypes
};

// Chemics
type TChemicalReactionData = [number[][], number[][]];
type TChemicalReactionCallback = (data: TChemicalReactionData) => void;
type TChemicsStore = {
  step: number[], // Iteration step
  ready: boolean[] // true when it is an iteration for check collisions
  data: { [key: number]: number[] }[], // Prepared collisions data
  reacts: boolean[] // Possibility of reaction for every fluid id
  cbl: TChemicalReactionCallback[] // Callbacks list
};

// Fluid & particle
type TFluidPrototype = {
  name?: string
  color?: string
  texture?: TVirtualCanvas
  mass?: number,
  chemicsUS?: number // Chemics update step
  // plasticity?: number // a
  // stiffness?: number // k
};
type TFluidPrototypeComputed = [
  number, // Fluid id
  string, // Color
  TFourNumbers, // Vec4 color
  TVirtualCanvas, // Texture
  number, // Mass
];
type TFluidKey = string | number;
type TParticle = Float32Array;
type TParticleId = number;

// Spatial hash
type TSHCellId = number;
type TSHItem = number;

// Compute cache
type TOriginalBodyData = { x: number, y: number, a: number };
type TSavedParticlesPositions = {
  [key: number]: TVector
};

// Events
type TEvents = {
  pauseChange: (isPaused: boolean)=>void
  particleRemove: (particle: TParticle, particleId: number, liquid: TFluidPrototypeComputed)=>void
};

// Basic
type TRect = [ x1: number, y1: number, x2: number, y2: number ];
type TBounds = [x: number, y: number, x2: number, y2: number, w: number, h: number];
type TVector = [number, number];
type TFourNumbers = [ number, number, number, number ];
type TVirtualCanvas = OffscreenCanvas | HTMLCanvasElement;
