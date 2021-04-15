declare module '*.vert' {
  const value: string;
  export default value;
}
declare module '*.frag' {
  const value: string;
  export default value;
}
declare const DEV: boolean;

// Core
type TLiquidConfig = {
  engine: Matter.Engine
  render: Matter.Render
  liquids: TLiquidPrototype[]

  isPaused?: boolean
  isAdvancedAlgorithm?: boolean
  isRegionalComputing?: boolean
  worldWrapping: boolean | [boolean, boolean]
  radius?: number
  timeScale?: number
  gravityRatio?: number
  bordersBounce?: number
  updateEveryFrame?: number
  particleTextureScale?: number

  // Dev-only
  isDebug?: boolean
};
type TLiquid = {
  readonly e: Matter.Engine // Engine
  readonly r: Matter.Render // Render
  readonly w: Matter.World // World
  readonly st: TStats // Statistics
  readonly c: WebGL2RenderingContext // Render context
  readonly h: number // Interaction radius
  readonly irc: boolean // isRegionalComputing
  readonly iwx: boolean // isWrappedX
  readonly iwy: boolean // isWrappedX
  readonly l: TLiquidPrototypeComputed[] // Liquids prototypes
  readonly sh: TSpatialHash // SpatialHash
  readonly p: TParticle[] // Particles
  readonly lpl: { [key: number]: TLiquidPrototypeComputed }, // LiquidPrototypeLink
  readonly lnlid: { [key: string]: number }, // LiquidNamesToLid
  readonly fpids: number[] // FreeParticleIds
  readonly s: TSpringList // Springs
  readonly ev: TEvents // Events store
  u: any // Compute update callback

  bb: number // BordersBounce
  ip: boolean // IsPaused
  g: number // GravityRatio
  rbp: number // RenderBoundsPadding
  abp: number // ActiveBoundsPadding
  t: number // Tick
  ef: number // EveryFrame
  dt: number // Delta time
};

type TStats = {
  // c: number // Particles count
  cl: number[] // Particles count by liquid prototypes
};

// Liquid & particle
type TLiquidPrototype = {
  name?: string
  color?: string
  texture?: TVirtualCanvas
  mass?: number,
  // plasticity?: number // a
  // stiffness?: number // k
};
type TLiquidPrototypeComputed = [
  number, // Liquid id
  string, // Color
  TFourNumbers, // Vec4 color
  TVirtualCanvas, // Texture
  number, // Mass
];
type TLiquidKey = string | number;
type TParticle = Float32Array;

// Spatial hash
type TSHCellId = number;
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
type TVector = [number, number];
type TFourNumbers = [ number, number, number, number ];
type TVirtualCanvas = OffscreenCanvas | HTMLCanvasElement;
