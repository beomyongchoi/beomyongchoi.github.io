// node scripts/lab-crossy.check.mjs — same seed = same world; the harness outlook is truthful;
// a bot that follows it crosses far more rows than one that always goes up.
import assert from "node:assert/strict";
import { MOVES, newGame, step, outlook, car, lane, rawText, harnessText, allowed } from "../public/lab/crossy.js";

function play(seed, policy, ticks = 240) {
  let s = newGame();
  while (!s.dead && s.t < ticks) s = step(s, seed, policy(s, seed));
  return s;
}
const blind = () => "up";
const harnessed = (s, seed) => {
  const o = outlook(s, seed), ok = (m) => o[m] === "safe";
  return ["up", "stay", "left", "right", "down"].find(ok) ?? "stay";
};

let truthful = 0, checks = 0, blindRows = 0, smartRows = 0;
for (let seed = 1; seed <= 30; seed++) {
  assert.equal(car(seed, 5, 3, 17), car(seed, 5, 3, 17));
  // Every "safe" in the outlook really survives the next tick; every "UNSAFE" really dies.
  let s = newGame();
  for (let i = 0; i < 60 && !s.dead; i++) {
    const o = outlook(s, seed);
    for (const m of MOVES) {
      if (o[m].startsWith("blocked")) continue;
      const n = step(s, seed, m);
      checks++;
      truthful += (o[m] === "safe") === (n.dead !== "car");
    }
    s = step(s, seed, harnessed(s, seed));
  }
  blindRows += play(seed, blind).best;
  smartRows += play(seed, harnessed).best;
}
assert.equal(truthful, checks, "outlook must match what step() does");
assert.ok(smartRows > blindRows * 3, `harnessed ${smartRows} vs blind ${blindRows}`);
assert.ok(lane(1, 0).kind === "grass" && lane(1, 1).kind === "grass", "start rows are safe");
assert.match(rawText(newGame(), 1), /P/);
assert.match(harnessText(newGame(), 1), /up: /);
// The guardrail never offers a move that loses a life (when any survivable move exists).
for (let seed = 1; seed <= 10; seed++) {
  let s = newGame();
  for (let i = 0; i < 80 && !s.dead; i++) {
    const ok = allowed(s, seed);
    for (const m of ok) { const n = step(s, seed, m); assert.ok(!(n.dead === "car" || n.lives < s.lives) || ok.length === 1, `allowed ${m} kills (seed ${seed})`); }
    s = step(s, seed, ok[0]);
  }
}
console.log(`crossy.js ok (30 seeds: always-up ${(blindRows / 30).toFixed(1)} rows, harnessed bot ${(smartRows / 30).toFixed(1)} rows)`);
