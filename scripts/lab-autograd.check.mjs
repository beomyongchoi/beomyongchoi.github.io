// node scripts/lab-autograd.check.mjs — backprop grads must match the blog's hand math and finite differences.
import assert from "node:assert/strict";
import { Value } from "../public/lab/autograd.js";

// Blog example: x=2, h=w1·x, y=w2·h, L=(y−6)²  at w1=1, w2=2
const chain = (a, b) => { const w1 = new Value(a), w2 = new Value(b); const L = w2.mul(w1.mul(2)).sub(6).square(); return { w1, w2, L }; };
const { w1, w2, L } = chain(1, 2);
L.backward();
assert.equal(L.data, 4);
assert.equal(w2.grad, -8);
assert.equal(w1.grad, -16);
const fd = (f, eps = 1e-6) => (f(eps) - f(-eps)) / (2 * eps);
assert.ok(Math.abs(fd((e) => chain(1 + e, 2).L.data) - -16) < 1e-6);
assert.ok(Math.abs(fd((e) => chain(1, 2 + e).L.data) - -8) < 1e-6);
assert.equal(chain(1, 2.01).L.data.toFixed(4), "3.9204");
assert.equal(chain(1.01, 2).L.data.toFixed(4), "3.8416");

// Branch: f = a·b + a at a=3, b=2 → df/da = b + 1 = 3 (paths add)
const a = new Value(3), b = new Value(2);
a.mul(b).add(a).backward();
assert.equal(a.grad, 3);
assert.equal(b.grad, 3);

// tanh / relu locals
const t = new Value(0.5); t.tanh().backward(); assert.ok(Math.abs(t.grad - (1 - Math.tanh(0.5) ** 2)) < 1e-12);
const r = new Value(-1); r.relu().backward(); assert.equal(r.grad, 0);
console.log("autograd.js ok");
