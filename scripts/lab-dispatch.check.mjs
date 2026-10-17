// node scripts/lab-dispatch.check.mjs — same seed = same tokens; the default router (always the top
// affinity) overloads popular experts and drops tokens; DeepSeek-style bias balancing beats it;
// a player who watches the queues can beat the bot.
import assert from "node:assert/strict";
import { E, CAP, newGame, route, over, greedy, deepseek, affinity } from "../public/lab/dispatch.js";

assert.deepEqual(affinity(3, 7), affinity(3, 7));
assert.ok(affinity(3, 7).every((x) => x >= 0 && x <= 100));
const run = (seed, pol) => { let g = newGame(seed); while (!over(g)) g = pol === "ds" ? deepseek(g) : route(g, pol(g)); return g; };
const planner = (g) => { const a = affinity(g.seed, g.i); let best = 0, bv = -Infinity; for (let e = 0; e < E; e++) { const v = g.q[e] >= CAP ? -Infinity : a[e] - 12 * g.q[e]; if (v > bv) { bv = v; best = e; } } return best; };
const avg = (pol) => { let s = 0, d = 0; for (let seed = 1; seed <= 100; seed++) { const g = run(seed, pol); s += g.score; d += g.dropped; } return { score: Math.round(s / 100), dropped: d / 100 }; };
const G = avg(greedy), D = avg("ds"), P = avg(planner);
assert.ok(G.dropped > 10, "the default router drops tokens");
assert.ok(D.score > G.score * 1.3 && D.dropped < 2, "bias balancing beats greedy");
assert.ok(P.score > D.score, "a careful player can beat the bot");
console.log(`dispatch.js ok (avg over 100 seeds — greedy ${G.score} (drops ${G.dropped}), DeepSeek bot ${D.score} (drops ${D.dropped}), planner ${P.score})`);
