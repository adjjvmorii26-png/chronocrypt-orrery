/**
 * Orrery Terminal — coordinated single cycle
 */
const { flow } = require('../meridian/meridian_flow.js');
const { rotate } = require('../gyre/gyre_rotation.js');
const { evaluate } = require('../fracture/fracture_core.js');

async function run() {
  console.log('Orrery Terminal online. Running coordinated cycle…\n');
  const m = flow(0);
  const g = rotate(0);
  const f = evaluate(0);
  console.log('Meridian:', m);
  console.log('Gyre:', g);
  console.log('Fracture:', f);
}

if (require.main === module) run();
