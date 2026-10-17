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
    ko: "토큰이 전문가를 고를 때 생기는 쏠림과, 그걸 고르게 맞추는 과정을 직접 돌려 볼 수 있습니다. <a href=\"/playground/moe/\">MoE 라우터 →</a> · 오락실: <a href=\"/arcade/dispatch/\">전문가 배차 →</a>",
    en: "You can run the pile-up that happens when tokens pick experts, and the process that evens it out. <a href=\"/playground/moe/\">MoE router →</a> · Arcade: <a href=\"/arcade/dispatch/\">Expert dispatch →</a>",
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

  { type: "h2", ko: "2. 계보 — 누가 제안했고 어떻게 커졌나", en: "2. Lineage — who proposed it and how it grew" },
  {
    type: "code",
    code: "$ moe --history\n  1991  Jacobs·Jordan·Nowlan·Hinton   gate + competing experts        small nets\n  1994  Jordan·Jacobs                 hierarchical experts, EM        small nets\n  2013  Eigen·Ranzato·Sutskever       MoE as a deep-net layer         stacked\n  2017  Shazeer et al. (Google)       sparse top-k, thousands         137B  LSTM\n  2020  GShard (Google)               top-2 in transformer FFN        600B\n  2021  Switch (Google)               top-1, simpler                  1.6T\n  2021  GLaM (Google)                 64 experts, top-2               1.2T\n  2023  Mixtral 8x7B (Mistral)        open weights, top-2 of 8        47B\n  2024  DeepSeekMoE / V2 / V3         fine-grained + shared experts   671B\n  2025  Qwen3, Llama 4, Kimi K2, gpt-oss   MoE becomes the default     up to 1T",
  },

  { type: "h2", ko: "2-1. 1991년의 제안 — 서로 덮어쓰지 않게", en: "2-1. The 1991 proposal — stop overwriting each other" },
  {
    type: "p",
    s: [
      { ko: "제안한 사람은 Robert Jacobs, Michael Jordan, Steven Nowlan, Geoffrey Hinton입니다.", en: "It was proposed by Robert Jacobs, Michael Jordan, Steven Nowlan, and Geoffrey Hinton." },
      { ko: "문제의식은 간섭이었습니다. 신경망 하나가 여러 종류의 일을 배우면, 한쪽을 배우며 다른 쪽에서 배운 걸 덮어씁니다.", en: "The problem was interference. When one network learns several kinds of task, learning one overwrites what it learned for another." },
      { ko: "그래서 작은 네트워크(전문가) 여러 개와, 입력마다 누구에게 맡길지 정하는 <strong>게이트 네트워크</strong>를 같이 학습시켰습니다.", en: "So they trained several small networks (experts) together with a <strong>gating network</strong> that decides who handles each input." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "전문가끼리는 경쟁합니다. 어떤 입력을 잘 맞힌 전문가가 그 입력에 대해 더 많이 배우고, 게이트도 그쪽으로 기웁니다.", en: "The experts compete. Whichever expert does best on an input learns more from it, and the gate leans its way." },
      { ko: "그러면 전문가들이 저절로 입력 공간을 나눠 맡습니다. 논문은 모음 구별 과제로 이걸 보였습니다.", en: "The experts end up splitting the input space between them on their own. The paper showed this on a vowel-discrimination task." },
      { ko: "1994년 Jordan과 Jacobs는 게이트를 나무처럼 여러 단으로 쌓은 계층형 버전을 EM 알고리즘으로 학습시켰습니다.", en: "In 1994 Jordan and Jacobs stacked gates into a tree — a hierarchical version trained with the EM algorithm." },
    ],
  },

  { type: "h2", ko: "2-2. 딥러닝 안으로 — 계산을 아끼는 도구가 되다", en: "2-2. Into deep learning — becoming a way to save compute" },
  {
    type: "p",
    s: [
      { ko: "1991년판은 모든 전문가를 다 계산하고 결과를 섞었습니다. 목적은 정확도였지 계산 절약이 아니었습니다.", en: "The 1991 version computed every expert and blended the results. The aim was accuracy, not saving compute." },
      { ko: "2013년 Eigen, Ranzato, Sutskever는 MoE를 심층망의 한 층으로 넣어 여러 단 쌓았습니다.", en: "In 2013 Eigen, Ranzato, and Sutskever made MoE a layer inside a deep network and stacked several." },
      { ko: "전환점은 2017년 Google의 Shazeer 등입니다. 상위 k개 전문가만 계산하는 <strong>희소 게이트</strong>로, 전문가가 수천 개여도 토큰마다 계산은 조금만 하게 만들었습니다.", en: "The turning point was Shazeer et al. at Google in 2017. A <strong>sparse gate</strong> that computes only the top k experts kept per-token compute small even with thousands of experts." },
      { ko: "이때부터 MoE는 \"모델을 키우되 계산은 그대로 두는\" 도구가 됐습니다. 쏠림을 막는 보조 손실이 이후 표준이 된 형태도 이 논문에서 나왔습니다.", en: "From then on MoE was a tool for \"grow the model, keep compute flat.\" The auxiliary loss against pile-up, in the form that later became standard, comes from this paper too." },
    ],
  },

  { type: "h2", ko: "2-3. 트랜스포머로 — Google이 키우다", en: "2-3. Into transformers — Google scales it up" },
  {
    type: "list",
    items: [
      { ko: "<strong>GShard (2020)</strong>: 트랜스포머의 FFN 자리를 MoE로 바꾸고 토큰마다 2개를 켰습니다. 전문가마다 받을 수 있는 토큰 수(용량)를 정해 넘치면 버렸습니다. 6,000억 파라미터 번역 모델.", en: "<strong>GShard (2020)</strong>: swapped the transformer's FFN for MoE, two experts per token. Each expert got a token capacity; overflow was dropped. A 600B-parameter translation model." },
      { ko: "<strong>Switch Transformer (2021)</strong>: 토큰마다 1개만 켜서 단순하게. 1.6조 파라미터까지 키웠고, 같은 계산으로 T5-Base보다 사전학습이 최대 7배 빨랐습니다.", en: "<strong>Switch Transformer (2021)</strong>: one expert per token, for simplicity. Scaled to 1.6 trillion parameters, with up to 7× faster pre-training than T5-Base at the same compute." },
      { ko: "<strong>GLaM (2021)</strong>: 전문가 64개 중 2개. 1.2조 파라미터로 GPT-3보다 학습 에너지를 약 1/3만 썼습니다.", en: "<strong>GLaM (2021)</strong>: 2 of 64 experts. At 1.2 trillion parameters it used about a third of GPT-3's training energy." },
    ],
  },

  { type: "h2", ko: "2-4. 공개 모델로 — 지금의 기본값", en: "2-4. Into open models — today's default" },
  {
    type: "p",
    s: [
      { ko: "2023년 12월 Mistral의 Mixtral 8x7B가 가중치를 공개하면서 MoE가 연구실 밖으로 나왔습니다.", en: "In December 2023, Mistral's Mixtral 8x7B released its weights, and MoE left the lab." },
      { ko: "2024년 DeepSeek은 전문가를 잘게 쪼개고 공유 전문가를 두는 설계(DeepSeekMoE)를 V2, V3로 키웠습니다.", en: "In 2024 DeepSeek grew its design — fine-grained experts plus a shared expert (DeepSeekMoE) — through V2 and V3." },
      { ko: "2025년에는 Qwen3, Llama 4, Kimi K2, OpenAI의 공개 모델 gpt-oss까지 대형 공개 모델 대부분이 MoE로 나왔습니다.", en: "By 2025 most large open models — Qwen3, Llama 4, Kimi K2, and even OpenAI's open-weight gpt-oss — shipped as MoE." },
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

  { type: "h2", ko: "6. 지금은 어떻게 쓰나 — 공개 모델 설정 비교", en: "6. How it's used now — comparing open-model configs" },
  {
    type: "code",
    code: "$ moe --from config.json                 # experts per MoE layer\n  model              released   total / active   routed   shared   top-k   score\n  Mixtral 8x7B       2023-12    47B / 13B        8        —        2       softmax\n  DeepSeek-V3        2024-12    671B / 37B       256      1        8       sigmoid, bias balancing\n  Qwen3-235B-A22B    2025-04    235B / 22B       128      —        8       softmax\n  Llama 4 Maverick   2025-04    400B / 17B       128      1        1       every 2nd layer\n  Kimi K2            2025-07    1T / 32B         384      1        8       sigmoid, bias balancing\n  gpt-oss-120b       2025-08    117B / 5.1B      128      —        4       softmax",
  },
  {
    type: "list",
    items: [
      { ko: "<strong>더 많이, 더 작게.</strong> 2023년 8개에서 2025년 128~384개로 늘었습니다. 딥시크의 잘게 쪼개기가 대세가 됐습니다.", en: "<strong>More, and smaller.</strong> From 8 experts in 2023 to 128–384 in 2025. DeepSeek's fine-grained split became the norm." },
      { ko: "<strong>공유 전문가는 갈립니다.</strong> DeepSeek·Kimi K2·Llama 4는 두고, Qwen3와 gpt-oss는 뺐습니다. Qwen3는 이전 세대(Qwen2.5-MoE)에 있던 공유 전문가를 뺐습니다.", en: "<strong>Shared experts split the field.</strong> DeepSeek, Kimi K2, and Llama 4 keep one; Qwen3 and gpt-oss don't. Qwen3 dropped the shared experts its predecessor (Qwen2.5-MoE) had." },
      { ko: "<strong>딥시크 방식을 그대로 쓰는 곳도 있습니다.</strong> Kimi K2는 V3와 같은 층 수·폭에 시그모이드 점수와 편향 균형을 쓰면서, 전문가를 384개로 늘리고 어텐션 헤드는 64개로 줄였습니다.", en: "<strong>Some reuse DeepSeek's recipe outright.</strong> Kimi K2 keeps V3's depth and width, sigmoid scoring, and bias balancing — while raising the experts to 384 and cutting attention heads to 64." },
      { ko: "<strong>모든 층이 MoE는 아닙니다.</strong> DeepSeek-V3는 앞 3층이 일반 FFN이고, Llama 4 Maverick은 한 층 걸러 MoE입니다.", en: "<strong>Not every layer is MoE.</strong> DeepSeek-V3's first 3 layers use a plain FFN; Llama 4 Maverick alternates MoE with dense layers." },
    ],
  },

  { type: "h2", ko: "7. 비공개 모델은?", en: "7. What about closed models?" },
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
      { ko: "<strong>계보</strong>: 1991 간섭을 막으려는 제안 → 2017 계산을 아끼는 희소 게이트 → GShard·Switch·GLaM → Mixtral → DeepSeek → 2025 대형 공개 모델의 기본값.", en: "<strong>Lineage</strong>: 1991, a fix for interference → 2017, a sparse gate to save compute → GShard, Switch, GLaM → Mixtral → DeepSeek → by 2025, the default for big open models." },
      { ko: "<strong>쏠림</strong>이 핵심 문제. 보조 손실은 효과가 있지만 성능과 싸운다.", en: "<strong>Pile-up</strong> is the core problem. An auxiliary loss works but fights quality." },
      { ko: "<strong>딥시크</strong>: 잘게 쪼갠 전문가 + 공유 전문가 + 고를 때만 쓰는 편향으로 균형.", en: "<strong>DeepSeek</strong>: fine-grained experts + a shared expert + a selection-only bias for balance." },
      { ko: "<strong>대가</strong>: 메모리는 전체 크기만큼 필요.", en: "<strong>The cost</strong>: memory still scales with the full size." },
    ],
  },

  { type: "hr" },
  {
    type: "sources",
    html: "<h3>출처 · Sources</h3><ul><li>Jacobs, Jordan, Nowlan, Hinton, <a href=\"https://doi.org/10.1162/neco.1991.3.1.79\">Adaptive Mixtures of Local Experts</a>, Neural Computation 3(1), 1991</li><li>Jordan, Jacobs, <a href=\"https://doi.org/10.1162/neco.1994.6.2.181\">Hierarchical Mixtures of Experts and the EM Algorithm</a>, Neural Computation 6(2), 1994</li><li>Eigen, Ranzato, Sutskever, <a href=\"https://arxiv.org/abs/1312.4314\">Learning Factored Representations in a Deep Mixture of Experts</a> (2013)</li><li>Shazeer et al., <a href=\"https://arxiv.org/abs/1701.06538\">Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer</a> (2017) — up to 137B</li><li>Lepikhin et al., <a href=\"https://arxiv.org/abs/2006.16668\">GShard</a> (2020) — 600B, top-2</li><li>Fedus, Zoph, Shazeer, <a href=\"https://arxiv.org/abs/2101.03961\">Switch Transformers</a> (2021) — top-1, 1.6T, up to 7× vs T5-Base</li><li>Du et al., <a href=\"https://arxiv.org/abs/2112.06905\">GLaM</a> (2021) — 1.2T, 64 experts, ~1/3 of GPT-3's training energy</li><li>Mistral AI, <a href=\"https://mistral.ai/news/mixtral-of-experts\">Mixtral of experts</a> (2023-12-11) · Jiang et al., <a href=\"https://arxiv.org/abs/2401.04088\">Mixtral of Experts</a> (2024) — routing analysis</li><li>Dai et al., <a href=\"https://arxiv.org/abs/2401.06066\">DeepSeekMoE</a> (2024) — fine-grained + shared experts</li><li>Wang et al., <a href=\"https://arxiv.org/abs/2408.15664\">Auxiliary-Loss-Free Load Balancing Strategy for Mixture-of-Experts</a> (2024)</li><li>DeepSeek-AI, <a href=\"https://arxiv.org/abs/2412.19437\">DeepSeek-V3 Technical Report</a> (2024) — sigmoid routing, bias γ 0.001→0, sequence-wise loss 0.0001</li><li>Meta, <a href=\"https://ai.meta.com/blog/llama-4-multimodal-intelligence/\">The Llama 4 herd</a> (2025-04-05)</li><li>Qwen Team, <a href=\"https://arxiv.org/abs/2505.09388\">Qwen3 Technical Report</a> (2025) — no shared experts</li><li>Kimi Team, <a href=\"https://arxiv.org/abs/2507.20534\">Kimi K2</a> (2025)</li><li>OpenAI, <a href=\"https://openai.com/index/introducing-gpt-oss/\">Introducing gpt-oss</a> (2025-08-05) · <a href=\"https://arxiv.org/abs/2508.10925\">gpt-oss model card</a> — 116.8B / 5.1B, top-4 of 128</li><li>config.json: <a href=\"https://huggingface.co/mistralai/Mixtral-8x7B-v0.1/blob/main/config.json\">Mixtral</a> · <a href=\"https://huggingface.co/deepseek-ai/DeepSeek-V3/blob/main/config.json\">DeepSeek-V3</a> · <a href=\"https://huggingface.co/Qwen/Qwen3-235B-A22B/blob/main/config.json\">Qwen3-235B-A22B</a> · <a href=\"https://huggingface.co/unsloth/Llama-4-Maverick-17B-128E-Instruct/blob/main/config.json\">Llama 4 Maverick</a> · <a href=\"https://huggingface.co/moonshotai/Kimi-K2-Instruct/blob/main/config.json\">Kimi K2</a> · <a href=\"https://huggingface.co/openai/gpt-oss-120b/blob/main/config.json\">gpt-oss-120b</a> · <a href=\"https://huggingface.co/Qwen/Qwen1.5-MoE-A2.7B/blob/main/config.json\">Qwen1.5-MoE</a> · <a href=\"https://huggingface.co/Qwen/Qwen2-57B-A14B/blob/main/config.json\">Qwen2-57B-A14B</a> (shared experts in earlier Qwen MoE)</li><li>OpenAI, <a href=\"https://arxiv.org/abs/2303.08774\">GPT-4 Technical Report</a> (2023) — no architecture details</li><li>계산 코드: <a href=\"/lab/arch.js\">/lab/arch.js</a> · <a href=\"/lab/moe.js\">/lab/moe.js</a></li></ul>",
  },
];
