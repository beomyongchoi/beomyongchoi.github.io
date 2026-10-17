// Stacking layers with and without normalization, and where the norm sits (Post-LN 2017 vs Pre-LN).
// Each layer's sublayer is a random 2-layer MLP (SiLU, He-style init) — no training, just what one
// forward and one backward pass do to the signal's size. Also the FFN parameter math for SwiGLU.
// Pinned by scripts/lab-depth.check.mjs.

function gauss(seed) {
  let a = seed >>> 0;
  const u = () => { a = (a + 0x6d2b79f5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return (((t ^ (t >>> 14)) >>> 0) + 1) / 4294967297; };
  let spare = null;   // Box–Muller gives two normals per draw
  return () => { if (spare !== null) { const v = spare; spare = null; return v; } const r = Math.sqrt(-2 * Math.log(u())), t = 2 * Math.PI * u(); spare = r * Math.sin(t); return r * Math.cos(t); };
}
const matrix = (r, c, sd, g) => Array.from({ length: r }, () => Float64Array.from({ length: c }, () => g() * sd));
function mul(M, v) {
  const out = new Float64Array(M.length);
  for (let i = 0; i < M.length; i++) { const row = M[i]; let s = 0; for (let j = 0; j < row.length; j++) s += row[j] * v[j]; out[i] = s; }
  return out;
}
function mulT(M, v) {
  const out = new Float64Array(M[0].length);
  for (let i = 0; i < M.length; i++) { const row = M[i], vi = v[i]; for (let j = 0; j < row.length; j++) out[j] += row[j] * vi; }
  return out;
}
const cos = (a, b) => { let ab = 0, aa = 0, bb = 0; for (let i = 0; i < a.length; i++) { ab += a[i] * b[i]; aa += a[i] * a[i]; bb += b[i] * b[i]; } return ab / Math.sqrt(aa * bb); };
export const rms = (v) => Math.sqrt(v.reduce((s, x) => s + x * x, 0) / v.length);

const sig = (u) => 1 / (1 + Math.exp(-u));
const silu = (u) => u * sig(u), dsilu = (u) => sig(u) * (1 + u * (1 - sig(u)));

// Normalize (forward) and its vector-Jacobian product (backward). "layer" = LayerNorm without affine,
// "rms" = RMSNorm: skip the mean, divide by root-mean-square only.
function norm(z, kind) {
  const d = z.length, mu = kind === "layer" ? z.reduce((s, x) => s + x, 0) / d : 0;
  const c = z.map((x) => x - mu), r = Math.sqrt(c.reduce((s, x) => s + x * x, 0) / d + 1e-6);
  return { y: c.map((x) => x / r), r };
}
function normBack(dy, y, r, kind) {
  const d = dy.length, m = kind === "layer" ? dy.reduce((s, x) => s + x, 0) / d : 0;
  const my = dy.reduce((s, x, i) => s + x * y[i], 0) / d;
  return dy.map((x, i) => (x - m - y[i] * my) / r);
}

export function makeStack({ layers = 48, d = 64, seed = 1 } = {}) {
  const g = gauss(seed);
  return { d, layers: Array.from({ length: layers }, () => ({ W1: matrix(d, d, Math.sqrt(2 / d), g), W2: matrix(d, d, Math.sqrt(1 / d), g) })), x0: Float64Array.from({ length: d }, g), gOut: Float64Array.from({ length: d }, g) };
}

// mode: "none" x + F(x) · "post" Norm(x + F(x)) (2017) · "pre" x + F(Norm(x)), final Norm on top (GPT-2 on).
// Returns RMS of the signal entering each layer (fwd), how much of the original input it still points
// along (keep = cosine with x0), and the RMS of the gradient there (bwd).
export function run(S, mode, kind = "layer", n = S.layers.length) {
  const tape = [], fwd = [], keep = [];
  let x = S.x0;
  for (let l = 0; l < n; l++) {
    const { W1, W2 } = S.layers[l];
    fwd.push(rms(x)); keep.push(cos(x, S.x0));
    const t = { x };
    const inF = mode === "pre" ? (t.n = norm(x, kind)).y : x;
    t.u = mul(W1, inF);
    const f = mul(W2, t.u.map(silu));
    const z = x.map((v, i) => v + f[i]);
    if (mode === "post") { t.post = norm(z, kind); x = t.post.y; } else x = z;
    tape.push(t);
  }
  let top = null;
  if (mode === "pre") { top = norm(x, kind); x = top.y; }
  fwd.push(rms(x)); keep.push(cos(x, S.x0));

  let gr = Array.from(S.gOut);
  if (top) gr = normBack(gr, top.y, top.r, kind);
  const bwd = new Array(n);
  for (let l = n - 1; l >= 0; l--) {
    const { W1, W2 } = S.layers[l], t = tape[l];
    if (t.post) gr = normBack(gr, t.post.y, t.post.r, kind);
    let gIn = mulT(W1, mulT(W2, gr).map((v, i) => v * dsilu(t.u[i])));
    if (t.n) gIn = normBack(Array.from(gIn), t.n.y, t.n.r, kind);
    gr = gr.map((v, i) => v + gIn[i]);
    bwd[l] = rms(gr);
  }
  return { fwd, bwd, keep, out: x, gx0: gr };
}

// FFN parameters per layer. Plain: d→h→d (2·d·h). SwiGLU: gate and up d→h, down h→d (3·d·h);
// keeping the same count means h = 2/3 of the plain FFN's 4d.
export const ffnParams = (d, h, glu) => (glu ? 3 : 2) * d * h;
