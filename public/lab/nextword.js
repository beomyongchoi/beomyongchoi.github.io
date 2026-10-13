// "You vs GPT: next word" — pure game logic. The page supplies the model's logits and a decoder.

// Function words make silly options ("…a cup of the"), so decoys must be content-looking words.
const STOP = new Set(["to", "of", "in", "on", "at", "by", "is", "it", "as", "be", "or", "an", "so", "no", "up", "do", "if", "we", "he", "me", "my", "us", "am", "the", "and", "that", "this", "with", "for", "from", "his", "her", "their", "its", "our", "your", "was", "were", "are", "but", "not", "into", "onto", "very", "just", "one", "some", "all", "any", "more", "most", "also", "only", "then", "than", "they", "she", "him", "them", "you", "who", "what", "when", "where", "which", "there", "here", "been", "being", "have", "has", "had", "will", "would", "could", "should", "can", "may", "might", "out", "about", "over", "like", "such", "each", "other", "same", "own"]);

// Decoys = words the model itself finds plausible here: drawn from its top candidates, so the
// model is tempted by them and a surprising true word is genuinely hard for it.
export function pickDecoys(order, decode, answer, rand = Math.random, { pool = 12, scan = 80, n = 3 } = {}) {
  const want = answer.toLowerCase(), seen = new Set([want]), cand = [];
  for (const id of order.slice(0, scan)) {
    const w = decode(id);
    if (!/^ [A-Za-z]{2,}$/.test(w)) continue;
    const k = w.trim().toLowerCase();
    if (STOP.has(k) || seen.has(k)) continue;
    seen.add(k);
    cand.push(id);
    if (cand.length === pool) break;
  }
  for (let i = cand.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [cand[i], cand[j]] = [cand[j], cand[i]]; }
  return cand.slice(0, n);
}

export function shuffle(a, rand = Math.random) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// The model "plays" by picking the option it gives the highest probability.
export const modelPick = (options, probs) => options.reduce((best, id) => (probs[id] > probs[best] ? id : best), options[0]);

// 1-based rank of a token in the model's full ordering.
export const rankOf = (order, id) => order.indexOf(id) + 1;
