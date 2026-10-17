// "GPU Tetris": serve chats on one 80 GB GPU running Llama 3.1 8B. Each accepted chat's KV cache grows
// as it runs; overflow the GPU and everything crashes (OOM). Three rounds with the same model and the
// same arrivals but different K/V head counts — MHA 32, GQA 8 (the real model), MQA 1.
// Sizes come from /lab/arch.js (real config). Pinned by scripts/lab-gpu.check.mjs.
import { MODELS, params, kvBytesGroups } from "./arch.js";

export const MODEL = MODELS.find((m) => m.id === "llama31");
export const GPU = 80e9, WEIGHTS = params(MODEL).total * 2;   // bf16 weights
export const ROUNDS = [{ name: "MHA", kv: 32 }, { name: "GQA", kv: 8 }, { name: "MQA", kv: 1 }];
export const TICK_MS = 150, TICKS = 300, ARRIVE_EVERY = 3, OFFER_TTL = 20, QUEUE = 4, GROW = 300, PROMPT = 2000;
export const perToken = (round) => kvBytesGroups(MODEL, round.kv);

function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
// Chat i's final length (tokens), a pure function of (seed, i): same arrivals in every round.
export const chatTarget = (seed, i) => { const r = rng(seed * 7919 + i * 104729 + 3); r(); return 1000 * Math.round(8 + r() * 32); };

export const newRound = (seed, round) => ({ seed, round, t: 0, next: 0, offers: [], chats: [], served: 0, done: 0, missed: 0, kicked: 0, oom: false });
export const used = (s) => WEIGHTS + s.chats.reduce((a, c) => a + c.tok, 0) * perToken(s.round);
// What memory will be once every running chat reaches its final length (what a careful player tracks).
export const promised = (s) => WEIGHTS + s.chats.reduce((a, c) => a + c.target, 0) * perToken(s.round);

// One tick. act: { accept: offerId } | { kick: chatId } | null. Waiting chats queue up (max QUEUE);
// when the queue is full the oldest leaves, and each leaves on its own after OFFER_TTL ticks.
export function step(s, act = null) {
  if (s.oom || s.t >= TICKS) return s;
  let { offers, chats, next, missed, kicked } = s;
  chats = chats.map((c) => ({ ...c }));
  const o = act && act.accept != null && offers.find((x) => x.id === act.accept);
  if (o) { chats.push({ id: o.id, tok: PROMPT, target: o.target }); offers = offers.filter((x) => x !== o); }
  if (act && act.kick != null) { const n = chats.length; chats = chats.filter((c) => c.id !== act.kick); kicked += n - chats.length; }
  const t = s.t + 1;
  let served = s.served, done = s.done;
  for (const c of chats) c.tok = Math.min(c.target, c.tok + GROW);
  chats = chats.filter((c) => (c.tok >= c.target ? ((served += c.target), done++, false) : true));
  const stay = offers.filter((x) => t <= x.until);
  missed += offers.length - stay.length; offers = stay;
  if (t % ARRIVE_EVERY === 0) {
    offers = [...offers, { id: next, target: chatTarget(s.seed, next), until: t + OFFER_TTL }]; next++;
    if (offers.length > QUEUE) { offers = offers.slice(1); missed++; }
  }
  const n = { ...s, t, offers, chats, next, served, done, missed, kicked };
  if (used(n) > GPU) return { ...n, oom: true, chats: [] };
  return n;
}
