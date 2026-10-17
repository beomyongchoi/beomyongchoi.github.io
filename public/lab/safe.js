// "Needle safe": a number (a token position) is shown only as RoPE-style clock hands. Hand i turns
// once every 2π·6^i positions — the fast hand pins the last few steps, slow hands pin the big range.
// The lock's "grip" is the RoPE score of a vector with itself at distance (secret − guess): mean cos of
// the angle gaps. It is 1 only at the right number. Pinned by scripts/lab-safe.check.mjs.

export const LEVELS = [
  { hands: 1, range: 6, base: 6 },
  { hands: 2, range: 36, base: 6 },
  { hands: 3, range: 200, base: 6 },
  { hands: 4, range: 1000, base: 6 },
  { hands: 4, range: 1300, base: 6, hideFast: true },   // last safe: the fastest hand is missing
];

export const periods = (lv) => Array.from({ length: lv.hands }, (_, i) => 2 * Math.PI * lv.base ** i);
export const angles = (n, lv) => periods(lv).map((p) => ((2 * Math.PI * n) / p) % (2 * Math.PI));
export const shown = (lv) => periods(lv).map((_, i) => !(lv.hideFast && i === 0));

export function grip(secret, guess, lv) {
  const ps = periods(lv), on = shown(lv);
  let s = 0, k = 0;
  ps.forEach((p, i) => { if (on[i]) { s += Math.cos((2 * Math.PI * (secret - guess)) / p); k++; } });
  return s / k;
}

export function newSecret(lv, rnd = Math.random) { return 1 + Math.floor(rnd() * (lv.range - 1)); }
