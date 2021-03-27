export function checkPointInRect(pointX: number, pointY: number, [rectX1, rectY1, rectX2, rectY2]: TRect): boolean {
  return (pointX > rectX1 && pointX < rectX2) && (pointY > rectY1 && pointY < rectY2);
}
export function mathWrap(value: number, min: number, max: number): number {
  const range = max - min;
  return (min + ((((value - min) % range) + range) % range));
}
export function mathMax(value: number, max: number): number {
  return value > max ? value : max;
}
export function mathClamp(value: number, min: number, max: number): number {
  return value < min ? min : (value > max ? max : value);
}
