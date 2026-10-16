// Grid space shooter. Every random draw is a pure function of (seed, tick), so two players face the
// same enemy fire pattern. Your shot climbs 2 rows a tick; enemy shots fall 1. Three lives.
// Also: the raw/harnessed text a decision model sees. Pinned by scripts/lab-galaga.check.mjs.

export const W = 9, H = 12, TICKS = 240, MOVES = ["left", "right", "stay", "fire"];
export const OPTIONS = { left: "move one column left", right: "move one column right", stay: "do not move", fire: "shoot straight up" };
export const KEYS = { ArrowLeft: "left", a: "left", ArrowRight: "right", d: "right", " ": "fire", ArrowUp: "fire", w: "fire" };
export const GOAL = "You fly the ship at the bottom of a space shooter. Shoot enemies above you and avoid enemy bullets. Pick this tick's move.";

const rnd = (seed, t, k) => {
  let a = (seed * 2654435761 + t * 40503 + k * 97) >>> 0;
  a = Math.imul(a ^ (a >>> 16), 0x45d9f3b); a = Math.imul(a ^ (a >>> 16), 0x45d9f3b);
  return ((a ^ (a >>> 16)) >>> 0) / 4294967296;
};
const sway = (t) => [0, 1, 2, 1][Math.floor(t / 4) % 4];
const fullWave = () => Array.from({ length: 18 }, (_, i) => [i % 6, 1 + Math.floor(i / 6)]);   // [col, row], 6×3

export const newGame = () => ({ x: 4, t: 0, lives: 3, score: 0, wave: 1, shot: null, bombs: [], foes: fullWave(), dead: false });
export const enemyAt = (s, x, y) => s.foes.some(([c, r]) => c + sway(s.t) === x && r === y);

export function step(s, seed, m) {
  if (s.dead) return s;
  let { x, lives, score, wave, shot, bombs, foes } = s;
  const t = s.t;
  if (m === "left") x = Math.max(0, x - 1);
  if (m === "right") x = Math.min(W - 1, x + 1);
  if (m === "fire" && !shot) shot = { x, y: H - 1 };
  if (shot) {
    for (let k = 0; k < 2 && shot; k++) {
      const y = shot.y - 1;
      const hitI = foes.findIndex(([c, r]) => c + sway(t) === shot.x && r === y);
      if (hitI >= 0) { foes = foes.filter((_, i) => i !== hitI); score += 100; shot = null; }
      else shot = y < 0 ? null : { x: shot.x, y };
    }
  }
  // A bomb hits you if it's on your row in your column before or after it falls (no passing through).
  const hit = bombs.some((b) => b.x === x && (b.y === H - 1 || b.y + 1 === H - 1));
  bombs = hit ? [] : bombs.map((b) => ({ x: b.x, y: b.y + 1 })).filter((b) => b.y < H);
  if (hit) lives--;
  if (rnd(seed, t, 1) < Math.min(0.6, 0.3 + 0.06 * wave) && foes.length) {
    const aim = Math.floor(rnd(seed, t, 2) * W), sw = sway(t + 1);
    let best = null;
    for (const [c, r] of foes) {
      const d = Math.abs(c + sw - aim);
      if (!best || d < best.d || (d === best.d && r > best.r)) best = { d, c: c + sw, r };
    }
    bombs.push({ x: best.c, y: best.r + 1 });
  }
  if (!foes.length) { wave++; foes = fullWave(); }
  return { x, t: t + 1, lives, score, wave, shot, bombs, foes, dead: lives <= 0 };
}

// Human controls: keys held (or tapped since the last tick), not a queue. Fire whenever the gun is ready,
// otherwise move — so holding space + an arrow strafes and shoots. Still one action per tick, like the model.
export const human = (s, held) => {
  const l = held.has("left"), r = held.has("right");
  return held.has("fire") && !s.shot ? "fire" : l && !r ? "left" : r && !l ? "right" : "stay";
};

export const scoreOf = (s) => s.score;
export const statusOf = (s) => `${s.score.toLocaleString()}점 · ♥${s.lives}`;

export function rawText(s) {
  const rows = [];
  for (let y = 0; y < H; y++) {
    rows.push(Array.from({ length: W }, (_, c) =>
      y === H - 1 && c === s.x ? "P" : enemyAt(s, c, y) ? "E" : s.shot && s.shot.x === c && s.shot.y === y ? "|" : s.bombs.some((b) => b.x === c && b.y === y) ? "v" : ".").join(""));
  }
  return `Screen, top to bottom. P = you, E = enemy, v = enemy bullet falling, | = your bullet.\n${rows.join("\n")}`;
}

// The harness: simulate each move one tick ahead and summarise what matters.
export function outlook(s, seed) {
  return Object.fromEntries(MOVES.map((m) => {
    const n = step(s, seed, m);
    if (n.lives < s.lives) return [m, "UNSAFE: a bullet hits you"];
    if (m === "fire" && s.shot) return [m, "safe, but your gun is reloading (bullet still flying)"];
    const above = s.foes.filter(([c]) => c + sway(s.t) === n.x).length;
    return [m, `safe${above ? `, enemy above column ${n.x}` : ""}`];
  }));
}

// Harness guardrail: drop moves that get you hit, and "fire" while the gun is reloading (a no-op).
export const allowed = (s, seed) => { const o = outlook(s, seed); return MOVES.filter((m) => !o[m].startsWith("UNSAFE") && !(m === "fire" && s.shot)); };
// Qwen3 hardly ever says "fire" whatever the screen shows (0.4% on an empty state), so divide that habit out.
export const CALIBRATE = true;

export function harnessText(s, seed) {
  const o = outlook(s, seed), sw = sway(s.t), cols = [...new Set(s.foes.map(([c]) => c + sw))].sort((a, b) => Math.abs(a - s.x) - Math.abs(b - s.x));
  return `${MOVES.map((m) => `${m}: ${o[m]}`).join("\n")}\nYou are in column ${s.x}. Nearest enemy column: ${cols[0] ?? "none"}. Gun: ${s.shot ? "reloading" : "ready"}.`;
}

export function draw(ctx, s, seed, cw) {
  ctx.fillStyle = "#0b0d17"; ctx.fillRect(0, 0, W * cw, H * cw);
  ctx.fillStyle = "#2a2e42";
  for (let i = 0; i < 24; i++) ctx.fillRect(((i * 37 + s.t * (i % 3 + 1)) % (W * cw)), ((i * 53 + s.t * 2) % (H * cw)), 2, 2);
  const sw = sway(s.t), px = (x) => x * cw, u = cw / 8;
  for (const [c, r] of s.foes) {
    ctx.fillStyle = r === 1 ? "#ff9e64" : r === 2 ? "#bb9af7" : "#7aa2f7";
    const X = px(c + sw), Y = px(r);
    ctx.fillRect(X + 2 * u, Y + 2 * u, 4 * u, 3 * u); ctx.fillRect(X + u, Y + 3 * u, u, 3 * u); ctx.fillRect(X + 6 * u, Y + 3 * u, u, 3 * u);
    ctx.fillStyle = "#0b0d17"; ctx.fillRect(X + 3 * u, Y + 3 * u, u, u); ctx.fillRect(X + 5 * u, Y + 3 * u, u, u);
  }
  ctx.fillStyle = "#f7768e";
  for (const b of s.bombs) ctx.fillRect(px(b.x) + 3.5 * u, px(b.y) + 2 * u, u, 4 * u);
  if (s.shot) { ctx.fillStyle = "#e0af68"; ctx.fillRect(px(s.shot.x) + 3.5 * u, px(s.shot.y) + u, u, 6 * u); }
  if (!s.dead) {
    const X = px(s.x), Y = px(H - 1);
    ctx.fillStyle = "#c0caf5"; ctx.fillRect(X + 3.5 * u, Y + u, u, 2 * u); ctx.fillRect(X + 2 * u, Y + 3 * u, 4 * u, 2 * u); ctx.fillRect(X + u, Y + 5 * u, 6 * u, 2 * u);
    ctx.fillStyle = "#9ece6a"; ctx.fillRect(X + u, Y + 5 * u, u, u); ctx.fillRect(X + 6 * u, Y + 5 * u, u, u);
  }
}
export const SIZE = { cols: W, rows: H };
