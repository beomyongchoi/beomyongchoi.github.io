// Toy MoE router: tokens pick top-k experts by affinity score. Starts from a deliberately skewed
// router (some experts favoured), then balances load with DeepSeek-V3's auxiliary-loss-free rule:
// a per-expert bias added to scores only for picking top-k, nudged by ±u toward the mean load.
// Pinned by scripts/lab-moe.check.mjs.

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const gauss = (r) => Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r());

// Affinity scores s[t][e] = sigmoid(x_t · w_e + skew_e). skew makes a few experts popular.
export function makeRouter({ tokens = 1024, experts = 16, dim = 16, skew = 1.5, seed = 7 } = {}) {
  const r = rng(seed);
  const W = Array.from({ length: experts }, () => Array.from({ length: dim }, () => gauss(r) / Math.sqrt(dim)));
  const off = Array.from({ length: experts }, (_, e) => skew * (1 - (2 * e) / (experts - 1)));   // +skew … −skew
  const scores = Array.from({ length: tokens }, () => {
    const x = Array.from({ length: dim }, () => gauss(r));
    return W.map((w, e) => 1 / (1 + Math.exp(-(w.reduce((s, wi, i) => s + wi * x[i], 0) + off[e]))));
  });
  return { tokens, experts, scores };
}

// Top-k per token using (score + bias); returns tokens-per-expert counts.
export function route(router, k, bias) {
  const load = new Array(router.experts).fill(0);
  for (const s of router.scores) {
    const idx = s.map((v, e) => [v + bias[e], e]).sort((a, b) => b[0] - a[0]);
    for (let j = 0; j < k; j++) load[idx[j][1]]++;
  }
  return load;
}

// Busiest expert's load ÷ the even share (tokens·k/experts). 1 = perfectly balanced.
export const imbalance = (load, router, k) => {
  let mx = 0;
  for (const v of load) if (v > mx) mx = v;
  return mx / ((router.tokens * k) / router.experts);
};

// One aux-loss-free update: overloaded experts' bias goes down by u, underloaded up by u.
export function balanceStep(load, bias, u) {
  const mean = load.reduce((a, b) => a + b, 0) / load.length;
  return bias.map((b, e) => b + u * Math.sign(mean - load[e]));
}

// n choose k as a float (for counting expert combinations).
export function choose(n, k) {
  let c = 1;
  for (let i = 0; i < k; i++) c = (c * (n - i)) / (i + 1);
  return Math.round(c);
}
