// Rotary position embedding (RoPE, Su et al. 2021) as plain functions, next to the 2017 sinusoidal
// "add a position vector" scheme, plus the Llama 3.1 frequency rescaling for long context.
// Model settings are real config.json values (Hugging Face, fetched 2026-10-17).
// Pinned by scripts/lab-rope.check.mjs.

export const MODELS = [
  { id: "llama2", name: "Llama 2 7B", base: 1e4, dim: 128, train: 4096 },
  { id: "llama31", name: "Llama 3.1 8B", base: 5e5, dim: 128, train: 8192, scaling: { factor: 8, low: 1, high: 4 } },
  { id: "mixtral", name: "Mixtral 8x7B", base: 1e6, dim: 128, train: 32768 },
  { id: "qwen3", name: "Qwen3-8B", base: 1e6, dim: 128, train: 32768 },
  { id: "dsv3", name: "DeepSeek-V3", base: 1e4, dim: 64, train: 4096 },   // RoPE only on a 64-dim slice (MLA)
];

// One angular speed per pair of dimensions: theta_i = base^(-2i/d). Pair 0 is the fastest hand.
export const freqs = (dim, base) => Array.from({ length: dim / 2 }, (_, i) => base ** (-2 * i / dim));
// Tokens for one full turn of each hand.
export const wavelengths = (fs) => fs.map((f) => (2 * Math.PI) / f);

// Rotate each pair (v[2i], v[2i+1]) by pos * theta_i.
export function rotate(v, pos, fs) {
  const out = new Array(v.length);
  for (let i = 0; i < fs.length; i++) {
    const a = pos * fs[i], c = Math.cos(a), s = Math.sin(a), x = v[2 * i], y = v[2 * i + 1];
    out[2 * i] = x * c - y * s;
    out[2 * i + 1] = x * s + y * c;
  }
  return out;
}

export const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
export const ropeScore = (q, k, m, n, fs) => dot(rotate(q, m, fs), rotate(k, n, fs));

// 2017: add sin/cos of the position to the vector itself (same frequencies, base 10,000).
export function sinusoid(pos, dim, base = 1e4) {
  const fs = freqs(dim, base), pe = new Array(dim);
  for (let i = 0; i < fs.length; i++) { pe[2 * i] = Math.sin(pos * fs[i]); pe[2 * i + 1] = Math.cos(pos * fs[i]); }
  return pe;
}
export const addScore = (q, k, m, n) => dot(q.map((x, i) => x + sinusoid(m, q.length)[i]), k.map((x, i) => x + sinusoid(n, k.length)[i]));

// Deterministic stand-in for a word's query/key vector (the real ones come from trained weights).
export function wordVec(word, dim, salt = 0) {
  let h = 2166136261 ^ salt;
  for (const ch of word) h = Math.imul(h ^ ch.codePointAt(0), 16777619);
  const v = [];
  for (let i = 0; i < dim; i++) { h = Math.imul(h ^ (h >>> 15), 2246822507); h ^= h >>> 13; v.push(((h >>> 0) / 4294967296 - 0.5) * 0.6); }
  return v;
}

// Hands that never finish one turn within the training length: past it they show angles never seen.
export const unfinished = (fs, train) => wavelengths(fs).filter((w) => w > train).length;

// Llama 3.1 ("rope_type": "llama3"): keep fast hands, slow the slow hands by `factor`, blend in between.
export function llama3Scale(fs, train, { factor, low, high }) {
  const lowW = train / low, highW = train / high;
  return fs.map((f) => {
    const w = (2 * Math.PI) / f;
    if (w < highW) return f;
    if (w > lowW) return f / factor;
    const t = (train / w - low) / (high - low);
    return (1 - t) * (f / factor) + t * f;
  });
}

// Position Interpolation (Chen et al. 2023): squeeze positions so a longer text fits the trained range.
export const interpolate = (fs, train, target) => fs.map((f) => (f * train) / target);
