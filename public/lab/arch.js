// Transformer architectures as data: real config.json values (Hugging Face, fetched 2026-10-13)
// plus the 2017 paper's base model. params() and kvBytesPerToken() derive numbers from them.
// Checked against officially reported sizes by scripts/lab-arch.check.mjs.

export const MODELS = [
  {
    id: "vanilla", name: "Transformer (base)", year: 2017, org: "Google", src: "https://arxiv.org/abs/1706.03762",
    layout: "encoder-decoder", layers: 6, d: 512, heads: 8, kvHeads: 8, headDim: 64, ff: 2048, vocab: 37000,
    act: "ReLU", gated: false, norm: "LayerNorm", normPos: "post", pos: "sinusoidal", ctx: null, tied: true,
  },
  {
    id: "gpt2", name: "GPT-2 (small)", year: 2019, org: "OpenAI", src: "https://huggingface.co/openai-community/gpt2/blob/main/config.json",
    layout: "decoder", layers: 12, d: 768, heads: 12, kvHeads: 12, headDim: 64, ff: 3072, vocab: 50257,
    act: "GELU", gated: false, norm: "LayerNorm", normPos: "pre", pos: "learned", ctx: 1024, tied: true, bias: true,
  },
  {
    id: "llama31", name: "Llama 3.1 8B", year: 2024, org: "Meta", src: "https://huggingface.co/unsloth/Meta-Llama-3.1-8B/blob/main/config.json",
    layout: "decoder", layers: 32, d: 4096, heads: 32, kvHeads: 8, headDim: 128, ff: 14336, vocab: 128256,
    act: "SiLU", gated: true, norm: "RMSNorm", normPos: "pre", pos: "RoPE", ctx: 131072, tied: false,
  },
  {
    id: "mixtral", name: "Mixtral 8x7B", year: 2023, org: "Mistral", src: "https://huggingface.co/mistralai/Mixtral-8x7B-v0.1/blob/main/config.json",
    layout: "decoder", layers: 32, d: 4096, heads: 32, kvHeads: 8, headDim: 128, ff: 14336, vocab: 32000,
    act: "SiLU", gated: true, norm: "RMSNorm", normPos: "pre", pos: "RoPE", ctx: 32768, tied: false,
    moe: { experts: 8, active: 2, shared: 0, expertFf: 14336, denseLayers: 0 },
  },
  {
    id: "dsv3", name: "DeepSeek-V3", year: 2024, org: "DeepSeek", src: "https://huggingface.co/deepseek-ai/DeepSeek-V3/blob/main/config.json",
    layout: "decoder", layers: 61, d: 7168, heads: 128, kvHeads: 128, headDim: 128, ff: 18432, vocab: 129280,
    act: "SiLU", gated: true, norm: "RMSNorm", normPos: "pre", pos: "RoPE (YaRN)", ctx: 163840, tied: false,
    moe: { experts: 256, active: 8, shared: 1, expertFf: 2048, denseLayers: 3 },
    mla: { qRank: 1536, kvRank: 512, nope: 128, rope: 64, v: 128 },
  },
  {
    id: "qwen3moe", name: "Qwen3-30B-A3B", year: 2025, org: "Alibaba", src: "https://huggingface.co/Qwen/Qwen3-30B-A3B/blob/main/config.json",
    layout: "decoder", layers: 48, d: 2048, heads: 32, kvHeads: 4, headDim: 128, ff: 6144, vocab: 151936,
    act: "SiLU", gated: true, norm: "RMSNorm", normPos: "pre", pos: "RoPE", ctx: 40960, tied: false, qkNorm: true,
    moe: { experts: 128, active: 8, shared: 0, expertFf: 768, denseLayers: 0 },
  },
  {
    id: "smollm2", name: "SmolLM2-135M", year: 2024, org: "Hugging Face", src: "https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct/blob/main/config.json",
    layout: "decoder", layers: 30, d: 576, heads: 9, kvHeads: 3, headDim: 64, ff: 1536, vocab: 49152,
    act: "SiLU", gated: true, norm: "RMSNorm", normPos: "pre", pos: "RoPE", ctx: 8192, tied: true,
  },
];

// Parameter count. Llama-style blocks have no biases; GPT-2 has biases and learned positions.
// Returns { total, active } — they differ only for mixture-of-experts models.
export function params(m) {
  const { d, heads: H, kvHeads: KV, headDim: hd, vocab: V } = m;
  const emb = V * d, head = m.tied ? 0 : V * d;
  const mlp = (ff) => (m.gated ? 3 : 2) * d * ff + (m.bias ? ff + d : 0);
  let attn;
  if (m.mla) {
    const { qRank, kvRank, nope, rope, v } = m.mla;
    attn = d * qRank + qRank + qRank * H * (nope + rope)   // Q down, norm, Q up
      + d * (kvRank + rope) + kvRank + kvRank * H * (nope + v)   // joint KV down (+ shared rope key), norm, KV up
      + H * v * d;   // output
  } else {
    attn = d * H * hd + 2 * d * KV * hd + H * hd * d + (m.bias ? H * hd + 2 * KV * hd + d : 0) + (m.qkNorm ? 2 * hd : 0);
  }
  const norms = (m.bias ? 4 : 2) * d;   // two norms per block (LayerNorm has a bias too)
  let total = emb + head + (m.bias ? 2 * d : d) + (m.pos === "learned" ? m.ctx * d : 0), active = total;
  for (let l = 0; l < m.layers; l++) {
    const base = attn + norms;
    if (m.moe && l >= m.moe.denseLayers) {
      const { experts, active: k, shared, expertFf } = m.moe;
      const one = mlp(expertFf), router = d * experts;
      total += base + router + (experts + shared) * one;
      active += base + router + (k + shared) * one;
    } else {
      total += base + mlp(m.ff);
      active += base + mlp(m.ff);
    }
  }
  if (m.layout === "encoder-decoder") {
    // Decoder stack adds cross-attention (4·d²) and a third norm per layer; the paper's vocab is shared.
    const dec = m.layers * (2 * (4 * d * d + 4 * d) + 2 * d * m.ff + m.ff + d + 6 * d);
    const enc = m.layers * (4 * d * d + 4 * d + 2 * d * m.ff + m.ff + d + 4 * d);
    total = active = emb + enc + dec;
  }
  return { total, active };
}

// Bytes of KV cache per token across all layers (bf16 = 2 bytes). MLA caches one compressed
// latent plus a shared RoPE key per layer instead of full K and V for every head.
export function kvBytesPerToken(m, bytes = 2) {
  if (m.mla) return m.layers * (m.mla.kvRank + m.mla.rope) * bytes;
  return 2 * m.layers * m.kvHeads * m.headDim * bytes;
}

// What the cache would be if every head kept its own K and V (no GQA / MLA).
export function kvBytesMHA(m, bytes = 2) {
  if (m.mla) return m.layers * m.heads * (m.mla.nope + m.mla.rope + m.mla.v) * bytes;
  return 2 * m.layers * m.heads * m.headDim * bytes;
}

// Cache per token if the model had `groups` K/V heads instead of its own setting
// (groups = heads → MHA, 1 → MQA). MLA models ignore it.
export function kvBytesGroups(m, groups, bytes = 2) {
  if (m.mla) return kvBytesPerToken(m, bytes);
  return 2 * m.layers * groups * m.headDim * bytes;
}

// How many conversations of `ctx` tokens fit beside the bf16 weights in `memBytes` of GPU memory.
export function conversationsFit(m, ctx, memBytes, perToken = kvBytesPerToken(m)) {
  const free = memBytes - params(m).total * 2;
  return free <= 0 ? 0 : Math.floor(free / (perToken * ctx));
}
