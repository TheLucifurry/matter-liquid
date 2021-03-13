import { randomArrayItem } from './utils.js';

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

export default {
  getRandomPalette() {
    return randomArrayItem(palettes);
  },
  palettes,
}