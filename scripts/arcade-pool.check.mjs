// node scripts/arcade-pool.check.mjs — every next-word answer must be ONE token (with its leading
// space) in every selectable model's tokenizer, or the game can't compare it fairly.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { AutoTokenizer } from "@huggingface/transformers";
import { LMS } from "../public/lab/lm.js";

const pool = JSON.parse(readFileSync(new URL("../public/arcade/next-word-pool.json", import.meta.url)));
for (const { id, label } of Object.values(LMS)) {
  const tok = await AutoTokenizer.from_pretrained(id);
  const bad = pool.filter((p) => tok.encode(" " + p.ans, { add_special_tokens: false }).length !== 1).map((p) => p.ans);
  assert.deepEqual(bad, [], `${label}: multi-token answers ${bad}`);
}
assert.ok(pool.filter((p) => p.tag === "반전").length >= 3 && pool.length >= 13, "pool too small for 10 rounds");
console.log(`arcade pool ok (${pool.length} sentences)`);
