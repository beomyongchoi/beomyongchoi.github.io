import type { BiBlock } from "./aiParadox";

export const blocks: BiBlock[] = [
  {
    type: "callout",
    tone: "tldr",
    ko: "<strong>결론부터.</strong> 2편의 트랜스포머 블록을 디코더로만 N층 쌓으면 GPT입니다(Radford et al. 2019). 3편 BERT와 부품은 똑같습니다. 딱 하나, 어텐션 점수 행렬에 상삼각 −∞ 마스크를 씌워 각 토큰이 자신과 이전 토큰만 보게 합니다. 이 causal 마스크가 양방향 이해기를 왼→오 생성기로 바꿉니다.",
    en: "<strong>The short version.</strong> Stack the transformer block from part 2 as a decoder-only stack of N layers and you get GPT (Radford et al. 2019). The parts are the same as BERT in part 3. Just one change: an upper-triangular −∞ mask on the attention-score matrix, so each token sees only itself and the tokens before it. That causal mask turns a bidirectional understander into a left-to-right generator.",
  },

  {
    type: "p",
    s: [
      { ko: "3편에서 같은 블록을 인코더로 쌓아 양방향으로 읽는 BERT를 봤습니다.", en: "In part 3 we stacked the same block as an encoder and got BERT, which reads bidirectionally." },
      { ko: "이번엔 오른쪽(미래)을 가립니다.", en: "This time we hide the right side — the future." },
      { ko: "각 토큰이 미래를 못 보게 막으면, 모델은 <strong>왼쪽 문맥만으로 다음 토큰을 뽑는</strong> 기계가 됩니다.", en: "Block every token from seeing the future, and the model becomes a machine that <strong>predicts the next token from the left context alone.</strong>" },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "이게 GPT입니다.", en: "That's GPT." },
      { ko: "원조 트랜스포머 디코더에서 <strong>인코더-디코더 교차어텐션은 빼고</strong>, 마스크드 셀프어텐션과 FFN 스택만 남긴 구조입니다.", en: "It's the original transformer decoder <strong>with the encoder-decoder cross-attention removed</strong> — just the masked self-attention and FFN stack." },
    ],
  },

  { type: "hr" },

  { type: "h2", ko: "1. 목표는 다음 토큰 예측 — 그래서 미래를 가린다", en: "1. The goal is next-token prediction — so we hide the future" },
  {
    type: "p",
    s: [
      { ko: "먼저 목표부터 잡습니다.", en: "Fix the goal first." },
      { ko: "GPT의 학습 과제는 오직 하나, <strong>다음 토큰 예측</strong>입니다.", en: "GPT's training task is exactly one thing: <strong>next-token prediction.</strong>" },
      { ko: "토큰 ≤t로 t+1을 맞히는 언어모델링입니다.", en: "Given tokens up to t, predict token t+1. That's language modeling." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "이 목표가 마스크를 강제합니다.", en: "This goal is what forces the mask." },
      { ko: "미래를 안 가리면, t+1을 예측할 때 입력에 이미 t+1이 보입니다.", en: "Without hiding the future, the input already contains t+1 when we try to predict t+1." },
      { ko: "정답이 입력으로 새어 들어오면 <strong>커닝</strong>이고, 학습이 무의미해집니다.", en: "The answer leaks into the input — that's <strong>cheating</strong>, and it makes training meaningless." },
      { ko: "그래서 미래를 가립니다.", en: "So we hide the future." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "학습 목표는 자기지도입니다.", en: "The objective is self-supervised." },
      { ko: "'다음 토큰'이 곧 정답이라, 원시 텍스트만 있으면 되고 라벨을 따로 달 필요가 없습니다.", en: "The \"next token\" is its own label, so raw text is enough — no separate annotation." },
    ],
  },

  { type: "h2", ko: "2. causal 마스크 — 미래를 softmax 전에 −∞로 가린다", en: "2. The causal mask — set the future to −∞ before softmax" },
  {
    type: "p",
    s: [
      { ko: "핵심은 마스크를 씌우는 자리입니다.", en: "The key is where the mask goes." },
      { ko: "어텐션 점수 행렬의 미래 위치(상삼각)를 <strong>softmax 직전에</strong> −∞로 채웁니다.", en: "Fill the future positions of the attention-score matrix — the upper triangle — with −∞ <strong>right before softmax.</strong>" },
      { ko: "softmax는 −∞를 0으로 보내므로, 미래 토큰의 가중치가 정확히 0이 됩니다.", en: "softmax sends −∞ to 0, so the weight on future tokens becomes exactly zero." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "타이밍이 포인트입니다.", en: "The timing is the point." },
      { ko: "나중에 0을 곱하는 방식이 아닙니다.", en: "It's not multiplying by zero afterward." },
      { ko: "softmax 전에 −∞를 넣어야 미래가 애초에 확률 분포에서 빠집니다.", en: "You put −∞ in before softmax so the future drops out of the probability distribution in the first place." },
    ],
  },
  {
    type: "code",
    code: "어텐션 점수 (행 = 쿼리 토큰, 열 = 키 토큰), causal 마스크 적용 후\n\n        the  cat  sat  on\n the  [  ·   -∞  -∞  -∞ ]   the: 자기만\n cat  [  ·   ·   -∞  -∞ ]   cat: the·cat까지\n sat  [  ·   ·   ·   -∞ ]   sat: 왼쪽 3개까지\n on   [  ·   ·   ·   ·  ]   on: 전부\n\n · = 살아남는 점수     -∞ = softmax 후 0 (가려짐)\n 상삼각(대각선 위) = -∞  →  어떤 토큰도 자기 오른쪽을 못 본다",
  },
  {
    type: "p",
    s: [
      { ko: "한 가지 역할 분리를 짚어둡니다.", en: "One division of labor is worth noting." },
      { ko: "토큰 사이의 <strong>순서 정보</strong>는 위치 인코딩이 넣어줍니다.", en: "The <strong>order</strong> between tokens comes from positional encoding." },
      { ko: "마스크는 순서를 만드는 게 아니라 미래를 차단할 뿐입니다.", en: "The mask doesn't create order — it only blocks the future." },
    ],
  },

  { type: "h2", ko: "3. 학습은 병렬, 생성은 순차 — 정답이 있느냐가 가른다", en: "3. Training is parallel, generation is sequential — whether the answer exists decides it" },
  {
    type: "p",
    s: [
      { ko: "여기가 이 글에서 가장 헷갈리는 지점입니다.", en: "This is the most confusing point in the whole piece." },
      { ko: "학습 때와 생성 때가 다르게 도는데, 그 원인은 <strong>정답이 손에 있느냐</strong>입니다.", en: "Training and generation run differently, and the cause is <strong>whether the answer is already in hand.</strong>" },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "학습 때는 정답 문장이 통째로 있습니다.", en: "During training, the whole answer sentence is already there." },
      { ko: "모든 위치의 '이전 토큰'을 이미 알기에, 한 문장의 <strong>모든 위치를 한 번에(병렬)</strong> 예측할 수 있습니다.", en: "Since we already know every position's \"previous tokens,\" we can predict <strong>all positions at once, in parallel.</strong>" },
      { ko: "이때 각 위치에는 모델의 예측이 아니라 정답 이전 토큰을 넣어줍니다.", en: "At each position we feed the ground-truth previous tokens, not the model's own predictions." },
      { ko: "정답 토큰을 입력으로 강제하는 이 방식을 <strong>teacher forcing</strong>이라고 합니다.", en: "Forcing the ground-truth tokens as input is called <strong>teacher forcing.</strong>" },
      { ko: "병렬은 그 위에서 causal 마스크가 주는 이득입니다.", en: "The parallelism on top of that is a bonus the causal mask provides." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "마스크가 왜 병렬을 가능케 할까요.", en: "Why does the mask enable parallelism?" },
      { ko: "각 위치가 미래를 못 보므로, 한 위치의 예측이 다른 위치로 새지 않습니다.", en: "Each position can't see the future, so one position's prediction never leaks into another." },
      { ko: "그래서 전 위치를 동시에 계산해도 서로 커닝하지 않습니다.", en: "So we can compute all positions at once without any of them cheating off the others." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "생성(추론) 때는 정답이 없습니다.", en: "During generation (inference), there is no answer." },
      { ko: "오른쪽이 아직 존재하지 않으니, 한 토큰을 만들어야 다음 입력이 생깁니다.", en: "The right side doesn't exist yet, so you have to produce one token before the next input can exist." },
      { ko: "그래서 생성은 <strong>자기회귀</strong>입니다. 토큰 하나를 뽑아 입력 끝에 다시 붙이고, 반복합니다.", en: "So generation is <strong>autoregressive</strong>: sample one token, append it to the input, repeat." },
    ],
  },
  {
    type: "code",
    code: "자기회귀 루프 (생성)\n\n [the] [cat] [sat]           → 모델 → 다음 토큰 뽑기 → [on]\n [the] [cat] [sat] [on]      → 모델 → 다음 토큰 뽑기 → [the]\n [the] [cat] [sat] [on] [the]  →  …  왼→오로 계속",
  },
  {
    type: "p",
    s: [
      { ko: "왼→오로 만들어가므로, 뽑는 그 순간 <strong>오른쪽은 아직 없습니다</strong>.", en: "We build left to right, so at the moment of sampling <strong>the right side doesn't exist yet.</strong>" },
      { ko: "3편 BERT는 완성된 문장을 통째로 받아 오른쪽을 다 봤습니다.", en: "BERT in part 3 took a finished sentence whole and saw the entire right side." },
      { ko: "이 지점이 둘을 가릅니다.", en: "This is what separates the two." },
    ],
  },
  {
    type: "callout",
    tone: "tip",
    ko: "매 스텝 이전 전체를 다시 계산하면 시퀀스 길이에 제곱으로 비싸집니다. 그래서 <strong>KV 캐시</strong>를 씁니다. 과거 토큰의 Key·Value를 저장해두고, 새 토큰 하나 것만 계산해 이어 붙입니다. 매 스텝 전체 재계산을 피하는 방법입니다.",
    en: "Recomputing the entire past at every step costs quadratically in sequence length. So we use a <strong>KV cache</strong>: store the Keys and Values of past tokens, and compute only the new token's, then append. It's how you avoid recomputing everything each step.",
  },

  { type: "h2", ko: "4. 다음 토큰 고르기 — 샘플링", en: "4. Choosing the next token — sampling" },
  {
    type: "p",
    s: [
      { ko: "모델이 내놓는 raw 점수(logit)를 softmax로 확률 분포로 바꿉니다.", en: "The model's raw scores (logits) go through softmax to become a probability distribution." },
      { ko: "그 분포에서 실제로 하나를 뽑는 규칙이 <strong>샘플링</strong>입니다.", en: "The rule for actually picking one from that distribution is <strong>sampling.</strong>" },
    ],
  },
  {
    type: "list",
    items: [
      { ko: "<strong>greedy</strong>: 매번 확률 최대(argmax)만 뽑습니다. 안전하지만 단조롭습니다.", en: "<strong>greedy</strong>: always take the max-probability token (argmax). Safe but monotonous." },
      { ko: "<strong>temperature</strong>: logit을 T로 나눕니다. T<1이면 큰 logit이 더 커져 분포가 뾰족(보수적), T>1이면 평평(다양), T→0은 greedy입니다.", en: "<strong>temperature</strong>: divide logits by T. With T<1 the larger logits grow further and the distribution sharpens (conservative); T>1 flattens it (diverse); T→0 is greedy." },
      { ko: "<strong>top-k</strong>: 상위 k개만 남깁니다(개수 고정). 분포가 평평할 땐 좋은 후보를 자르고, 뾰족할 땐 쓰레기 후보까지 넣습니다.", en: "<strong>top-k</strong>: keep only the top k (fixed count). When the distribution is flat it cuts good candidates; when it's peaked it lets junk in." },
      { ko: "<strong>top-p(nucleus)</strong>: 누적확률 p까지의 최소 집합만 남깁니다. 그래서 분포 모양에 따라 후보 수가 적응합니다.", en: "<strong>top-p (nucleus)</strong>: keep the smallest set that reaches cumulative probability p. So the candidate count adapts to the shape of the distribution." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "top-p가 top-k를 대체하는 이유가 여기 있습니다.", en: "That's why top-p tends to replace top-k." },
      { ko: "top-k의 고정 개수가 만드는 실패 모드를 분포 모양에 맞춰 피합니다.", en: "It sidesteps top-k's fixed-count failure mode by tracking the distribution's shape." },
    ],
  },

  { type: "h2", ko: "5. 왜 현대 LLM은 대부분 디코더 온리인가", en: "5. Why are most modern LLMs decoder-only" },
  {
    type: "p",
    s: [
      { ko: "규모에서 새로운 능력이 창발했기 때문입니다.", en: "Because new abilities emerge at scale." },
      { ko: "<strong>GPT-3</strong>는 이 구조를 96층·96헤드·임베딩 12288차원으로 쌓아 175B 파라미터를 300B 토큰으로 학습했습니다(Brown et al. 2020).", en: "<strong>GPT-3</strong> stacks this into 96 layers, 96 heads, 12288-dim embeddings — 175B parameters trained on 300B tokens (Brown et al. 2020)." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "이 규모에서 <strong>in-context learning</strong>이 나타납니다.", en: "At this scale, <strong>in-context learning</strong> appears." },
      { ko: "가중치를 갱신하지 않고, 프롬프트에 예시 몇 개만 넣어도 새 과제를 수행합니다.", en: "Without updating any weights, a few examples in the prompt are enough to perform a new task." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "핵심은 <strong>생성이 일반 과제</strong>라는 점입니다.", en: "The key is that <strong>generation is a general task.</strong>" },
      { ko: "번역도 '영어: cat / 한국어:' 다음에 올 토큰을 예측하는 문제로 흡수됩니다.", en: "Translation, too, reduces to predicting the token that follows \"English: cat / Korean:\"." },
      { ko: "분류·요약·질의응답도 프롬프트로 처리하고, 스케일도 잘 됩니다.", en: "Classification, summarization, and QA get handled by prompting too, and it scales well." },
      { ko: "그래서 현대 LLM(ChatGPT 등)은 대부분 디코더 온리입니다.", en: "So most modern LLMs (ChatGPT and the like) are decoder-only." },
      { ko: "인코더-디코더도 명맥은 있습니다.", en: "Encoder-decoder models still exist, though." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "여기서 3편 BERT와의 대비가 완성됩니다.", en: "This is where the contrast with BERT from part 3 completes." },
      { ko: "BERT는 양쪽을 다 보므로 왼쪽만 보고 다음을 이어쓰는 자기회귀 생성을 애초에 훈련한 적이 없습니다.", en: "BERT sees both sides, so it was never trained to continue autoregressively from the left alone." },
      { ko: "양방향은 다음 토큰이 구조적으로 새어 들어와 생성기로 쓸 수 없습니다.", en: "Bidirectionality structurally leaks the next token, so it can't be used as a generator." },
    ],
  },

  { type: "hr" },

  {
    type: "callout",
    tone: "tip",
    ko: "<strong>시리즈 한 줄 매듭.</strong> 1편 어텐션(Q·K로 문맥을 모은다) → 2편 블록(어텐션과 FFN을 잔차·정규화로 깊게 쌓는다) → 3·4편 방향(같은 블록을 인코더로 쌓으면 양방향 BERT, causal 마스크로 쌓으면 왼→오 GPT). 부품은 하나인데, 무엇을 가리느냐가 이해기와 생성기를 가릅니다.",
    en: "<strong>The series in one line.</strong> Part 1, attention (gather context with Q·K) → part 2, the block (stack attention and FFN deep with residuals and norm) → parts 3–4, direction (stack the same block as an encoder for bidirectional BERT, or with a causal mask for left-to-right GPT). One set of parts — what you hide is what separates the understander from the generator.",
  },
  {
    type: "p",
    s: [
      { ko: "causal 마스크 삼각형이 미래를 어떻게 가리는지, 토큰이 하나씩 자기회귀로 붙는지, temperature로 분포가 어떻게 변하는지는 직접 만져보는 게 빠릅니다.", en: "How the causal-mask triangle hides the future, how tokens attach one at a time autoregressively, how temperature reshapes the distribution — it's fastest to just touch it." },
      { ko: "<a href=\"/playground/gpt/\">직접 만져보기 →</a>", en: "<a href=\"/playground/gpt/\">Try it yourself →</a>" },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "양방향과의 대비가 헷갈리면 3편부터 보세요.", en: "If the bidirectional contrast is fuzzy, start from part 3." },
      { ko: "<a href=\"/blog/bert-encoder/\">인코더 온리, BERT — 빈칸 채우기로 양방향으로 읽는다 →</a>", en: "<a href=\"/blog/bert-encoder/\">Encoder-only, BERT — reading both ways by filling in the blanks →</a>" },
    ],
  },

  {
    type: "sources",
    html: "<h3>출처 / Sources</h3><ul><li>Radford et al. (2019), \"Language Models are Unsupervised Multitask Learners\" (GPT-2) — decoder-only, next-token prediction.</li><li>Brown et al. (2020), \"Language Models are Few-Shot Learners\" (GPT-3) — <a href=\"https://arxiv.org/abs/2005.14165\">arxiv.org/abs/2005.14165</a> (96 layers, 96 heads, 12288-dim, 175B parameters, 300B tokens, in-context learning).</li><li>Vaswani et al. (2017), \"Attention Is All You Need\" — <a href=\"https://arxiv.org/abs/1706.03762\">arxiv.org/abs/1706.03762</a> (original transformer decoder, masked self-attention).</li></ul>",
  },
];