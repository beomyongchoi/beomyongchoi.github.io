// node scripts/lab-tower.check.mjs — same seed = same tower; size and memory follow the residual math;
// thoughtful play (save Pre-LN for big blocks, reset only near the top) clearly beats any one-button play.
import assert from "node:assert/strict";
import { newGame, step, blockAt, MAX_SIGNAL } from "../public/lab/tower.js";

const play = (seed, pol) => { let g = newGame(seed); while (!g.dead && g.h < 500) g = step(g, pol(g, blockAt(seed, g.h))); return g; };
const P = {
  plain: () => "plain",
  post: () => "post",
  pre: (g) => (g.tok ? "pre" : "post"),
  smart: (g, k) => (g.tok && (k > 0.6 || g.m < 0.2) ? "pre" : g.s > 30 ? "post" : "plain"),
};
assert.equal(blockAt(3, 10), blockAt(3, 10));
assert.deepEqual(play(5, P.smart), play(5, P.smart));
// One plain block of strength k: size ×√(1+k²); Post-LN resets size to 1 but memory drops the same.
const g1 = step(newGame(1), "plain"), g2 = step(newGame(1), "post"), k = blockAt(1, 0);
assert.ok(Math.abs(g1.s - Math.hypot(1, k)) < 1e-12 && g2.s === 1 && Math.abs(g1.m - g2.m) < 1e-12);
// Pre-LN dilutes memory less when the stream is already big.
const big = { ...newGame(1), s: 20 }, small = newGame(1);
assert.ok(step(big, "pre").m > step(small, "pre").m);
assert.equal(step({ ...newGame(1), s: MAX_SIGNAL }, "plain").dead, "explode");

const avg = {};
for (const [n, p] of Object.entries(P)) { let t = 0; for (let seed = 1; seed <= 200; seed++) t += play(seed, p).h; avg[n] = t / 200; }
assert.ok(avg.smart > 1.6 * Math.max(avg.plain, avg.post, avg.pre), JSON.stringify(avg));
console.log(`tower.js ok (avg floors over 200 seeds: ${Object.entries(avg).map(([n, v]) => `${n} ${v.toFixed(1)}`).join(", ")})`);
