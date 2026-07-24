// Blog series definitions. Each part links a post slug to its playground toy.
// `published: false` parts render as dimmed "곧/soon" in the series nav.

type L = { ko: string; en: string };
export type SeriesPart = { slug: string; title: L; toy?: string; published: boolean };
export type Series = { title: L; blurb: L; parts: SeriesPart[] };

export const SERIES: Record<string, Series> = {
  training: {
    title: { ko: "모델은 어떻게 배우나", en: "How Models Learn" },
    blurb: {
      ko: "손실부터 역전파, 라이브 학습까지 — W가 실제로 어떻게 정해지는지 글 + 인터랙티브로 한 편씩. (선형대수·트랜스포머 시리즈의 마지막 조각)",
      en: "From loss to backprop to watching a live run — how the weights actually get set, one post + interactive at a time. (The final piece after the linear-algebra and Transformer series.)",
    },
    parts: [
      { slug: "loss-function", toy: "/playground/loss/", published: true, title: { ko: "0. 손실 — 틀림을 숫자로", en: "0. Loss — error as a number" } },
      { slug: "gradient-descent", toy: "/playground/gradient/", published: true, title: { ko: "1. 경사하강 — 내리막 한 걸음", en: "1. Gradient descent — one step downhill" } },
      { slug: "backprop", toy: "/playground/backprop/", published: false, title: { ko: "2. 역전파 — 책임을 거꾸로", en: "2. Backprop — blame flows backward" } },
      { slug: "training-live", toy: "/playground/train/", published: false, title: { ko: "3. 실전 — 학습을 지켜보기", en: "3. Watching a network learn" } },
    ],
  },
  linalg: {
    title: { ko: "행렬로 생각하기", en: "Thinking in Matrices" },
    blurb: {
      ko: "LLM 밑바닥의 선형대수. 왜 벡터로 표현하고 왜 행렬곱인지, 글 + 인터랙티브로 한 편씩. (트랜스포머 시리즈의 prequel)",
      en: "The linear algebra under LLMs. Why vectors, why matrix multiplication — one post + interactive at a time. (Prequel to the Transformer series.)",
    },
    parts: [
      { slug: "vectors-why", toy: "/playground/vectors/", published: true, title: { ko: "0. 왜 벡터인가", en: "0. Why vectors" } },
      { slug: "matrix-transform", toy: "/playground/matmul/", published: true, title: { ko: "1. 행렬 = 한 번에 변환", en: "1. Matrix = transform at once" } },
      { slug: "linear-geometry", toy: "/playground/linear-map/", published: true, title: { ko: "2. 선형변환의 기하", en: "2. The geometry of linear maps" } },
      { slug: "nonlinear-network", toy: "/playground/neural-layer/", published: true, title: { ko: "3. 선형 + 비선형 = 신경망", en: "3. Linear + nonlinear = a network" } },
    ],
  },
  transformer: {
    title: { ko: "트랜스포머 뜯어보기", en: "Taking the Transformer Apart" },
    blurb: {
      ko: "어텐션부터 GPT까지, LLM이 실제로 어떻게 작동하는지 글 + 인터랙티브로 한 편씩.",
      en: "From attention to GPT — how LLMs actually work, one post + interactive at a time.",
    },
    parts: [
      { slug: "tokens-embeddings", toy: "/playground/embeddings/", published: true, title: { ko: "0. 토큰화·임베딩", en: "0. Tokens & embeddings" } },
      { slug: "attention-why", toy: "/playground/transformer/", published: true, title: { ko: "1. 어텐션 — Q·K 궁합", en: "1. Attention — the Q·K match" } },
      { slug: "transformer-block", toy: "/playground/transformer-block/", published: true, title: { ko: "2. 트랜스포머 블록", en: "2. The Transformer block" } },
      { slug: "bert-encoder", toy: "/playground/bert/", published: true, title: { ko: "3. 인코더 온리 — BERT", en: "3. Encoder-only — BERT" } },
      { slug: "gpt-decoder", toy: "/playground/gpt/", published: true, title: { ko: "4. 디코더 온리 — GPT", en: "4. Decoder-only — GPT" } },
    ],
  },
  agents: {
    title: { ko: "에이전틱 AI 아키텍처", en: "Agentic AI Architecture" },
    blurb: {
      ko: "가변 추론부터 서브에이전트 오케스트레이션까지 — 에이전트 시스템이 실제로 어떻게 동작하는지 글 + 인터랙티브로 한 편씩.",
      en: "From variable reasoning to subagent orchestration — how agent systems actually operate, one post + interactive at a time.",
    },
    parts: [
      { slug: "agent-thinking-effort", toy: "/playground/thinking-effort/", published: true, title: { ko: "0. 가변 추론 — 생각의 깊이를 조절하다", en: "0. Variable reasoning — tuning thinking effort" } },
      { slug: "agent-subagents-fanout", toy: "/playground/agent-topology/", published: true, title: { ko: "1. 병렬 오케스트레이션 — 동적 서브에이전트", en: "1. Parallel orchestration — dynamic subagents" } },
      { slug: "agent-deep-reasoning", toy: "/playground/long-horizon/", published: true, title: { ko: "2. 심층 장기 추론 — Claude Fable 5", en: "2. Deep reasoning — Claude Fable 5" } },
      { slug: "agent-architecture-compare", toy: "/playground/agent-compare/", published: false, title: { ko: "3. 아키텍처 비교 — 적재적소의 에이전트", en: "3. Architecture comparison — matching agents to tasks" } },
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
