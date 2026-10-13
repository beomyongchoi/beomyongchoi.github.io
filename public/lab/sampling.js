// Truncation samplers over a probability vector (already temperature-scaled).
// Order: top-k → top-p → min-p. Each is skipped when off (k=0, p=1, minP=0).
// Returns { keep: boolean[], probs: renormalized number[], order: ids sorted by prob desc }.
export function truncate(probs, { k = 0, p = 1, minP = 0 } = {}) {
  const order = probs.map((_, i) => i).sort((a, b) => probs[b] - probs[a]);
  const keep = new Array(probs.length).fill(false);
  let n = order.length;
  if (k > 0) n = Math.min(n, k);
  if (p < 1) {
    // smallest prefix whose mass reaches p (always at least one token)
    let c = 0, j = 0;
    while (j < n) { c += probs[order[j++]]; if (c >= p) break; }
    n = Math.min(n, j);
  }
  if (minP > 0) {
    const cut = minP * probs[order[0]];
    let j = 0;
    while (j < n && probs[order[j]] >= cut) j++;
    n = Math.max(1, j);
  }
  for (let j = 0; j < n; j++) keep[order[j]] = true;
  const z = order.slice(0, n).reduce((a, i) => a + probs[i], 0);
  return { keep, probs: probs.map((v, i) => (keep[i] ? v / z : 0)), order, kept: n, mass: z };
}

export function sample(probs, rand = Math.random) {
  let r = rand();
  for (let i = 0; i < probs.length; i++) if ((r -= probs[i]) <= 0 && probs[i] > 0) return i;
  return probs.findLastIndex((v) => v > 0);
}

// Shannon entropy in bits.
export const entropy = (probs) => -probs.reduce((a, v) => (v > 0 ? a + v * Math.log2(v) : a), 0);
