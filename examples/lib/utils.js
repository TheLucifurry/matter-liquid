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

export function onmove(element, callback) {
  element.addEventListener('mousemove', callback);
}

export function onclick(element, callback) {
  element.addEventListener('click', callback);
}

export function waitField(object, key, interval = 100) {
  return new Promise(next => {
    const intervalid = setInterval(function () {
      if (object[key] === undefined) return;
      clearInterval(intervalid);
      next();
    }, interval)
  })
}

export function onkey(keyCode, downCallback, upCallback) {
  window.addEventListener('keydown', (event) => {
    if (event.code === keyCode) downCallback(event);
  });
  window.addEventListener('keyup', (event) => {
    if (event.code === keyCode) upCallback(event);
  });
}

export const KEY_CODES = {
  LEFT: 'ArrowLeft',
  UP: 'ArrowUp',
  RIGHT: 'ArrowRight',
  DOWN: 'ArrowDown',
}