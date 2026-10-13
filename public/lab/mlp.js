// Small MLP trained with /lab/autograd.js — the training-series finale toy.
// Hidden layers use tanh; the output is tanh too, with targets ±1 and squared-error loss.
import { Value } from "./autograd.js";

// Deterministic PRNG so every reader sees the same data and init.
export function rng(seed = 1) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
const gauss = (r) => Math.sqrt(-2 * Math.log(r() || 1e-12)) * Math.cos(2 * Math.PI * r());

// Inner blob (t = −1) wrapped by an outer ring (t = +1), same layout as the linalg part-3 toy.
// noise jitters the radius so the classes start to overlap.
export function makeRing({ n = 120, noise = 0, seed = 7 } = {}) {
  const r = rng(seed), pts = [];
  for (let i = 0; i < n; i++) {
    const outer = i % 2 === 1;
    const rad = (outer ? 2.35 + r() * 1.05 : r() * 1.15) + noise * gauss(r);
    const a = r() * 2 * Math.PI;
    pts.push({ x: rad * Math.cos(a), y: rad * Math.sin(a), t: outer ? 1 : -1 });
  }
  return pts;
}

export class MLP {
  constructor(sizes = [2, 8, 8, 1], seed = 3) {
    const r = rng(seed);
    this.layers = [];
    for (let l = 0; l < sizes.length - 1; l++) {
      const nin = sizes[l], nout = sizes[l + 1], scale = 1 / Math.sqrt(nin);
      const W = Array.from({ length: nout }, () => Array.from({ length: nin }, () => new Value((r() * 2 - 1) * scale)));
      const b = Array.from({ length: nout }, () => new Value(0));
      this.layers.push({ W, b });
    }
  }
  params() { return this.layers.flatMap(({ W, b }) => [...W.flat(), ...b]); }
  // Autograd forward (for training).
  forward(x) {
    let h = x;
    for (const { W, b } of this.layers) h = W.map((row, j) => row.reduce((s, w, i) => s.add(w.mul(h[i])), b[j]).tanh());
    return h[0];
  }
  // Plain-number forward (for drawing the boundary — no graph, fast).
  predict(x, y) {
    let h = [x, y];
    for (const { W, b } of this.layers) h = W.map((row, j) => Math.tanh(row.reduce((s, w, i) => s + w.data * h[i], b[j].data)));
    return h[0];
  }
  // Mean squared error over pts, as a number.
  loss(pts) { return pts.reduce((s, p) => s + (this.predict(p.x, p.y) - p.t) ** 2, 0) / pts.length; }
  accuracy(pts) { return pts.filter((p) => Math.sign(this.predict(p.x, p.y)) === p.t).length / pts.length; }
  // One gradient-descent step on a minibatch.
  step(batch, lr) {
    const L = batch.reduce((s, p) => s.add(this.forward([p.x, p.y]).sub(p.t).square()), new Value(0)).mul(1 / batch.length);
    L.backward();
    for (const w of this.params()) w.data -= lr * w.grad;
    return L.data;
  }
}

// Shuffle a copy (seeded) and cut into minibatches — one pass over this is one epoch.
export function batches(pts, size, r) {
  const a = pts.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  const out = [];
  for (let i = 0; i < a.length; i += size) out.push(a.slice(i, i + size));
  return out;
}
