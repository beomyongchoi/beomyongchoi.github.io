// node scripts/lab-nextword.check.mjs — decoys are plausible content words, never the answer.
import assert from "node:assert/strict";
import { pickDecoys, shuffle, modelPick, rankOf } from "../public/lab/nextword.js";

const vocab = [" the", " to", " coffee", " Tea", " lemonade", " a", " milk", "ing", " water", " soup", " x", " juice", " tea"];
const decode = (i) => vocab[i];
const order = vocab.map((_, i) => i);   // already sorted by "probability"
let r = 0.42; const rand = () => (r = (r * 9301 + 49297) % 233280 / 233280);
for (let t = 0; t < 50; t++) {
  const d = pickDecoys(order, decode, "tea", rand);
  assert.equal(d.length, 3);
  assert.equal(new Set(d).size, 3);
  for (const id of d) {
    const w = decode(id);
    assert.match(w, /^ [A-Za-z]{2,}$/);
    assert.notEqual(w.trim().toLowerCase(), "tea");   // " Tea" and " tea" both excluded
    assert.notEqual(w.trim(), "the");
    assert.notEqual(w.trim(), "to");
  }
}
assert.deepEqual(shuffle([1, 2, 3], rand).sort(), [1, 2, 3]);
assert.equal(modelPick([3, 5, 7], { 3: 0.1, 5: 0.6, 7: 0.3 }), 5);
assert.equal(rankOf([9, 4, 2], 2), 3);
console.log("nextword.js ok");
