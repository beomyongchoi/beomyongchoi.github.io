// Blog series definitions. Each part links a post slug to its playground toy.
// `published: false` parts render as dimmed "곧/soon" in the series nav.

type L = { ko: string; en: string };
export type SeriesPart = { slug: string; title: L; toy?: string; published: boolean };
export type Series = { title: L; blurb: L; parts: SeriesPart[] };

export const SERIES: Record<string, Series> = {
  transformer: {
    title: { ko: "트랜스포머 뜯어보기", en: "Taking the Transformer Apart" },
    blurb: {
      ko: "어텐션부터 GPT까지, LLM이 실제로 어떻게 작동하는지 글 + 인터랙티브로 한 편씩.",
      en: "From attention to GPT — how LLMs actually work, one post + interactive at a time.",
    },
    parts: [
      { slug: "attention-why", toy: "/playground/transformer/", published: true, title: { ko: "1. 어텐션 — Q·K 궁합", en: "1. Attention — the Q·K match" } },
      { slug: "transformer-block", toy: "/playground/transformer-block/", published: false, title: { ko: "2. 트랜스포머 블록", en: "2. The Transformer block" } },
      { slug: "bert-encoder", toy: "/playground/bert/", published: false, title: { ko: "3. 인코더 온리 — BERT", en: "3. Encoder-only — BERT" } },
      { slug: "gpt-decoder", toy: "/playground/gpt/", published: false, title: { ko: "4. 디코더 온리 — GPT", en: "4. Decoder-only — GPT" } },
    ],
  },
};

/** Find which series (if any) a post slug belongs to. */
export function seriesOf(slug: string): { id: string; series: Series } | null {
  for (const [id, series] of Object.entries(SERIES)) {
    if (series.parts.some((p) => p.slug === slug)) return { id, series };
  }
  return null;
}
