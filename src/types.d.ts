type TState = {
  world: Matter.World,
  render: Matter.Render,
  engine: Matter.Engine,
  gravity: [number, number],
  radius: number,             // Interaction radius
  spatialHash: CSpatialHash
  renderBoundsPadding: TFourNumbers
  activeBoundsPadding: TFourNumbers
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