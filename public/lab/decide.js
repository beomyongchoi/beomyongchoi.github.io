// Decision-model opponents for arcade duels: pick one option from a fixed set, with probabilities.
// - qwen3: a small LLM used "decision-style" — no text is generated; we read the next-token
//   probability of each option word (same idea as open-decisions).
// - laya: Convai's Laya (ModernBERT-large + decision head, Apache 2.0), community ONNX export
//   m1rhan/laya-typed-decisions-ONNX run with onnxruntime-web. Sequence layout follows the
//   original SDK's build_sequence: [CLS] "choice question: <goal>" [SEP] ([MASK] option)… [SEP] state [SEP].
import { loadLM, nextLogits, tok as lmTok } from "/lab/lm.js";

const TJS = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.0";
const ORT = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/ort.webgpu.bundle.min.mjs";
const LAYA = "m1rhan/laya-typed-decisions-ONNX";

export const OPPONENTS = {
  qwen3: { label: "Qwen3-0.6B", size: "약 570MB", note: "작은 LLM을 디시전 모드로 — 글을 쓰지 않고 선택지 단어의 확률만 읽음" },
  laya: { label: "Laya", size: "약 430MB", note: "디시전 전용 모델(오픈소스, Jev 대안) · 커뮤니티 ONNX 변환본" },
};

const softmax = (l) => {
  let m = -Infinity;
  for (const x of l) if (x > m) m = x;
  const e = l.map((x) => Math.exp(x - m)), z = e.reduce((a, b) => a + b, 0);
  return e.map((x) => x / z);
};

let laya = null;
async function loadLaya(onStatus) {
  laya ??= (async () => {
    onStatus("라이브러리 불러오는 중…");
    const [ort, { AutoTokenizer }] = await Promise.all([import(ORT), import(TJS)]);
    const tok = await AutoTokenizer.from_pretrained(LAYA);
    const url = `https://huggingface.co/${LAYA}/resolve/main/onnx/model_q4.onnx`;
    onStatus("모델 내려받는 중… (약 430MB, 처음 한 번)");
    let sess, backend = "WebGPU";
    try { sess = await ort.InferenceSession.create(url, { executionProviders: ["webgpu"] }); }
    catch { backend = "WASM(CPU)"; sess = await ort.InferenceSession.create(url, { executionProviders: ["wasm"] }); }
    onStatus(`준비 완료 · ${backend}에서 실행 중`);
    return { ort, tok, sess };
  })().catch((e) => { laya = null; throw e; });
  return laya;
}

export function loadOpponent(key, onStatus = () => {}) {
  return key === "laya" ? loadLaya(onStatus) : loadLM(onStatus, "qwen3");
}

// options: { name: description }. Returns { probs: { name: p }, ms }.
export async function decide(key, goal, options, state) {
  const names = Object.keys(options), t0 = performance.now();
  let p;
  if (key === "laya") {
    const { ort, tok, sess } = await laya;
    const enc = (s) => Array.from(tok.encode(s, { add_special_tokens: false }));
    const CLS = 50281, SEP = 50282, MASK = tok.mask_token_id;
    const ids = [CLS, ...enc(`choice question: ${goal}`), SEP], markers = [];
    for (const n of names) { markers.push(ids.length); ids.push(MASK, ...enc(` ${n}: ${options[n]}`).slice(0, 48)); }
    ids.push(SEP, ...enc(state).slice(0, 700), SEP);
    const k = markers.length, i64 = (a) => BigInt64Array.from(a.map(BigInt));
    const out = await sess.run({
      input_ids: new ort.Tensor("int64", i64(ids), [1, ids.length]),
      attention_mask: new ort.Tensor("int64", new BigInt64Array(ids.length).fill(1n), [1, ids.length]),
      marker_pos: new ort.Tensor("int64", i64(markers), [1, k]),
      marker_mask: new ort.Tensor("bool", new Uint8Array(k).fill(1), [1, k]),
      qtype: new ort.Tensor("int64", i64([0]), [1]),
    });
    const temp = k <= 2 ? 1.906 : k <= 5 ? 1.760 : 1.0;   // the checkpoint's fitted temperatures (choice:2, choice:3-5)
    p = softmax(Array.from(out.logits.data, (x) => x / temp));
  } else {
    const list = names.map((n) => `${n} = ${options[n]}`).join(", ");
    const prompt = `<|im_start|>user\n${goal}\n\n${state}\n\nMoves: ${list}.\nAnswer with one word.<|im_end|>\n<|im_start|>assistant\n<think>\n\n</think>\n\nAnswer:`;
    const { logits } = await nextLogits(prompt);
    p = softmax(names.map((n) => logits[lmTok.encode(" " + n, { add_special_tokens: false })[0]]));
  }
  return { probs: Object.fromEntries(names.map((n, i) => [n, p[i]])), ms: performance.now() - t0 };
}

// Contextual calibration (Zhao et al. 2021, "Calibrate Before Use"): small models carry a habit
// toward some options regardless of the input (e.g. whichever is listed first). Measure that habit
// on a content-free state once, then divide it out.
const habits = new Map();
export async function habit(key, goal, options) {
  const k = key + "|" + goal;
  if (!habits.has(k)) habits.set(k, (await decide(key, goal, options, "N/A")).probs);
  return habits.get(k);
}
export function calibrate(probs, base) {
  const q = Object.fromEntries(Object.keys(probs).map((k) => [k, probs[k] / Math.max(base[k], 1e-6)]));
  const z = Object.values(q).reduce((a, b) => a + b, 0);
  return Object.fromEntries(Object.entries(q).map(([k, v]) => [k, v / z]));
}
