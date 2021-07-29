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
  readonly bounds: TBounds // World bounds
  readonly engine: Matter.Engine // Engine
  readonly render: Matter.Render // Render
  readonly world: Matter.World // World
  readonly chemicsStore: TChemicsStore // Chemics data storage
  readonly statistics: TStats // Statistics
  readonly renderContext: WebGL2RenderingContext // Render context
  readonly h: number // Interaction radius
  readonly isRegionalComputing: boolean // isRegionalComputing
  readonly isWrappedX: boolean // isWrappedX
  readonly isWrappedY: boolean // isWrappedX
  readonly fluids: TFluidPrototypeComputed[] // Fluids prototypes
  readonly spatialHash: TSpatialHash // SpatialHash
  readonly particles: TParticle[] // Particles
  readonly fluidByParticleId: Record<number, TFluidPrototypeComputed>, // FluidPrototypeLink by pid key
  readonly fluidIdByParticleId: Record<string, number>, // FluidNamesToFid
  readonly freeParticleIds: number[] // FreeParticleIds
  readonly events: TEvents // Events store
  updateCompute: any // Compute update callback

  worldBordersBounce: number // BordersBounce
  isPaused: boolean // IsPaused
  gravityRatio: number // GravityRatio
  renderBoundsPadding: number // RenderBoundsPadding
  activeBoundsPadding: number // ActiveBoundsPadding
  timeDelta: number // Delta time
};

type TStats = {
  // c: number // Particles count
  particlesCountByFluidId: number[] // Particles count by liquid prototypes
};

// Chemics
type TChemicalReactionData = [number[][], number[][]];
type TChemicalReactionCallback = (data: TChemicalReactionData) => void;
type TChemicsStore = {
  iterStepByFid: number[], // Iteration step by fluid
  isReactableByFid: boolean[] // Is reactions enabled for fluid
  isReadyByFid: boolean[] // Is ready to compute reaction on current iteration
  data: Record<number, number[]>[], // Prepared collisions data
  callbackByFid: TChemicalReactionCallback[] // Callbacks list
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
type TSavedParticlesPositions = Record<number, TVector>;

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
