// Road-crossing game on a grid, as pure functions of (seed, row, tick) so two players can face
// the exact same world. Rows go up from 0; each row is grass (maybe trees) or a road whose cars
// slide one cell every `every` ticks. Also: the raw/harnessed text a decision model sees.
// Pinned by scripts/lab-crossy.check.mjs.

export const W = 9, VIEW = 10, TICKS = 240, MOVES = ["up", "left", "right", "down", "stay"], EAGLE = 24;
export const OPTIONS = { up: "hop forward one row", left: "hop one column left", right: "hop one column right", down: "hop back one row", stay: "wait in place" };
export const KEYS = { ArrowUp: "up", w: "up", ArrowLeft: "left", a: "left", ArrowRight: "right", d: "right", ArrowDown: "down", s: "down" };
export const SIZE = { cols: W, rows: VIEW };

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const cache = new Map();
export function lane(seed, row) {
  const key = seed + ":" + row;
  if (cache.has(key)) return cache.get(key);
  const r = rng(seed * 7919 + row * 104729 + 1);
  let l;
  if (row < 2 || r() < 0.4) {
    const trees = row < 2 ? [] : Array.from({ length: W }, (_, c) => c !== 4 && r() < 0.18);
    l = { kind: "grass", trees: (c) => !!trees[c] };
  } else {
    const len = 10 + Math.floor(r() * 5), pat = new Array(len).fill(false);
    for (let c = Math.floor(r() * 3); c < len - 1; c += 3 + Math.floor(r() * 3)) {
      pat[c] = true;
      if (r() < 0.4) pat[c + 1] = true;   // two-cell truck
    }
    l = { kind: "road", dir: r() < 0.5 ? 1 : -1, every: 1 + Math.floor(r() * 3), len, pat };
  }
  cache.set(key, l);
  return l;
}

// Is there a car at column c of road row `row` at tick t?
export function car(seed, row, c, t) {
  const l = lane(seed, row);
  if (l.kind !== "road") return false;
  const shift = Math.floor(t / l.every) * l.dir;
  return l.pat[(((c - shift) % l.len) + l.len) % l.len];
}

export const newGame = () => ({ x: 4, y: 0, t: 0, best: 0, idle: 0, dead: null });

function target(s, seed, m) {
  const [dx, dy] = { up: [0, 1], down: [0, -1], left: [-1, 0], right: [1, 0], stay: [0, 0] }[m];
  const x = s.x + dx, y = s.y + dy;
  if (x < 0 || x >= W || y < 0) return { x: s.x, y: s.y, blocked: "edge" };
  const l = lane(seed, y);
  if (l.kind === "grass" && l.trees(x)) return { x: s.x, y: s.y, blocked: "tree" };
  return { x, y, blocked: null };
}

// Hit if a car sits on your new cell before or after cars move this tick (no passing through).
const hit = (seed, x, y, t) => car(seed, y, x, t) || car(seed, y, x, t + 1);

export function step(s, seed, m) {
  if (s.dead) return s;
  const p = target(s, seed, m), t = s.t + 1;
  const best = Math.max(s.best, p.y), idle = p.y > s.best ? 0 : s.idle + 1;
  const dead = hit(seed, p.x, p.y, s.t) ? "car" : idle >= EAGLE ? "eagle" : null;
  return { x: p.x, y: p.y, t, best, idle, dead };
}

// What happens next tick for each move — the "harness" pre-computes this for the model.
export function outlook(s, seed) {
  return Object.fromEntries(MOVES.map((m) => {
    const p = target(s, seed, m);
    if (p.blocked && m !== "stay") return [m, p.blocked === "tree" ? "blocked by a tree" : "blocked by the edge"];
    return [m, hit(seed, p.x, p.y, s.t) ? "UNSAFE: a car hits you" : "safe"];
  }));
}

// Raw view: just the nearby lanes as the screen shows them.
export function rawText(s, seed) {
  const rows = [];
  for (let y = s.y + 2; y >= Math.max(0, s.y - 1); y--) {
    const l = lane(seed, y);
    const cells = Array.from({ length: W }, (_, c) => (y === s.y && c === s.x ? "P" : l.kind === "road" ? (car(seed, y, c, s.t) ? "C" : ".") : l.trees(c) ? "T" : "."));
    const what = l.kind === "road" ? `road, cars move ${l.dir > 0 ? "right" : "left"} 1 cell every ${l.every} tick${l.every > 1 ? "s" : ""}` : "grass";
    rows.push(`row ${y - s.y >= 0 ? "+" : ""}${y - s.y} ${cells.join("")} (${what})`);
  }
  return `You are P. C = car, T = tree. Row +1 is ahead.\n${rows.join("\n")}`;
}

// Harness guardrail: offer only moves that survive the next tick (blocked hops are no-ops, so out too).
export const allowed = (s, seed) => { const o = outlook(s, seed), ok = MOVES.filter((m) => o[m] === "safe"); return ok.length ? ok : ["stay"]; };
// The goal itself makes "up" the model's default — dividing that out would erase the goal, so no calibration here.
export const CALIBRATE = false;

export function harnessText(s, seed) {
  const o = outlook(s, seed);
  return `${MOVES.map((m) => `${m}: ${o[m]}`).join("\n")}\nForward progress only comes from up. ${EAGLE - s.idle} ticks left before the eagle takes you for not moving forward.`;
}

export const GOAL = "Cross as many rows as possible by moving up, without getting hit by a car. Pick this tick's move.";

export const scoreOf = (s) => s.best;
export const statusOf = (s) => `${s.best}줄${s.dead === "eagle" ? " · 독수리!" : s.dead ? " · 쾅!" : ""}`;

// Camera keeps the player 2 rows above the bottom edge.
export function draw(ctx, s, seed, cw) {
  const base = Math.max(0, s.y - 2), u = cw / 8;
  for (let i = 0; i < VIEW; i++) {
    const y = base + i, Y = (VIEW - 1 - i) * cw, l = lane(seed, y);
    ctx.fillStyle = l.kind === "road" ? "#24283b" : y % 2 ? "#2f4a2a" : "#35532f";
    ctx.fillRect(0, Y, W * cw, cw);
    for (let c = 0; c < W; c++) {
      const X = c * cw;
      if (l.kind === "grass" && l.trees(c)) {
        ctx.fillStyle = "#1f3320"; ctx.fillRect(X + 2 * u, Y + u, 4 * u, 5 * u);
        ctx.fillStyle = "#5c4033"; ctx.fillRect(X + 3.5 * u, Y + 6 * u, u, 2 * u);
      }
      if (l.kind === "road") {
        ctx.fillStyle = "#3b4261"; if (c % 2 === 0) ctx.fillRect(X + 3 * u, Y + 3.5 * u, 2 * u, u * 0.6);
        if (car(seed, y, c, s.t)) {
          ctx.fillStyle = l.dir > 0 ? "#ff9e64" : "#7dcfff"; ctx.fillRect(X + u * 0.5, Y + 1.5 * u, 7 * u, 5 * u);
          ctx.fillStyle = "#1a1b26"; ctx.fillRect(X + (l.dir > 0 ? 5 : 1) * u, Y + 2.5 * u, 2 * u, 3 * u);
        }
      }
    }
  }
  const X = s.x * cw, Y = (VIEW - 1 - (s.y - base)) * cw;
  ctx.fillStyle = s.dead ? "#f7768e" : "#f5f5f5"; ctx.fillRect(X + 2 * u, Y + 2 * u, 4 * u, 4 * u);
  ctx.fillStyle = "#ff9e64"; ctx.fillRect(X + 5 * u, Y + 3.5 * u, 1.5 * u, u);
  ctx.fillStyle = "#f7768e"; ctx.fillRect(X + 3 * u, Y + u, 2 * u, u);
  ctx.fillStyle = "#1a1b26"; ctx.fillRect(X + 4.2 * u, Y + 2.8 * u, 0.8 * u, 0.8 * u);
}
