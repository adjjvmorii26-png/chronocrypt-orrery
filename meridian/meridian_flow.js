/**
 * Chronocrypt Orrery — Meridian Flow
 * Advances linear temporal streams and reports vector coherence.
 */

const fs = require('fs');
const path = require('path');

const CONFIG = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'chronocrypt.config'), 'utf8'));
const STREAMS_DIR = path.join(__dirname, 'streams');

function loadStream(name) {
  const file = path.join(STREAMS_DIR, `stream_${name}.mer`);
  const txt = fs.readFileSync(file, 'utf8');
  const velocity = parseFloat((txt.match(/velocity:\s*([\d.]+)/) || [])[1] || 0.5);
  const phase = parseFloat((txt.match(/phase:\s*([\d.]+)/) || [])[1] || 0);
  return { name, velocity, phase };
}

function flow(tick = 0) {
  const alpha = loadStream('alpha');
  const beta  = loadStream('beta');
  const gamma = loadStream('gamma');

  const wA = 0.42 + 0.08 * Math.sin(tick * 0.15 + alpha.phase);
  const wB = 0.33 + 0.08 * Math.cos(tick * 0.12 + beta.phase);
  const wG = 0.25 + 0.07 * Math.sin(tick * 0.19 + gamma.phase);
  const sum = wA + wB + wG;

  const vector = (alpha.velocity * wA + beta.velocity * wB + gamma.velocity * wG) / sum;
  const coherence = Math.max(0, 1 - Math.abs(alpha.velocity - beta.velocity) * 0.6);

  return {
    tick,
    weights: { alpha: +wA.toFixed(3), beta: +wB.toFixed(3), gamma: +wG.toFixed(3) },
    vector: +vector.toFixed(3),
    coherence: +coherence.toFixed(3)
  };
}

module.exports = { flow, loadStream };

if (require.main === module) {
  console.log('MERIDIAN flow online…\n');
  for (let t = 0; t < 10; t++) {
    const r = flow(t);
    console.log(`[meridian] tick=${t}  vector=${r.vector}  coherence=${r.coherence}  w=${JSON.stringify(r.weights)}`);
  }
}
