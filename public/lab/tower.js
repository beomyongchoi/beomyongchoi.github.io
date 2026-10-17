// "Signal tower": stack layers on a residual stream. Each block adds a contribution of strength k (random
// directions, so sizes add like √(a²+b²)). The input's share of the stream ("memory") is what's left of it.
//  plain — the block adds k × current size: size ×√(1+k²), memory ÷√(1+k²)   (no norm: explodes)
//  pre   — normalize the block's input first, so it adds just k: size √(s²+k²), memory × s/√(s²+k²)
//          (Pre-LN: the bigger the stream, the less one block dilutes the input) — costs one norm token
//  post  — like plain, then rescale the stream to size 1 (Post-LN: size fixed, memory still diluted)
// Lose if size > MAX_SIGNAL (explodes) or memory < MIN_MEMORY (the input is forgotten).
// Pinned by scripts/lab-tower.check.mjs.

export const MAX_SIGNAL = 100, MIN_MEMORY = 0.05, START_TOKENS = 3, TOKEN_EVERY = 2;

function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
// Block strengths are a pure function of (seed, floor), so a seed is a replayable tower.
export const blockAt = (seed, floor) => { const r = rng(seed * 7919 + floor * 104729 + 1); r(); return 0.3 + r() * 0.9; };

export const newGame = (seed) => ({ seed, s: 1, m: 1, tok: START_TOKENS, h: 0, dead: null, log: [] });

export function step(g, action) {
  if (g.dead) return g;
  const k = blockAt(g.seed, g.h);
  let { s, m, tok } = g, a = action === "pre" && tok < 1 ? "plain" : action;
  if (a === "pre") { tok--; const ns = Math.hypot(s, k); m *= s / ns; s = ns; }
  else { const f = Math.hypot(1, k); m /= f; s *= f; if (a === "post") s = 1; }
  const dead = s > MAX_SIGNAL ? "explode" : m < MIN_MEMORY ? "forget" : null, h = dead ? g.h : g.h + 1;
  if (!dead && h % TOKEN_EVERY === 0) tok++;
  return { ...g, s, m, tok, h, dead, log: [...g.log, { k, a }] };
}
