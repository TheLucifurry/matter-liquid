type TStore = {
  world: Matter.World
  render: Matter.Render
  engine: Matter.Engine
  isPaused: boolean
  gravityRatio: number
  radius: number             // Interaction radius
  spatialHash: CSpatialHash
  renderBoundsPadding: TFourNumbers
  activeBoundsPadding: TFourNumbers
  liquids:  Required<TLiquidProps>[]
  particles: TLiquidParticle[]
}

type TLiquidProps = {
  isStatic?: boolean
  color?: string
  plasticity?: number // a
  // stiffness?: number // k
};

type TLiquidParticle = [ x: number, y: number, px: number, py: number, vx: number, vy: number, lid: number ];

type TPadding = [top_vertical: number, right_horizontal: number, bottom?: number, left?: number];

type TVector = [number, number];

type TSpatialHashItem = number;

type TRect = [ x1: number, y1: number, x2: number, y2: number ];

type TFourNumbers = [ number, number, number, number ];

type TOriginalBodyData = { x: number, y: number, a: number };