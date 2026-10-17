// node scripts/lab-gpu.check.mjs — sizes match the real config; same seed = same arrivals in every round;
// accepting everything crashes MHA every time and GQA often, never MQA; planning for final lengths never crashes.
import assert from "node:assert/strict";
import { ROUNDS, newRound, step, promised, perToken, used, GPU, TICKS, WEIGHTS, chatTarget } from "../public/lab/gpu.js";

assert.equal(perToken(ROUNDS[1]), 2 * 32 * 8 * 128 * 2, "GQA: 128 KiB per token");
assert.equal(perToken(ROUNDS[0]) / perToken(ROUNDS[2]), 32);
assert.ok(WEIGHTS > 15e9 && WEIGHTS < 17e9, `weights ${WEIGHTS}`);
assert.equal(chatTarget(4, 9), chatTarget(4, 9));

const fits = (s, o) => promised(s) + o.target * perToken(s.round) <= GPU;
const P = {
  greedy: (s) => (s.offers[0] ? { accept: s.offers[0].id } : null),
  careful: (s) => { const o = [...s.offers].sort((a, b) => a.target - b.target).find((o) => fits(s, o)); return o ? { accept: o.id } : null; },
};
const out = {};
for (const r of ROUNDS) for (const [n, p] of Object.entries(P)) {
  let oom = 0, served = 0;
  for (let seed = 1; seed <= 50; seed++) {
    let s = newRound(seed, r);
    while (!s.oom && s.t < TICKS) { s = step(s, p(s)); assert.ok(s.oom || used(s) <= GPU); }
    oom += s.oom; served += s.served;
  }
  out[`${r.name} ${n}`] = { oom, served: Math.round(served / 50 / 1000) + "K" };
}
assert.equal(out["MHA greedy"].oom, 50);
assert.ok(out["GQA greedy"].oom > 5 && out["GQA greedy"].oom < 45, "GQA needs some care");
assert.equal(out["MQA greedy"].oom, 0);
for (const r of ROUNDS) assert.equal(out[`${r.name} careful`].oom, 0);
console.log("gpu.js ok", JSON.stringify(out));
