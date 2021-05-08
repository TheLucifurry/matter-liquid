declare module ASModule {
  type i8 = number;
  type i16 = number;
  type i32 = number;
  type i64 = bigint;
  type isize = number;
  type u8 = number;
  type u16 = number;
  type u32 = number;
  type u64 = bigint;
  type usize = number;
  type f32 = number;
  type f64 = number;
  type bool = boolean | number;
  export class SpatialHash {
    static wrap(ptr: usize): SpatialHash;
    valueOf(): usize;
    constructor(cellSize: i32, boundsMinX: i32, boundsMinY: i32, boundsMaxX: i32, boundsMaxY: i32);
    update(item: u32, x: i32, y: i32): void;
    insert(item: u32, x: i32, y: i32): void;
    remove(item: u32): void;
    getNearby(x: i32, y: i32): usize;
    getFromBounds(boundsMinX: i32, boundsMinY: i32, boundsMaxX: i32, boundsMaxY: i32): usize;
  }
}
export default ASModule;
