// node scripts/lab-rag.check.mjs — retrieval primitives behave as the RAG post says.
import assert from "node:assert/strict";
import { tokens, bm25Index, cosine, rank, rrf } from "../public/lab/rag.js";

assert.deepEqual(tokens("역전파는 Back-prop!"), ["역전", "전파", "파는", "back-prop"]);
assert.deepEqual(tokens("a 그 GPT"), ["그", "gpt"]);
const score = bm25Index(["the cat sat", "dogs bark loudly", "cat cat cat food"]);
const s = score("cat");
assert.equal(s[1], 0);
assert.ok(s[2] > s[0] && s[0] > 0);          // more matches rank higher
assert.equal(cosine([0.6, 0.8], [0.6, 0.8]).toFixed(6), "1.000000");
assert.deepEqual(rank([0.1, 0.9, 0.5]), [1, 2, 0]);
const fused = rrf([[1, 2, 0], [2, 1, 0]]);
assert.deepEqual(fused.map((x) => x.id).slice(0, 2).sort(), [1, 2]);
assert.equal(fused.at(-1).id, 0);              // last in both lists stays last
console.log("rag.js ok");
