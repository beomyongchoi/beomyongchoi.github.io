import type { BiBlock } from "./aiParadox";

// Parameter counts: public/lab/arch.js. Router numbers: public/lab/moe.js with its defaults
// (1,024 tokens, 16 experts, k=2, skew 1.5, seed 7, u=0.01), pinned by scripts/lab-moe.check.mjs.
// Paper figures checked against arXiv / official posts 2026-10-16.
export const blocks: BiBlock[] = [
  {
    type: "callout",
    tone: "tldr",
    ko: "<strong>결론부터.</strong> MoE는 FFN 하나를 여러 <strong>전문가</strong>로 쪼개고, 토큰마다 몇 개만 켭니다. 지식은 크게 담고 계산은 작게 하는 구조입니다. 아이디어는 1991년 논문에서 시작했고, DeepSeek이 처음 만든 게 아닙니다. 딥시크가 바꾼 건 세 가지입니다. 전문가를 잘게 쪼갰고, 늘 켜 두는 공유 전문가를 뒀고, 보조 손실 없이 부하를 맞췄습니다.",
    en: "<strong>The short version.</strong> MoE splits one FFN into many <strong>experts</strong> and switches on only a few per token. Store a lot of knowledge, compute a little. The idea goes back to a 1991 paper, and DeepSeek didn't invent it. What DeepSeek changed: much finer experts, a shared expert that's always on, and load balancing without an auxiliary loss.",
  },

  {
    type: "p",
    s: [
      { ko: "<a href=\"/blog/evolution-map/\">0편</a>에서 DeepSeek-V3는 671B인데 토큰 하나엔 37B만 쓴다고 계산했습니다.", en: "In <a href=\"/blog/evolution-map/\">Part 0</a> we computed that DeepSeek-V3 is 671B but uses only 37B per token." },
      { ko: "이번 편은 그게 어떻게 가능한지, 그리고 어디서 왔는지 봅니다.", en: "This part looks at how that works, and where the idea came from." },
    ],
  },

  {
    type: "callout",
    tone: "tip",
    ko: "토큰이 전문가를 고를 때 생기는 쏠림과, 그걸 고르게 맞추는 과정을 직접 돌려 볼 수 있습니다. <a href=\"/playground/moe/\">MoE 라우터 →</a>",
    en: "You can run the pile-up that happens when tokens pick experts, and the process that evens it out. <a href=\"/playground/moe/\">MoE router →</a>",
  },

  { type: "hr" },

  { type: "h2", ko: "1. 왜 FFN을 쪼개나", en: "1. Why split the FFN" },
  {
    type: "p",
    s: [
      { ko: "<a href=\"/blog/transformer-block/\">트랜스포머 블록</a>의 파라미터는 대부분 FFN에 있습니다.", en: "Most of a <a href=\"/blog/transformer-block/\">transformer block</a>'s parameters sit in the FFN." },
      { ko: "모델을 키우면 FFN이 커지고, 토큰마다 그 전부를 계산합니다.", en: "Make the model bigger and the FFN grows — and every token runs through all of it." },
      { ko: "MoE는 FFN을 여러 개로 나누고, 라우터가 토큰마다 몇 개만 고르게 합니다.", en: "MoE splits the FFN into several, and a router picks only a few for each token." },
    ],
  },
  {
    type: "code",
    code: "$ params --from config.json            # total     active per token\n  Llama 3.1 8B    dense                 8.0B       8.0B\n  Mixtral 8x7B    8 experts, top-2      46.7B      12.9B\n  Qwen3-30B-A3B   128 experts, top-8    30.5B      3.35B\n  DeepSeek-V3     256+1 experts, top-8  671B       37.6B",
  },
  {
    type: "p",
    s: [
      { ko: "Mistral은 Mixtral이 계산량이 훨씬 큰 Llama 2 70B를 대부분의 벤치마크에서 앞섰다고 발표했습니다.", en: "Mistral reported that Mixtral beat Llama 2 70B — a model that computes far more per token — on most benchmarks." },
      { ko: "토큰마다 켜는 양은 13B 정도인데, 담고 있는 지식은 47B 규모입니다.", en: "It switches on about 13B per token while holding 47B worth of knowledge." },
    ],
  },

  { type: "h2", ko: "2. 계보 — 딥시크가 처음은 아니다", en: "2. Lineage — DeepSeek wasn't first" },
  {
    type: "list",
    items: [
      { ko: "<strong>1991</strong> Jacobs·Jordan·Nowlan·Hinton, \"Adaptive Mixtures of Local Experts\". 여러 작은 네트워크와 그중 누구에게 맡길지 정하는 게이트. 이름과 발상이 여기서 나왔습니다.", en: "<strong>1991</strong> Jacobs, Jordan, Nowlan, Hinton, \"Adaptive Mixtures of Local Experts.\" Several small networks plus a gate that decides who handles what. The name and the idea start here." },
      { ko: "<strong>2017</strong> Shazeer 등. LSTM 층 사이에 전문가 수천 개를 넣고 상위 k개만 켜는 희소 게이트로 최대 1,370억 파라미터를 만들었습니다.", en: "<strong>2017</strong> Shazeer et al. Thousands of experts between LSTM layers with a sparse top-k gate, reaching up to 137 billion parameters." },
      { ko: "<strong>2020</strong> GShard. 트랜스포머의 FFN 자리에 MoE를 넣고 토큰마다 2개를 켰습니다. 6,000억 파라미터 번역 모델입니다.", en: "<strong>2020</strong> GShard. MoE in the transformer's FFN slot, two experts per token — a 600B-parameter translation model." },
      { ko: "<strong>2021</strong> Switch Transformer. 토큰마다 1개만 켜서 단순하게 만들고 1.6조 파라미터까지 키웠습니다. 같은 계산으로 T5-Base보다 사전학습이 최대 7배 빨랐습니다.", en: "<strong>2021</strong> Switch Transformer. One expert per token for simplicity, scaled to 1.6 trillion parameters, and up to 7× faster pre-training than T5-Base at the same compute." },
      { ko: "<strong>2023</strong> Mixtral 8x7B(12월 공개). 성능 좋은 공개 MoE가 나오면서 널리 쓰이기 시작했습니다.", en: "<strong>2023</strong> Mixtral 8x7B (released in December). A strong open MoE that made the design mainstream." },
      { ko: "<strong>2024</strong> DeepSeekMoE → V2 → V3. 잘게 쪼갠 전문가, 공유 전문가, 보조 손실 없는 균형.", en: "<strong>2024</strong> DeepSeekMoE → V2 → V3. Fine-grained experts, a shared expert, balancing without an auxiliary loss." },
      { ko: "<strong>2025</strong> Qwen3·Llama 4도 MoE 모델을 냈습니다. Llama 4 Maverick은 전문가 128개 + 공유 1개입니다.", en: "<strong>2025</strong> Qwen3 and Llama 4 shipped MoE models too. Llama 4 Maverick has 128 experts plus one shared." },
    ],
  },

  { type: "h2", ko: "3. 라우터는 무엇을 보고 고르나", en: "3. What the router looks at" },
  {
    type: "p",
    s: [
      { ko: "라우터는 작은 행렬 하나입니다.", en: "The router is a single small matrix." },
      { ko: "토큰 벡터와 전문가마다의 벡터를 내적해 점수를 내고, 점수 상위 k개를 켭니다.", en: "It takes the dot product of the token vector with each expert's vector, scores them, and switches on the top k." },
      { ko: "켜진 전문가의 출력은 점수로 가중 평균해 더합니다.", en: "The chosen experts' outputs are summed, weighted by their scores." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "이름과 달리 전문가가 수학·코드처럼 주제별로 나뉘지는 않습니다.", en: "Despite the name, experts don't split neatly by topic like math or code." },
      { ko: "Mixtral 논문은 주제에 따른 뚜렷한 배정 패턴을 찾지 못했고, 라우팅이 분야보다 문법 쪽과 더 맞는다고 보고했습니다.", en: "The Mixtral paper found no obvious topic-based assignment, and reported that routing aligns more with syntax than with domain." },
    ],
  },

  { type: "h2", ko: "4. 쏠림 — 인기 전문가 몇 개만 일한다", en: "4. Pile-up — a few popular experts do all the work" },
  {
    type: "p",
    s: [
      { ko: "라우터를 그냥 두면 점수 높은 전문가 몇 개로 토큰이 몰립니다.", en: "Left alone, the router sends tokens to a few high-scoring experts." },
      { ko: "몰린 전문가는 더 많이 학습해 더 잘하게 되고, 그래서 더 몰립니다.", en: "The busy experts get more training, get better, and attract even more tokens." },
      { ko: "나머지는 놀고, 전문가들이 여러 GPU에 나뉘어 있으면 한 GPU만 바빠집니다.", en: "The rest sit idle — and when experts are spread over GPUs, one GPU does all the work." },
    ],
  },
  {
    type: "code",
    code: "$ moe-router --tokens 1024 --experts 16 --top-k 2 --skew 1.5   # simulation\n  even share per expert     128 tokens\n  busiest expert            469 tokens   # 3.66×\n  idle experts              2 of 16",
  },
  {
    type: "p",
    s: [
      { ko: "Switch Transformer는 <strong>보조 손실</strong>로 막았습니다.", en: "Switch Transformer fought this with an <strong>auxiliary loss</strong>." },
      { ko: "부하가 고르지 않으면 벌점을 손실에 더하는 방식입니다.", en: "It adds a penalty to the loss whenever load is uneven." },
      { ko: "문제는 이 벌점이 원래 목표인 다음 토큰 맞히기와 싸운다는 점입니다. 너무 세면 성능이 떨어집니다.", en: "The catch: that penalty competes with the real goal, predicting the next token. Make it too strong and quality drops." },
    ],
  },

  { type: "h2", ko: "5. 딥시크가 바꾼 세 가지", en: "5. Three things DeepSeek changed" },
  {
    type: "p",
    s: [
      { ko: "<strong>첫째, 잘게 쪼개기.</strong> 큰 전문가 몇 개 대신 작은 전문가를 많이 둡니다.", en: "<strong>First, go fine-grained.</strong> Many small experts instead of a few big ones." },
      { ko: "전문가 16개 중 2개를 고르는 조합은 120가지입니다.", en: "Choosing 2 of 16 experts gives 120 combinations." },
      { ko: "같은 양을 64개로 쪼개 8개를 고르면 약 44억 가지가 됩니다. 계산량은 같은데 조합이 훨씬 다양해집니다.", en: "Split the same capacity into 64 and choose 8, and it's about 4.4 billion. Same compute, far more combinations." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "<strong>둘째, 공유 전문가.</strong> 어떤 토큰이든 늘 켜지는 전문가를 따로 둡니다.", en: "<strong>Second, a shared expert.</strong> One expert that's on for every token." },
      { ko: "모든 토큰에 필요한 공통 지식을 거기 모으면, 나머지 전문가가 같은 걸 중복해서 배울 필요가 줄어듭니다.", en: "Common knowledge every token needs goes there, so the other experts don't each have to relearn it." },
      { ko: "DeepSeek-V3는 층마다 전문가 256개 중 8개 + 공유 1개를 켭니다.", en: "DeepSeek-V3 switches on 8 of 256 experts plus 1 shared expert in each layer." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "<strong>셋째, 보조 손실 없이 균형 맞추기.</strong> 전문가마다 편향 값을 하나 둡니다.", en: "<strong>Third, balance without an auxiliary loss.</strong> Each expert gets one bias value." },
      { ko: "이 편향은 전문가를 <em>고를 때만</em> 점수에 더하고, 출력에 곱하는 가중치에는 넣지 않습니다.", en: "The bias is added to the score <em>only when picking</em> experts, never to the weights that scale their output." },
      { ko: "매 단계 붐빈 전문가는 편향을 조금 내리고, 한가한 전문가는 조금 올립니다.", en: "At each step, busy experts get their bias nudged down and idle ones nudged up." },
      { ko: "손실을 건드리지 않으니 다음 토큰 맞히기와 싸우지 않습니다.", en: "Since the loss isn't touched, it doesn't fight next-token prediction." },
    ],
  },
  {
    type: "code",
    code: "# bias_i ← bias_i + u · sign(mean_load − load_i)      (selection only)\n$ moe-router --balance --u 0.01 --steps 200\n  busiest expert ÷ even share    3.66× → 1.10×\n  idle experts                   2 → 0\n# DeepSeek-V3: u = 0.001 for the first 14.3T tokens, 0 for the last 500B",
  },
  {
    type: "p",
    s: [
      { ko: "V3는 이 방식을 쓰면서, 한 시퀀스 안에서 극단적으로 쏠리는 것만 막는 아주 작은 보조 손실(가중치 0.0001)을 남겼습니다.", en: "V3 uses this method and keeps only a tiny auxiliary loss (weight 0.0001) to stop extreme imbalance within a single sequence." },
      { ko: "점수도 소프트맥스 대신 시그모이드로 매기고, 고른 전문가끼리만 정규화합니다.", en: "It also scores with a sigmoid instead of softmax, normalizing only over the experts it picks." },
    ],
  },

  {
    type: "callout",
    tone: "warn",
    ko: "MoE가 줄이는 건 <strong>계산</strong>이지 메모리가 아닙니다. 어떤 토큰이 어떤 전문가를 부를지 모르니 전문가 전부가 메모리에 올라가 있어야 합니다. DeepSeek-V3의 bf16 가중치는 약 1.34TB입니다. 토큰당 계산은 37B 모델 수준이어도, 서빙에는 GPU 여러 장이 필요합니다.",
    en: "MoE saves <strong>compute</strong>, not memory. You can't know which expert a token will call, so every expert must be in memory. DeepSeek-V3's bf16 weights are about 1.34 TB. Per-token compute is like a 37B model, but serving still takes many GPUs.",
  },

  { type: "h2", ko: "6. 비공개 모델은?", en: "6. What about closed models?" },
  {
    type: "p",
    s: [
      { ko: "GPT-4가 MoE라는 이야기는 유출과 보도에서 나왔습니다.", en: "The claim that GPT-4 is an MoE came from leaks and reports." },
      { ko: "OpenAI의 GPT-4 기술 보고서는 모델 크기를 포함한 구조를 밝히지 않았고, 공식 확인도 없습니다.", en: "OpenAI's GPT-4 technical report disclosed no architecture details, model size included, and there's no official confirmation." },
      { ko: "그래서 이 글은 설정 파일이 공개된 모델로만 설명했습니다.", en: "So this post sticks to models whose configs are public." },
    ],
  },

  { type: "h2", ko: "정리", en: "Recap" },
  {
    type: "list",
    items: [
      { ko: "<strong>MoE</strong> = FFN을 전문가로 쪼개고 토큰마다 k개만. 지식은 크게, 계산은 작게.", en: "<strong>MoE</strong> = split the FFN into experts, run only k per token. Big knowledge, small compute." },
      { ko: "<strong>계보</strong>: 1991 → 2017 희소 게이트 → GShard·Switch → Mixtral → DeepSeek.", en: "<strong>Lineage</strong>: 1991 → 2017 sparse gating → GShard, Switch → Mixtral → DeepSeek." },
      { ko: "<strong>쏠림</strong>이 핵심 문제. 보조 손실은 효과가 있지만 성능과 싸운다.", en: "<strong>Pile-up</strong> is the core problem. An auxiliary loss works but fights quality." },
      { ko: "<strong>딥시크</strong>: 잘게 쪼갠 전문가 + 공유 전문가 + 고를 때만 쓰는 편향으로 균형.", en: "<strong>DeepSeek</strong>: fine-grained experts + a shared expert + a selection-only bias for balance." },
      { ko: "<strong>대가</strong>: 메모리는 전체 크기만큼 필요.", en: "<strong>The cost</strong>: memory still scales with the full size." },
    ],
  },

  { type: "hr" },
  {
    type: "sources",
    html: "<h3>출처 · Sources</h3><ul><li>Jacobs, Jordan, Nowlan, Hinton, <a href=\"https://doi.org/10.1162/neco.1991.3.1.79\">Adaptive Mixtures of Local Experts</a>, Neural Computation 3(1), 1991</li><li>Shazeer et al., <a href=\"https://arxiv.org/abs/1701.06538\">Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer</a> (2017) — up to 137B</li><li>Lepikhin et al., <a href=\"https://arxiv.org/abs/2006.16668\">GShard</a> (2020) — 600B, top-2</li><li>Fedus, Zoph, Shazeer, <a href=\"https://arxiv.org/abs/2101.03961\">Switch Transformers</a> (2021) — top-1, 1.6T, up to 7× vs T5-Base</li><li>Mistral AI, <a href=\"https://mistral.ai/news/mixtral-of-experts\">Mixtral of experts</a> (2023-12-11) · Jiang et al., <a href=\"https://arxiv.org/abs/2401.04088\">Mixtral of Experts</a> (2024) — routing analysis</li><li>Dai et al., <a href=\"https://arxiv.org/abs/2401.06066\">DeepSeekMoE</a> (2024) — fine-grained + shared experts</li><li>Wang et al., <a href=\"https://arxiv.org/abs/2408.15664\">Auxiliary-Loss-Free Load Balancing Strategy for Mixture-of-Experts</a> (2024)</li><li>DeepSeek-AI, <a href=\"https://arxiv.org/abs/2412.19437\">DeepSeek-V3 Technical Report</a> (2024) — sigmoid routing, bias γ 0.001→0, sequence-wise loss 0.0001</li><li>Meta, <a href=\"https://ai.meta.com/blog/llama-4-multimodal-intelligence/\">The Llama 4 herd</a> (2025-04-05)</li><li>OpenAI, <a href=\"https://arxiv.org/abs/2303.08774\">GPT-4 Technical Report</a> (2023) — no architecture details</li><li>계산 코드: <a href=\"/lab/arch.js\">/lab/arch.js</a> · <a href=\"/lab/moe.js\">/lab/moe.js</a></li></ul>",
  },
];
