import { randomInt } from './utils.js';

function palette(particle, background) {
  return { particle, background };
}
const palettes = [
  palette('cyan', '#050820'),
  palette('orange', '#140B02'),
  palette('lime', '#051102'),
  palette('violet', '#150320'),
  palette('white', '#111'),
]
let currentPaletteId = randomInt(0, palettes.length - 1);

export default {
  getPalette() {
    currentPaletteId = currentPaletteId + 1 < palettes.length ? currentPaletteId + 1 : 0;
    return palettes[currentPaletteId];
  },
  palettes,
}