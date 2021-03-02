export function onpressedPointer(element, callback, delay) {
  let isPressed = false;
  let e, isMainButton;
  element.addEventListener('mousedown', (e) => {
    isMainButton = e.button === 0;
    isPressed = true
  });
  element.addEventListener('mouseup', () => isPressed = false);
  element.addEventListener('mouseleave', () => isPressed = false);
  element.addEventListener('mousemove', (ev) => e = ev);
  let prevCallTime = 0;
  function loop() {
    if (isPressed && prevCallTime + delay < Date.now()) {
      prevCallTime = Date.now();
      callback(e, isMainButton);
    }
    requestAnimationFrame(loop);
  }
  loop();
}

export function onmove(element, callback) {
  element.addEventListener('mousemove', callback);
}

export function onclick(element, callback) {
  element.addEventListener('click', callback);
}

export function waitField(object, key, interval = 100) {
  return new Promise(next => {
    const interval = setInterval(function () {
      if (object[key] === undefined) return;
      clearInterval(interval);
      next();
    }, interval)
  })
}

export function onkey(keyCode, downCallback, upCallback) {
  window.addEventListener('keydown', (event) => {
    if (event.code === keyCode) downCallback(event);
  });
  window.addEventListener('keyup', (event) => {
    if (event.code === keyCode && upCallback) upCallback(event);
  });
}

export const KEY_CODES = {
  SPACE: 'Space',
  LEFT: 'ArrowLeft',
  UP: 'ArrowUp',
  RIGHT: 'ArrowRight',
  DOWN: 'ArrowDown',
}