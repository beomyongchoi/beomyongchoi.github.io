// node scripts/lab-safe.check.mjs — every safe has exactly one opening number in its range, and the
// grip is the RoPE relative score: it depends only on secret − guess.
import assert from "node:assert/strict";
import { LEVELS, grip, angles, periods } from "../public/lab/safe.js";

LEVELS.forEach((lv, li) => {
  let second = -Infinity;
  for (const secret of [1, Math.floor(lv.range / 2), lv.range - 1]) {
    assert.ok(Math.abs(grip(secret, secret, lv) - 1) < 1e-12);
    for (let g = 0; g < lv.range; g++) if (g !== secret) second = Math.max(second, grip(secret, g, lv));
  }
  assert.ok(second < 0.999, `level ${li + 1}: a wrong number grips ${second}`);
  assert.ok(Math.abs(grip(50, 40, lv) - grip(150, 140, lv)) < 1e-12, "grip depends only on the gap");
  console.log(`  safe ${li + 1}: ${lv.hands} hands, range ${lv.range}, best wrong grip ${(second * 100).toFixed(1)}%`);
});
assert.equal(angles(0, LEVELS[3]).every((a) => a === 0), true);
assert.ok(Math.abs(periods(LEVELS[1])[0] - 2 * Math.PI) < 1e-12, "fastest hand = RoPE's 2π tokens per turn");
console.log("safe.js ok");
