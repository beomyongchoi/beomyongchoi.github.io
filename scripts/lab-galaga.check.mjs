// node scripts/lab-galaga.check.mjs — deterministic per seed; a bot that reads the harness
// outlook scores far more and survives longer than one that only fires in place.
import assert from "node:assert/strict";
import { TICKS, newGame, step, outlook, rawText, harnessText, allowed } from "../public/lab/galaga.js";

function play(seed, policy) {
  let s = newGame();
  while (!s.dead && s.t < TICKS) s = step(s, seed, policy(s, seed));
  return s;
}
const turret = () => "fire";
const harnessed = (s, seed) => {
  const o = outlook(s, seed), ok = (m) => !o[m].startsWith("UNSAFE");
  if (ok("fire") && !s.shot && o.fire.includes("enemy above")) return "fire";
  const near = harnessText(s, seed).match(/Nearest enemy column: (\d+)/);
  const want = near ? (+near[1] < s.x ? "left" : +near[1] > s.x ? "right" : "stay") : "stay";
  return [want, "stay", "left", "right"].find(ok) ?? "stay";
};

assert.deepEqual(play(5, turret), play(5, turret));
let a = 0, b = 0, livesA = 0, livesB = 0;
for (let seed = 1; seed <= 30; seed++) {
  const t = play(seed, turret), h = play(seed, harnessed);
  a += t.score; b += h.score; livesA += t.lives; livesB += h.lives;
}
assert.ok(b > a * 1.2, `harnessed ${b} vs turret ${a}`);
assert.ok(livesB > livesA * 1.5, `harnessed keeps more lives: ${livesB} vs ${livesA}`);
assert.match(rawText(newGame()), /P/);
// The guardrail never offers a move that loses a life (when any survivable move exists).
for (let seed = 1; seed <= 10; seed++) {
  let s = newGame();
  for (let i = 0; i < 80 && !s.dead; i++) {
    const ok = allowed(s, seed);
    for (const m of ok) { const n = step(s, seed, m); assert.ok(!(n.dead === "car" || n.lives < s.lives) || ok.length === 1, `allowed ${m} kills (seed ${seed})`); }
    s = step(s, seed, ok[0]);
  }
}
console.log(`galaga.js ok (30 seeds: turret ${(a / 30).toFixed(0)} pts, harnessed bot ${(b / 30).toFixed(0)} pts)`);
