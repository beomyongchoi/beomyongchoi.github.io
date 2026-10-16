// node scripts/lab-moe.check.mjs — skewed router starts imbalanced; aux-loss-free bias balances it.
import assert from "node:assert/strict";
import { makeRouter, route, imbalance, balanceStep, choose } from "../public/lab/moe.js";

const R = makeRouter(), k = 2;
let bias = new Array(R.experts).fill(0);
const before = imbalance(route(R, k, bias), R, k);
for (let i = 0; i < 200; i++) bias = balanceStep(route(R, k, bias), bias, 0.01);
const after = imbalance(route(R, k, bias), R, k);
assert.ok(before > 2, `skewed start should be imbalanced: ${before}`);
assert.ok(after < 1.3, `bias updates should balance: ${after}`);
assert.equal(route(R, k, bias).reduce((a, b) => a + b, 0), R.tokens * k);
assert.equal(choose(16, 2), 120);
assert.equal(choose(64, 8), 4426165368);   // DeepSeekMoE's fine-grained example
console.log(`moe.js ok (imbalance ${before.toFixed(2)} → ${after.toFixed(2)})`);
