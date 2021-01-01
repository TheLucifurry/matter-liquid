export function onpressedPointer(element, callback) {
  let isPressed = false;
  let e;
  element.addEventListener('mousedown', () => isPressed = true);
  element.addEventListener('mouseup', () => isPressed = false);
  element.addEventListener('mousemove', (ev) => e = ev);
  function loop() {
    if (isPressed) {
      callback(e);
    }
    requestAnimationFrame(loop);
  }
  loop();
}
