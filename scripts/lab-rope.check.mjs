// node scripts/lab-rope.check.mjs — RoPE scores depend only on distance; added positions don't;
// rotation keeps length; the Llama 3.1 rescale leaves fast hands alone and slows slow ones 8×.
import assert from "node:assert/strict";
import { MODELS, freqs, wavelengths, rotate, dot, ropeScore, addScore, wordVec, unfinished, llama3Scale, interpolate } from "../public/lab/rope.js";

const close = (a, b, eps = 1e-9) => Math.abs(a - b) < eps * Math.max(1, Math.abs(a), Math.abs(b));
const fs = freqs(128, 1e4), q = wordVec("개가", 128, 1), k = wordVec("물었다", 128, 2);

// Same distance, different absolute place → same RoPE score; the added scheme drifts.
for (const shift of [1, 100, 5000]) assert.ok(close(ropeScore(q, k, 3, 5, fs), ropeScore(q, k, 3 + shift, 5 + shift, fs)), `rope shift ${shift}`);
assert.ok(!close(addScore(q, k, 3, 5), addScore(q, k, 103, 105), 1e-3), "added positions should change with shift");
// Rotation doesn't change a vector's length.
assert.ok(close(dot(q, q), dot(rotate(q, 777, fs), rotate(q, 777, fs))));

const w = wavelengths(fs);
assert.ok(close(w[0], 2 * Math.PI), "fastest hand turns every 2π tokens");
assert.ok(w[63] > 54000 && w[63] < 55000, `slowest hand ${w[63]}`);

const by = Object.fromEntries(MODELS.map((m) => [m.id, m]));
const L31 = by.llama31, f31 = freqs(L31.dim, L31.base), s31 = llama3Scale(f31, L31.train, L31.scaling);
assert.equal(s31[0], f31[0], "fast hands unchanged");
assert.ok(close(s31[63], f31[63] / 8), "slowest hand slowed 8×");
assert.ok(s31.every((f, i) => f <= f31[i]), "never speeds up");
assert.ok(close(interpolate(fs, 4096, 8192)[10], fs[10] / 2));

const counts = MODELS.map((m) => `${m.id} ${unfinished(freqs(m.dim, m.base), m.train)}/${m.dim / 2}`);
console.log(`rope.js ok (unfinished hands within training length: ${counts.join(", ")})`);
