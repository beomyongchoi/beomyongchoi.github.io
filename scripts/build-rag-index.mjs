// node scripts/build-rag-index.mjs — embed every post section (KO and EN) for /playground/rag/.
// Re-run after editing posts; writes public/lab/rag-index.json (committed, ~1 MB).
// Same model + dtype as the browser (multilingual-e5-small, q8) so query vectors are comparable.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { pipeline } from "@huggingface/transformers";

const ROOT = new URL("..", import.meta.url).pathname;
const MODEL = "Xenova/multilingual-e5-small";
const MAX = 600; // chars per chunk; longer sections split on sentence boundaries

const strip = (h) => h.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const unnum = (h) => h.replace(/^\s*\d+\.\s*/, "");

// One entry per (post, section, lang, piece). Section 0 = text before the first h2.
// s = h2 index (matches the post TOC anchors #s-N), so results can deep-link.
function sections(blocks) {
  const out = [{ s: 0, head: { ko: "", en: "" }, ko: [], en: [] }];
  for (const b of blocks) {
    if (b.type === "h2") { out.push({ s: out.length, head: { ko: unnum(strip(b.ko)), en: unnum(strip(b.en)) }, ko: [], en: [] }); continue; }
    const cur = out.at(-1);
    const add = (ko, en) => { cur.ko.push(strip(ko)); cur.en.push(strip(en)); };
    if (b.type === "p") b.s.forEach((x) => add(x.ko, x.en));
    else if (b.type === "list") b.items.forEach((x) => add(x.ko, x.en));
    else if (b.type === "callout" || b.type === "quote") add(b.ko, b.en);
  }
  return out.filter((x) => x.ko.length);
}

function pieces(sents) {
  const out = [];
  let cur = "";
  for (const s of sents) {
    if (cur && cur.length + s.length > MAX) { out.push(cur); cur = ""; }
    cur += (cur ? " " : "") + s;
  }
  if (cur) out.push(cur);
  return out;
}

const dir = ROOT + "src/content/blog/";
const entries = [];
for (const f of readdirSync(dir).filter((f) => f.endsWith(".mdx") && !f.endsWith("-en.mdx"))) {
  const src = readFileSync(dir + f, "utf8");
  if (/^draft:\s*true/m.test(src)) continue;
  // The RAG post quotes its own test questions verbatim; indexing it lets keyword search
  // return the post itself as #1 (it did: 17.52). Keep the eval questions out of the corpus.
  if (f === "rag-retrieval.mdx") continue;
  const data = src.match(/import \{ blocks \} from "\.\.\/\.\.\/data\/([^"]+)"/)?.[1];
  if (!data) continue;
  const slug = f.replace(/\.mdx$/, "");
  const enSrc = (() => { try { return readFileSync(dir + slug + "-en.mdx", "utf8"); } catch { return ""; } })();
  const title = { ko: src.match(/^title: "(.*)"$/m)[1], en: enSrc.match(/^title: "(.*)"$/m)?.[1] ?? "" };
  const { blocks } = await import(ROOT + "src/data/" + data + ".ts");
  for (const sec of sections(blocks))
    for (const lang of ["ko", "en"])
      pieces(sec[lang]).forEach((text, p) => entries.push({ slug, title: title[lang] || title.ko, s: sec.s, p, lang, head: sec.head[lang], text }));
}

const embed = await pipeline("feature-extraction", MODEL, { dtype: "q8" });
for (let i = 0; i < entries.length; i += 16) {
  const batch = entries.slice(i, i + 16);
  const out = await embed(batch.map((e) => "passage: " + (e.head ? e.head + ". " : "") + e.text), { pooling: "mean", normalize: true });
  const [, d] = out.dims;
  batch.forEach((e, k) => (e.v = Array.from(out.data.slice(k * d, (k + 1) * d), (x) => Math.round(x * 1000) / 1000)));
  process.stdout.write(`\rembedded ${Math.min(i + 16, entries.length)}/${entries.length}`);
}
writeFileSync(ROOT + "public/lab/rag-index.json", JSON.stringify({ model: MODEL, dtype: "q8", built: new Date().toISOString().slice(0, 10), entries }));
console.log(`\nwrote ${entries.length} chunks from ${new Set(entries.map((e) => e.slug)).size} posts`);
