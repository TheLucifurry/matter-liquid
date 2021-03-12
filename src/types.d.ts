declare const DEV: boolean;

type TLiquidConfig = {
  engine: Matter.Engine
  render: Matter.Render
  liquids: TLiquidProps[]
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
  readonly liquids: Required<TLiquidProps>[]

  bordersBounce: number
  isPaused: boolean
  gravityRatio: number
  spatialHash: CSpatialHash
  renderBoundsPadding: TFourNumbers
  activeBoundsPadding: TFourNumbers
  particles: TLiquidParticle[]
  liquidOfParticleId: { [key: number]: TLiquidProps },
  freeParticleIds: number[]
  springs: TSpringList
  tick: number
  everyFrame: number
  timeScale: number
};

type TLiquidProps = {
  color?: string
  texture?: OffscreenCanvas
  plasticity?: number // a
  // stiffness?: number // k
};

type TLiquidParticle = Float32Array;

type TPadding = [top_vertical: number, right_horizontal: number, bottom?: number, left?: number];

type TVector = [number, number];

type TSHCellId = string;
type TSHItem = number;

type TRect = [ x1: number, y1: number, x2: number, y2: number ];

type TFourNumbers = [ number, number, number, number ];

type TOriginalBodyData = { x: number, y: number, a: number };

type TSpringList = {
  [key: string]: TSpring
};
type TSpring = number;

type TEvents = {
  pauseChange: (isPaused: boolean)=>void
  particleRemove: (particle: TLiquidParticle, particleId: number, liquid: TLiquidProps)=>void
};

type TSavedParticlesPositions = {
  [key: number]: TVector
}
;
