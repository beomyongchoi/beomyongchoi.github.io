// node scripts/lab-depth.check.mjs — no norm: the signal explodes with depth; Post-LN keeps its size but
// washes out the input after a few layers; Pre-LN keeps ~1/√(L+1) of it; the backward pass is a true gradient.
import assert from "node:assert/strict";
import { makeStack, run, ffnParams } from "../public/lab/depth.js";

// 16 random stacks of width 128: one stack's cosine is noisy (±0.07), the average isn't.
const stacks = Array.from({ length: 16 }, (_, k) => makeStack({ layers: 48, d: 128, seed: k + 1 }));
const avg = (L, mode, key, kind = "rms") => stacks.reduce((s, S) => s + run(S, mode, kind, L)[key].at(-1), 0) / stacks.length;
assert.ok(avg(48, "none", "fwd") > 1e5, "no norm explodes");
assert.ok(Math.abs(avg(48, "post", "fwd") - 1) < 1e-3 && Math.abs(avg(48, "pre", "fwd") - 1) < 1e-3, "normed outputs have RMS 1");
assert.ok(Math.abs(avg(24, "post", "keep")) < 0.08, "post-LN washes out the input");
for (const L of [12, 48]) { const k = avg(L, "pre", "keep"); assert.ok(Math.abs(k - 1 / Math.sqrt(L + 1)) < 0.06, `pre keep ${k} at ${L}`); }

// Finite differences: d<gOut, output>/dx0 matches the backward pass, for every mode and norm.
for (const mode of ["none", "post", "pre"]) for (const kind of ["layer", "rms"]) {
  const S = makeStack({ layers: 6, d: 16, seed: 3 }), g = run(S, mode, kind).gx0;
  const val = (x0) => run({ ...S, x0 }, mode, kind).out.reduce((s, y, i) => s + y * S.gOut[i], 0);
  for (const j of [0, 7]) {
    const a = Float64Array.from(S.x0), b = Float64Array.from(S.x0), e = 1e-5; a[j] += e; b[j] -= e;
    const num = (val(a) - val(b)) / (2 * e);
    assert.ok(Math.abs(num - g[j]) < 1e-4 * Math.max(1, Math.abs(num)), `${mode}/${kind}[${j}] ${num} vs ${g[j]}`);
  }
}
assert.equal(ffnParams(4096, 4 * 4096, false), ffnParams(4096, (8 / 3) * 4096, true), "SwiGLU at 8/3·d matches a 4d FFN");
console.log(`depth.js ok (48 layers: no norm ×${avg(48, "none", "fwd").toExponential(1)}, input kept post ${avg(48, "post", "keep").toFixed(3)} vs pre ${avg(48, "pre", "keep").toFixed(3)})`);
