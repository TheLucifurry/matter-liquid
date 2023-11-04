export function checkPointInRect(pointX: number, pointY: number, [rectX1, rectY1, rectX2, rectY2]: TRect | TBounds): boolean {
  return (pointX > rectX1 && pointX < rectX2) && (pointY > rectY1 && pointY < rectY2)
}
export function mathWrap(value: number, min: number, max: number): number {
  const range = max - min
  return (min + ((((value - min) % range) + range) % range))
}
export function mathMax(value: number, max: number): number {
  return value > max ? value : max
}
export function mathClamp(value: number, min: number, max: number): number {
  return value < min ? min : (value > max ? max : value)
}
export function arrayDeleteItem(arr: any[], item: any) {
  const ix = arr.indexOf(item)
  if (ix !== -1)
    arr.splice(ix, 1)
  return arr
}
export function colorHexToVec4(color: string): TFourNumbers {
  const s = color.length
  const [_, c1, c2, c3, c4, c5, c6, c7, c8] = color
  // rgb(a)
  if (s < 6) {
    return [
      +`0x${c1}` / 15,
      +`0x${c2}` / 15,
      +`0x${c3}` / 15,
      (s === 5 ? +`0x${c4}` / 15 : 1),
    ]
  }
  // rrggbb(aa)
  return [
    +`0x${c1}${c2}` / 255,
    +`0x${c3}${c4}` / 255,
    +`0x${c5}${c6}` / 255,
    (s === 9 ? +`0x${c7}${c8}` / 255 : 1),
  ]
}
