/**
 * Chronocrypt Orrery — Fracture Core
 * Tracks entropy, evaluates suture potential, reports risk.
 */

const fs = require('fs');
const path = require('path');

const CONFIG = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'chronocrypt.config'), 'utf8'));
const SHARDS_DIR = path.join(__dirname, 'shards');

function listShards() {
  return fs.readdirSync(SHARDS_DIR)
    .filter(f => f.endsWith('.frx'))
    .map(f => {
      const txt = fs.readFileSync(path.join(SHARDS_DIR, f), 'utf8');
      const entropy = parseFloat((txt.match(/entropy:\s*([\d.]+)/) || [])[1] || 0.4);
      const suture = parseFloat((txt.match(/suture_potential:\s*([\d.]+)/) || [])[1] || 0.5);
      return { file: f, entropy, suture };
    });
}

function evaluate(tick = 0) {
  const shards = listShards();
  const avgEntropy = shards.reduce((s, x) => s + x.entropy, 0) / Math.max(1, shards.length);
  const avgSuture = shards.reduce((s, x) => s + x.suture, 0) / Math.max(1, shards.length);
  const risk = avgEntropy > CONFIG.fracture.entropy_cap;
  const canSuture = avgSuture >= CONFIG.fracture.suture_threshold;

  console.log(`[fracture] tick=${String(tick).padStart(2)}  entropy=${avgEntropy.toFixed(3)}  suture=${avgSuture.toFixed(3)}  risk=${risk}  can_suture=${canSuture}`);
  return { avgEntropy: +avgEntropy.toFixed(3), avgSuture: +avgSuture.toFixed(3), risk, canSuture, shards: shards.length };
}

module.exports = { evaluate, listShards };

if (require.main === module) {
  console.log('FRACTURE core online…\n');
  for (let t = 0; t < 8; t++) evaluate(t);
}
