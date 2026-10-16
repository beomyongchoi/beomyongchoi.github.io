// node scripts/lab-arch.check.mjs — params derived from config.json must match officially reported sizes.
import assert from "node:assert/strict";
import { MODELS, params, kvBytesPerToken, kvBytesMHA, kvBytesGroups, conversationsFit } from "../public/lab/arch.js";

const M = Object.fromEntries(MODELS.map((m) => [m.id, m]));
const near = (x, want, tol, msg) => assert.ok(Math.abs(x - want) / want < tol, `${msg}: ${x} vs ${want}`);
near(params(M.gpt2).total, 124.4e6, 0.01, "GPT-2 small 124M");
near(params(M.llama31).total, 8.03e9, 0.01, "Llama 3.1 8B");
near(params(M.mixtral).total, 46.7e9, 0.01, "Mixtral total 46.7B");
near(params(M.mixtral).active, 12.9e9, 0.01, "Mixtral active 12.9B");
near(params(M.dsv3).total, 671e9, 0.01, "DeepSeek-V3 total 671B");
near(params(M.dsv3).active, 37e9, 0.02, "DeepSeek-V3 active 37B");
near(params(M.qwen3moe).total, 30.5e9, 0.01, "Qwen3-30B-A3B total");
near(params(M.qwen3moe).active, 3.3e9, 0.02, "Qwen3-30B-A3B active");
near(params(M.smollm2).total, 135e6, 0.01, "SmolLM2 135M");
near(params(M.vanilla).total, 65e6, 0.05, "Transformer base ~65M");
assert.equal(kvBytesPerToken(M.llama31), 131072);          // 2·32·8·128·2
assert.equal(kvBytesMHA(M.llama31) / kvBytesPerToken(M.llama31), 4);   // GQA 32/8
assert.equal(kvBytesPerToken(M.dsv3), 61 * 576 * 2);        // MLA: (512 + 64) per layer
assert.equal(kvBytesGroups(M.llama31, 8), kvBytesPerToken(M.llama31));
assert.equal(kvBytesGroups(M.llama31, 32), kvBytesMHA(M.llama31));
// 80 GB GPU, 32K-token chats beside Llama 3.1 8B's 15 GB of bf16 weights: MHA 4, GQA 16, MQA 130
assert.equal(conversationsFit(M.llama31, 32768, 80 * 2 ** 30, kvBytesGroups(M.llama31, 32)), 4);
assert.equal(conversationsFit(M.llama31, 32768, 80 * 2 ** 30), 16);
assert.equal(conversationsFit(M.llama31, 32768, 80 * 2 ** 30, kvBytesGroups(M.llama31, 1)), 130);
console.log("arch.js ok");
