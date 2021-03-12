import { randomArrayItem } from './utils.js';

const particlePalette = ['cyan', 'orange', 'lime', 'violet'];

const bgPaletteTable = {
  'cyan': '#050820',
  'orange': '#140B02',
  'lime': '#051102',
  'violet': '#150320',
};

export default {
  getRandom() {
    return randomArrayItem(particlePalette);
  },
  getBackgroundFor(color) {
    return bgPaletteTable[color];
  },
}