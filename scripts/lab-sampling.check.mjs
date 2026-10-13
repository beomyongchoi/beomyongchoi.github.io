import assert from "node:assert/strict";
import { truncate, sample, entropy } from "../public/lab/sampling.js";
const P = [0.05, 0.5, 0.2, 0.15, 0.1]; // sorted ids: 1,2,3,4,0
assert.equal(truncate(P).kept, 5);
assert.equal(truncate(P, { k: 2 }).kept, 2);
assert.deepEqual(truncate(P, { k: 2 }).keep, [false, true, true, false, false]);
assert.equal(truncate(P, { p: 0.7 }).kept, 2);          // .5+.2 = .7 reaches p
assert.equal(truncate(P, { p: 0.71 }).kept, 3);
assert.equal(truncate(P, { p: 0.01 }).kept, 1);         // never empty
assert.equal(truncate(P, { minP: 0.3 }).kept, 3);       // cut = .15 → .5,.2,.15
assert.equal(truncate(P, { k: 4, p: 0.95, minP: 0.25 }).kept, 3);
const r = truncate(P, { k: 2 });
assert.ok(Math.abs(r.probs.reduce((a, b) => a + b) - 1) < 1e-12);
assert.equal(sample(r.probs, () => 0.99), 2);
assert.equal(sample(r.probs, () => 0), 1);
assert.equal(entropy([0.5, 0.5]), 1);
console.log("sampling.js ok");
