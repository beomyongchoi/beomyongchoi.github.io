// "Expert dispatch": route each incoming token to one of E experts. The router's affinity says how good
// each expert would be for this token (points), but a few experts are popular for everyone. Each expert
// finishes one token every WORK ticks and holds at most CAP waiting; route to a full expert and the token
// is dropped (like capacity overflow in GShard/Switch). A rival bot balances with DeepSeek-V3's trick:
// a per-expert bias added only when choosing, nudged by load. Pinned by scripts/lab-dispatch.check.mjs.

export const E = 6, CAP = 3, WORK = 4, TOKENS = 60, DROP = -50;

function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
// Token i's affinity (0–100) for each expert: popular experts score high for most tokens.
export function affinity(seed, i) {
  const r = rng(seed * 7919 + i * 104729 + 5); r();
  const pop = [1.0, 0.85, 0.6, 0.45, 0.3, 0.2];
  const raw = pop.map((p) => p * 0.6 + r() * 0.55);
  const hi = Math.max(...raw), lo = Math.min(...raw);
  return raw.map((x) => Math.round(((x - lo) / (hi - lo)) * 100));
}

export const newGame = (seed) => ({ seed, i: 0, q: new Array(E).fill(0), work: new Array(E).fill(0), score: 0, dropped: 0, sent: new Array(E).fill(0), bias: new Array(E).fill(0) });

// Route token g.i to expert e, then one tick of work passes.
export function route(g, e) {
  const a = affinity(g.seed, g.i), q = [...g.q], work = [...g.work], sent = [...g.sent];
  let { score, dropped } = g;
  if (q[e] >= CAP) { score += DROP; dropped++; } else { q[e]++; sent[e]++; score += a[e]; }
  for (let x = 0; x < E; x++) if (q[x] > 0 && ++work[x] >= WORK) { q[x]--; work[x] = 0; }
  return { ...g, i: g.i + 1, q, work, sent, score, dropped };
}
export const over = (g) => g.i >= TOKENS;

// The default router: highest affinity, full or not.
export const greedy = (g) => { const a = affinity(g.seed, g.i); return a.indexOf(Math.max(...a)); };
// DeepSeek-style rival: argmax(affinity + bias); after each token, busy experts' bias goes down, idle up.
export function deepseek(g, u = 12) {
  const a = affinity(g.seed, g.i), s = a.map((x, k) => x + g.bias[k]);
  const e = s.indexOf(Math.max(...s)), n = route(g, e), mean = n.q.reduce((x, y) => x + y, 0) / E;
  return { ...n, bias: n.bias.map((b, k) => b + u * Math.sign(mean - n.q[k])) };
}
