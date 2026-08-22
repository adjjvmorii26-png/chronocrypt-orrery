/**
 * Chronocrypt Orrery — Gyre Rotation
 * Advances cyclic periods and reports spiral state.
 */

const fs = require('fs');
const path = require('path');

const CONFIG = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'chronocrypt.config'), 'utf8'));
const CYCLES_DIR = path.join(__dirname, 'cycles');

function loadCycles() {
  return fs.readdirSync(CYCLES_DIR)
    .filter(f => f.endsWith('.gyr'))
    .map(f => {
      const txt = fs.readFileSync(path.join(CYCLES_DIR, f), 'utf8');
      const period = parseFloat((txt.match(/period:\s*([\d.]+)/) || [])[1] || 24);
      const amplitude = parseFloat((txt.match(/amplitude:\s*([\d.]+)/) || [])[1] || 0.5);
      return { file: f, period, amplitude };
    });
}

function rotate(tick = 0) {
  const cycles = loadCycles();
  const base = CONFIG.gyre.base_period;
  const angle = (tick % base) / base * Math.PI * 2;
  const spiral = Math.sin(angle) * CONFIG.gyre.spiral_gain + cycles.reduce((s, c) => s + c.amplitude, 0) / cycles.length * 0.3;
  const stability = Math.max(0, 1 - Math.abs(spiral) * 1.2);

  return {
    tick,
    angle: +angle.toFixed(3),
    spiral: +spiral.toFixed(3),
    stability: +stability.toFixed(3),
    cycles: cycles.length
  };
}

module.exports = { rotate, loadCycles };

if (require.main === module) {
  console.log('GYRE rotation online…\n');
  for (let t = 0; t < 12; t++) {
    const r = rotate(t);
    console.log(`[gyre] tick=${t}  angle=${r.angle}  spiral=${r.spiral}  stability=${r.stability}`);
  }
}
