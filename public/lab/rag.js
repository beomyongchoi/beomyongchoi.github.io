// Retrieval for /playground/rag/: keyword (BM25), semantic (cosine over e5 vectors), hybrid (RRF).
// Pure functions — the page supplies the index entries and the query vector.

// Latin words lowercased; Hangul runs become character bigrams (no Korean tokenizer needed).
export function tokens(text) {
  const out = [];
  for (const m of text.toLowerCase().matchAll(/[a-z0-9]+(?:[-'][a-z0-9]+)*|[가-힣]+/g)) {
    const w = m[0];
    if (/[가-힣]/.test(w)) {
      if (w.length === 1) out.push(w);
      for (let i = 0; i + 1 < w.length; i++) out.push(w.slice(i, i + 2));
    } else if (w.length > 1) out.push(w);
  }
  return out;
}

export function bm25Index(docs, { k1 = 1.2, b = 0.75 } = {}) {
  const toks = docs.map(tokens), N = docs.length;
  const avg = toks.reduce((a, t) => a + t.length, 0) / N;
  const df = new Map();
  for (const t of toks) for (const w of new Set(t)) df.set(w, (df.get(w) || 0) + 1);
  const tf = toks.map((t) => { const m = new Map(); for (const w of t) m.set(w, (m.get(w) || 0) + 1); return m; });
  return (query) => {
    const q = [...new Set(tokens(query))];
    return tf.map((m, i) => q.reduce((s, w) => {
      const f = m.get(w);
      if (!f) return s;
      const idf = Math.log(1 + (N - df.get(w) + 0.5) / (df.get(w) + 0.5));
      return s + idf * (f * (k1 + 1)) / (f + k1 * (1 - b + (b * toks[i].length) / avg));
    }, 0));
  };
}

// Vectors are L2-normalized, so the dot product is the cosine.
export const cosine = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);

// Indices sorted by score, best first.
export const rank = (scores) => scores.map((_, i) => i).sort((a, b) => scores[b] - scores[a]);

// Reciprocal Rank Fusion: score = Σ 1 / (k + rank). Uses ranks only, so the two scales never need to match.
export function rrf(rankings, k = 60) {
  const s = new Map();
  for (const r of rankings) r.forEach((id, i) => s.set(id, (s.get(id) || 0) + 1 / (k + i + 1)));
  return [...s.entries()].sort((a, b) => b[1] - a[1]).map(([id, v]) => ({ id, score: v }));
}
