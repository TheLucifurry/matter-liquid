export default function VirtualCanvas(width: number, height: number): TVirtualCanvas {
  if (OffscreenCanvas) {
    return new OffscreenCanvas(width, height);
  }
  const canvas = document.createElement('canvas');
  canvas.height = height;
  canvas.width = width;
  return canvas;
}
