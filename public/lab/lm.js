// Shared in-browser LM for playground toys via transformers.js, loaded on demand.
// loadLM(onStatus, key?) then nextLogits(text) → { logits: number[], n }.
// Default stays SmolLM2-135M: every number in the posts was measured with it.
const LIB = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.0";
export const LMS = {
  smol: { id: "HuggingFaceTB/SmolLM2-135M-Instruct", label: "SmolLM2-135M", size: "약 120MB", note: "가볍지만 영어 전용" },
  qwen3: { id: "onnx-community/Qwen3-0.6B-ONNX", label: "Qwen3-0.6B", size: "약 570MB", note: "더 똑똑하고 한국어 가능" },
};

let ready = null, current = null;
export let tok = null;
export let backend = "";
export const currentLM = () => current;

export function loadLM(onStatus = () => {}, key = "smol") {
  if (current !== key) { ready = null; current = key; }
  const MODEL = LMS[key].id;
  ready ??= (async () => {
    onStatus("라이브러리·모델 정보 불러오는 중…");
    const { AutoTokenizer, AutoModelForCausalLM } = await import(LIB);
    const webgpu = !!navigator.gpu && !!(await navigator.gpu.requestAdapter().catch(() => null));
    backend = webgpu ? "WebGPU" : "WASM(CPU)";
    const files = {};
    const progress_callback = (e) => {
      if (e.status !== "progress" || !e.total) return;
      files[e.file] = [e.loaded, e.total];
      const [l, t] = Object.values(files).reduce((a, [x, y]) => [a[0] + x, a[1] + y], [0, 0]);
      if (t > 1e6) onStatus(`모델 내려받는 중… ${(l / 1e6).toFixed(0)} / ${(t / 1e6).toFixed(0)} MB`);
    };
    tok = await AutoTokenizer.from_pretrained(MODEL);
    const model = await AutoModelForCausalLM.from_pretrained(MODEL, {
      device: webgpu ? "webgpu" : "wasm",
      dtype: webgpu ? "q4f16" : "q8",
      progress_callback,
    });
    onStatus(`준비 완료 · ${backend}에서 실행 중 · 다음부터는 캐시에서 바로 뜹니다`);
    return model;
  })().catch((e) => {
    ready = null;
    throw e;
  });
  return ready;
}

// Serialize forward passes — one model, one queue.
let queue = Promise.resolve();
export function nextLogits(text) {
  const run = queue.then(async () => {
    const model = await ready;
    const out = await model(tok(text));
    const [, n, V] = out.logits.dims;
    return { logits: Array.from(out.logits.data.slice((n - 1) * V, n * V), Number), n };
  });
  queue = run.catch(() => {});
  return run;
}

export const decode = (id) => tok.decode([id]);
// Spaces shown as ␣ — tokens usually carry their leading space.
export const label = (id) => JSON.stringify(decode(id)).slice(1, -1).replace(/ /g, "␣");

export function softmax(logits, T = 1) {
  let m = -Infinity;
  for (const l of logits) if (l > m) m = l;
  const e = logits.map((l) => Math.exp((l - m) / T));
  const z = e.reduce((a, b) => a + b, 0);
  return e.map((x) => x / z);
}
