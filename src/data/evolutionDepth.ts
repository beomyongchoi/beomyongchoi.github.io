import type { BiBlock } from "./aiParadox";

// Stack numbers: public/lab/depth.js, 16 random stacks (width 128, seeds 1–16, RMSNorm unless noted),
// pinned by scripts/lab-depth.check.mjs. FFN sizes: Hugging Face config.json, fetched 2026-10-17.
export const blocks: BiBlock[] = [
  {
    type: "callout",
    tone: "tldr",
    ko: "<strong>결론부터.</strong> 층을 깊게 쌓으려면 신호 크기를 지켜야 합니다. 정규화 없이 무작위 층을 48개 쌓으면 신호가 1,200만 배로 커집니다. 2017년 트랜스포머는 정규화를 층 <strong>뒤</strong>에 뒀고(Post-LN), GPT-2부터는 층 <strong>앞</strong>으로 옮겼습니다(Pre-LN). 그러면 처음 입력이 위층까지 지나가는 길이 그대로 남고, 학습도 덜 까다롭습니다. LLaMA는 여기에 계산이 가벼운 <strong>RMSNorm</strong>과 문을 단 FFN인 <strong>SwiGLU</strong>를 묶었고, 이후 공개 모델 대부분이 이 조합을 씁니다.",
    en: "<strong>The short version.</strong> To stack layers deep, you have to keep the signal's size in check. Stack 48 random layers with no normalization and the signal grows 12 million times. The 2017 Transformer put normalization <strong>after</strong> each layer (Post-LN); from GPT-2 on, it moved <strong>before</strong> each layer (Pre-LN). That keeps a clean path for the original input all the way up, and training gets less finicky. LLaMA combined that with the cheaper <strong>RMSNorm</strong> and the gated FFN <strong>SwiGLU</strong>, and most open models since use the same set.",
  },

  {
    type: "p",
    s: [
      { ko: "<a href=\"/blog/evolution-map/\">0편 지도</a>에서 바뀐 부품 중 셋을 이번 편에 묶었습니다.", en: "This part bundles three of the parts that changed in <a href=\"/blog/evolution-map/\">Part 0, the map</a>." },
      { ko: "정규화의 위치, 정규화의 종류, 그리고 FFN의 모양입니다.", en: "Where normalization sits, what kind it is, and the shape of the FFN." },
      { ko: "셋 다 \"깊게 쌓아도 학습이 버티게\" 하는 쪽으로 바뀌었습니다.", en: "All three changed in the direction of \"keep training stable as the stack gets deep.\"" },
    ],
  },

  {
    type: "callout",
    tone: "tip",
    ko: "층 수를 1에서 96까지 바꿔 가며 세 방식을 나란히 볼 수 있습니다. <a href=\"/playground/depth/\">층 쌓기 →</a> · 오락실: <a href=\"/arcade/tower/\">신호 탑 쌓기 →</a>",
    en: "You can change the depth from 1 to 96 and watch the three setups side by side. <a href=\"/playground/depth/\">Layer stacking →</a> · Arcade: <a href=\"/arcade/tower/\">Signal tower →</a>",
  },

  { type: "hr" },

  { type: "h2", ko: "1. 잔차 연결 — 더해 나가는 길", en: "1. Residual connections — a path you add to" },
  {
    type: "p",
    s: [
      { ko: "<a href=\"/blog/transformer-block/\">트랜스포머 블록</a>의 어텐션과 FFN은 입력을 갈아 끼우지 않습니다. 결과를 입력에 <strong>더합니다</strong>.", en: "In a <a href=\"/blog/transformer-block/\">transformer block</a>, attention and the FFN don't replace their input. They <strong>add</strong> their result to it." },
      { ko: "이 \"더해 나가는 길\"을 잔차 연결이라고 부릅니다. 층이 수십 개여도 아래 정보가 위로 올라갈 수 있는 이유입니다.", en: "This running sum is the residual connection. It's how information from the bottom can reach the top even through dozens of layers." },
      { ko: "문제는 더할수록 값이 커진다는 점입니다.", en: "The catch: the more you add, the bigger the numbers get." },
    ],
  },

  { type: "h2", ko: "2. 정규화가 없으면 — 신호가 폭발한다", en: "2. Without normalization — the signal explodes" },
  {
    type: "p",
    s: [
      { ko: "무작위로 초기화한 층을 쌓고 입력을 한 번 통과시켜 봤습니다. 학습은 하지 않았습니다.", en: "We stacked randomly initialized layers and passed one input through. No training." },
      { ko: "층마다 결과를 더하기만 하면 신호 크기가 층마다 일정한 비율로 커집니다.", en: "If each layer just adds its result, the signal grows by roughly a fixed ratio per layer." },
    ],
  },
  {
    type: "code",
    code: "$ stack --no-norm --width 128 --seeds 16     # output size ÷ input size\n  layers    growth\n  6         7.2×\n  12        58×\n  24        3,600×\n  48        12,000,000×",
  },
  {
    type: "p",
    s: [
      { ko: "48층이면 1,200만 배입니다. 이 상태로는 학습이 시작되기도 전에 숫자가 감당할 수 없게 됩니다.", en: "At 48 layers it's 12 million times. Numbers become unmanageable before training even starts." },
      { ko: "그래서 중간중간 크기를 1 근처로 되돌리는 <strong>정규화</strong>를 넣습니다.", en: "So <strong>normalization</strong> goes in along the way to pull the size back to around 1." },
    ],
  },

  { type: "h2", ko: "3. 층 뒤에 둘까, 앞에 둘까", en: "3. After the layer, or before it?" },
  {
    type: "list",
    items: [
      { ko: "<strong>Post-LN (2017)</strong>: 더한 다음 정규화합니다. Norm(x + F(x)).", en: "<strong>Post-LN (2017)</strong>: add, then normalize. Norm(x + F(x))." },
      { ko: "<strong>Pre-LN (GPT-2, 2019~)</strong>: 층에 넣기 전에만 정규화하고, 더하는 길은 건드리지 않습니다. x + F(Norm(x)). 맨 위에 정규화를 한 번 더 둡니다.", en: "<strong>Pre-LN (GPT-2, 2019 on)</strong>: normalize only what goes into the layer and leave the running sum alone. x + F(Norm(x)), with one more norm at the very top." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "둘 다 신호 크기는 지킵니다. 차이는 처음 입력이 위층까지 얼마나 남느냐입니다.", en: "Both keep the size in check. The difference is how much of the original input survives to the top." },
      { ko: "맨 위 신호와 처음 입력의 코사인 유사도로 재 봤습니다. 1이면 그대로, 0이면 흔적이 없습니다.", en: "We measured the cosine similarity between the top signal and the original input: 1 means unchanged, 0 means no trace." },
    ],
  },
  {
    type: "code",
    code: "$ stack --keep-input --width 128 --seeds 16  # cosine(top, input)\n  layers    Post-LN    Pre-LN    1/sqrt(layers+1)\n  6         0.16       0.41      0.38\n  12        0.00       0.30      0.28\n  24        -0.04      0.21      0.20\n  48        0.00       0.14      0.14",
  },
  {
    type: "p",
    s: [
      { ko: "Post-LN은 10층쯤에서 처음 입력이 사실상 사라집니다. 층마다 정규화가 더한 길 전체를 다시 줄이기 때문입니다.", en: "With Post-LN the original input is effectively gone by about layer 10, because every norm rescales the whole running sum." },
      { ko: "Pre-LN은 더하는 길을 비워 두니 처음 입력이 약 1/√(층 수+1)만큼 남습니다. 거꾸로 흐르는 기울기도 같은 길로 곧장 내려갑니다.", en: "Pre-LN leaves the running sum alone, so about 1/√(layers+1) of the input remains. Gradients flowing back take the same straight path down." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "2020년 Xiong 등은 Post-LN이 초기화 시점에 출력 근처 기울기가 커서, 학습률을 천천히 올리는 <strong>워밍업</strong>이 꼭 필요하다고 분석했습니다.", en: "In 2020, Xiong et al. showed that Post-LN has large gradients near the output at initialization, so it needs a learning-rate <strong>warm-up</strong>." },
      { ko: "Pre-LN은 워밍업 없이도 학습됐습니다.", en: "Pre-LN trained without one." },
    ],
  },
  {
    type: "callout",
    tone: "warn",
    ko: "Pre-LN이 모든 면에서 나은 건 아닙니다. 같은 해 Liu 등은 Post-LN을 잘 길들이면 최종 성능이 더 좋을 수 있다고 보고했습니다. 위 표는 학습 전 한 번 통과시킨 결과라 학습 중 문제는 직접 보여 주지 않습니다. 대형 모델이 Pre-LN을 고른 건 무엇보다 안정성 때문입니다.",
    en: "Pre-LN isn't better on every count. The same year, Liu et al. reported that a well-tamed Post-LN can reach better final quality. The table above is a single pass before training, so it doesn't show training-time problems directly. Large models chose Pre-LN above all for stability.",
  },

  { type: "h2", ko: "4. RMSNorm — 평균 빼기를 뺐다", en: "4. RMSNorm — dropping the mean" },
  {
    type: "p",
    s: [
      { ko: "LayerNorm은 값에서 평균을 빼고, 표준편차로 나눕니다.", en: "LayerNorm subtracts the mean, then divides by the standard deviation." },
      { ko: "2019년 Zhang과 Sennrich는 평균 빼기를 생략하고 제곱평균제곱근(RMS)으로만 나누는 RMSNorm을 냈습니다.", en: "In 2019, Zhang and Sennrich proposed RMSNorm: skip the mean and divide by the root mean square only." },
      { ko: "논문은 성능은 비슷하고 실행 시간은 모델에 따라 7%~64% 줄었다고 보고했습니다.", en: "The paper reported similar quality with running time cut by 7% to 64% depending on the model." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "층 쌓기 실험에서도 둘은 거의 같았습니다. 48층 Pre-LN에서 남은 입력이 LayerNorm 0.15, RMSNorm 0.14였습니다.", en: "In the stacking experiment the two were nearly identical: input kept after 48 Pre-LN layers was 0.15 with LayerNorm and 0.14 with RMSNorm." },
      { ko: "크기를 맞추는 게 핵심이고, 평균을 0으로 맞추는 건 크게 필요 없었다는 뜻입니다.", en: "Fixing the scale is what matters; centering the mean wasn't doing much." },
    ],
  },

  { type: "h2", ko: "5. SwiGLU — FFN에 문을 달다", en: "5. SwiGLU — putting a gate on the FFN" },
  {
    type: "p",
    s: [
      { ko: "원래 FFN은 d차원을 4d로 키웠다가 활성화 함수를 거쳐 다시 d로 줄입니다. 행렬이 2개입니다.", en: "The original FFN expands d dimensions to 4d, applies an activation, and shrinks back to d. Two matrices." },
      { ko: "SwiGLU는 행렬을 하나 더 둡니다. 한쪽은 값을 만들고, 다른 쪽은 SiLU를 거쳐 그 값을 얼마나 통과시킬지 정하는 <strong>문</strong>이 됩니다.", en: "SwiGLU adds a third matrix. One branch makes values; the other goes through SiLU and becomes a <strong>gate</strong> deciding how much of each value passes." },
      { ko: "2020년 Shazeer가 여러 변형을 비교한 논문에서 성능이 좋았던 조합입니다.", en: "It was one of the best performers in Shazeer's 2020 paper comparing variants." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "왜 잘 되는지는 논문도 설명하지 않았습니다. Shazeer는 그 공을 \"divine benevolence\"(신의 자비)에 돌린다고 썼습니다.", en: "Even the paper didn't explain why it works. Shazeer wrote that he attributes the success to \"divine benevolence.\"" },
      { ko: "행렬이 3개라 크기를 맞추려면 중간 폭을 4d의 2/3, 약 2.67d로 줄입니다.", en: "With three matrices, keeping the size equal means shrinking the middle width to 2/3 of 4d, about 2.67d." },
    ],
  },
  {
    type: "code",
    code: "$ ffn --from config.json                 # middle width ÷ d, FFN params per layer\n  GPT-2 small     plain, GELU     4.00    4.7M\n  Llama 2 7B      SwiGLU          2.69    135M   # plain 4d would be 134M\n  Llama 3.1 8B    SwiGLU          3.50    176M\n  Qwen3-8B        SwiGLU          3.00    151M\n  DeepSeek-V3     SwiGLU (dense)  2.57    396M",
  },
  {
    type: "p",
    s: [
      { ko: "Llama 2는 2/3 규칙을 거의 그대로 따랐습니다. Llama 3.1과 Qwen3는 FFN을 더 넓혔습니다.", en: "Llama 2 followed the 2/3 rule almost exactly. Llama 3.1 and Qwen3 made the FFN wider." },
    ],
  },

  { type: "h2", ko: "6. 계보", en: "6. Lineage" },
  {
    type: "list",
    items: [
      { ko: "<strong>2016</strong> LayerNorm(Ba·Kiros·Hinton). 같은 해 He 등이 잔차 블록에서 정규화를 앞에 두는 pre-activation을 제안했습니다.", en: "<strong>2016</strong> LayerNorm (Ba, Kiros, Hinton). The same year He et al. proposed pre-activation, putting normalization first in residual blocks." },
      { ko: "<strong>2017</strong> 원조 트랜스포머. Post-LN, ReLU FFN.", en: "<strong>2017</strong> The original Transformer: Post-LN, ReLU FFN." },
      { ko: "<strong>2019</strong> GPT-2. 정규화를 각 블록 입력으로 옮기고 맨 위에 하나 추가. 같은 해 RMSNorm 논문.", en: "<strong>2019</strong> GPT-2 moves normalization to each block's input and adds one at the top. RMSNorm is published the same year." },
      { ko: "<strong>2020</strong> Shazeer, GLU 변형 비교(SwiGLU). Xiong 등, Pre-LN은 워밍업이 필요 없다는 분석.", en: "<strong>2020</strong> Shazeer compares GLU variants (SwiGLU). Xiong et al. show Pre-LN doesn't need warm-up." },
      { ko: "<strong>2022</strong> PaLM이 SwiGLU를 씀.", en: "<strong>2022</strong> PaLM uses SwiGLU." },
      { ko: "<strong>2023</strong> LLaMA가 Pre-norm·RMSNorm·SwiGLU를 묶어 쓰면서 이후 공개 모델의 기본 조합이 됐습니다.", en: "<strong>2023</strong> LLaMA combines pre-norm, RMSNorm, and SwiGLU, and that becomes the default kit for open models." },
    ],
  },

  { type: "h2", ko: "7. 정리", en: "7. Wrap-up" },
  {
    type: "p",
    s: [
      { ko: "세 부품 모두 성능을 크게 올리는 발명이라기보다 깊고 큰 모델을 <strong>안정적으로</strong> 학습시키는 손질입니다.", en: "None of the three is a big leap in capability. Each is a tune-up that lets deep, large models train <strong>stably</strong>." },
      { ko: "그래서 한번 자리 잡은 뒤로는 거의 바뀌지 않았습니다.", en: "That's why, once they settled in, they've barely changed." },
      { ko: "다음 편은 이미 나온 <a href=\"/blog/evolution-kv/\">3편 KV 캐시 다이어트</a>입니다.", en: "The next part is the already-published <a href=\"/blog/evolution-kv/\">Part 3, the KV cache diet</a>." },
    ],
  },

  {
    type: "sources",
    html: "<h3>출처 · Sources</h3><ul><li>Vaswani et al., <a href=\"https://arxiv.org/abs/1706.03762\">Attention Is All You Need</a> (2017) — LayerNorm(x + Sublayer(x))</li><li>Ba, Kiros, Hinton, <a href=\"https://arxiv.org/abs/1607.06450\">Layer Normalization</a> (2016)</li><li>He et al., <a href=\"https://arxiv.org/abs/1603.05027\">Identity Mappings in Deep Residual Networks</a> (2016)</li><li>Radford et al., <a href=\"https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf\">Language Models are Unsupervised Multitask Learners</a> (GPT-2, 2019)</li><li>Zhang, Sennrich, <a href=\"https://arxiv.org/abs/1910.07467\">Root Mean Square Layer Normalization</a> (2019)</li><li>Xiong et al., <a href=\"https://arxiv.org/abs/2002.04745\">On Layer Normalization in the Transformer Architecture</a> (2020)</li><li>Liu et al., <a href=\"https://arxiv.org/abs/2004.08249\">Understanding the Difficulty of Training Transformers</a> (2020)</li><li>Shazeer, <a href=\"https://arxiv.org/abs/2002.05202\">GLU Variants Improve Transformer</a> (2020)</li><li>Chowdhery et al., <a href=\"https://arxiv.org/abs/2204.02311\">PaLM</a> (2022)</li><li>Touvron et al., <a href=\"https://arxiv.org/abs/2302.13971\">LLaMA</a> (2023)</li><li>config.json: <a href=\"https://huggingface.co/unsloth/llama-2-7b/blob/main/config.json\">Llama 2 7B</a> · <a href=\"https://huggingface.co/unsloth/Meta-Llama-3.1-8B/blob/main/config.json\">Llama 3.1 8B</a> · <a href=\"https://huggingface.co/Qwen/Qwen3-8B/blob/main/config.json\">Qwen3-8B</a> · <a href=\"https://huggingface.co/deepseek-ai/DeepSeek-V3/blob/main/config.json\">DeepSeek-V3</a> · <a href=\"https://huggingface.co/openai-community/gpt2/blob/main/config.json\">GPT-2</a></li><li>계산 코드: <a href=\"/lab/depth.js\">/lab/depth.js</a></li></ul>",
  },
];
