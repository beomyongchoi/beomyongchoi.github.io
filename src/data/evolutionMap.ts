import type { BiBlock } from "./aiParadox";

// Config values: each model's config.json on Hugging Face (fetched 2026-10-13) + the 2017 paper's base model.
// Derived numbers come from public/lab/arch.js and are pinned by scripts/lab-arch.check.mjs.
export const blocks: BiBlock[] = [
  {
    type: "callout",
    tone: "tldr",
    ko: "<strong>결론부터.</strong> 2017년 트랜스포머의 뼈대는 지금도 그대로입니다. 어텐션과 FFN을 잔차로 이어 쌓은 블록입니다. 바뀐 건 부품입니다. 인코더를 버렸고, 위치는 회전(RoPE)으로, 정규화는 앞으로(Pre-RMSNorm), 활성화는 게이트(SwiGLU)로 바뀌었습니다. 어텐션은 캐시를 나눠 쓰고(GQA·MLA), FFN은 전문가로 쪼갰습니다(MoE). 공개 모델의 실제 설정 파일로 하나씩 확인합니다.",
    en: "<strong>The short version.</strong> The 2017 transformer's skeleton is still here: blocks of attention and FFN, joined by residuals, stacked. What changed are the parts. The encoder is gone; position became a rotation (RoPE); normalization moved in front (Pre-RMSNorm); the activation got a gate (SwiGLU). Attention now shares its cache (GQA, MLA), and the FFN was split into experts (MoE). We check each one against real config files of open models.",
  },

  {
    type: "p",
    s: [
      { ko: "<a href=\"/series/\">트랜스포머 뜯어보기</a> 시리즈는 2017년 원형을 다뤘습니다.", en: "The <a href=\"/series/\">Taking the Transformer Apart</a> series covered the 2017 original." },
      { ko: "그런데 지금 쓰는 모델은 그 설계도를 그대로 쓰지 않습니다.", en: "But today's models don't use that blueprint as-is." },
      { ko: "이 시리즈는 무엇이 왜 바뀌었는지 부품 하나씩 따라갑니다.", en: "This series follows, part by part, what changed and why." },
      { ko: "0편은 전체 지도입니다.", en: "Part 0 is the map." },
    ],
  },

  {
    type: "callout",
    tone: "tip",
    ko: "아래 표와 숫자는 실험실에서 모델을 바꿔 가며 직접 계산해 볼 수 있습니다. <a href=\"/playground/arch/\">설계도 비교기 →</a>",
    en: "You can recompute every table and number below in the lab, switching models as you go. <a href=\"/playground/arch/\">Blueprint comparator →</a>",
  },

  { type: "hr" },

  { type: "h2", ko: "1. 설계도는 숫자로 공개된다", en: "1. The blueprint is published as numbers" },
  {
    type: "p",
    s: [
      { ko: "공개 모델은 가중치와 함께 <code>config.json</code>이라는 설정 파일을 올립니다.", en: "Open models ship a settings file, <code>config.json</code>, alongside their weights." },
      { ko: "층 수, 폭, 헤드 수, 활성화 함수, 위치 방식이 다 적혀 있습니다.", en: "It lists the layer count, width, head count, activation, and position scheme." },
      { ko: "추측할 필요 없이 그 숫자를 읽으면 됩니다.", en: "No guessing needed — just read the numbers." },
    ],
  },
  {
    type: "code",
    code: "                 2017 base    GPT-2     Llama 3.1 8B   DeepSeek-V3\n  layout         enc+dec      decoder   decoder        decoder\n  layers         6            12        32             61\n  d_model        512          768       4,096          7,168\n  attention      MHA 8        MHA 12    GQA 32→8       MLA (latent 512)\n  position       sinusoidal   learned   RoPE           RoPE (YaRN)\n  norm           Post-LN      Pre-LN    Pre-RMSNorm    Pre-RMSNorm\n  FFN            ReLU         GELU      SwiGLU         SwiGLU · MoE 256→8 +1\n  vocab          ~37,000      50,257    128,256        129,280",
  },
  {
    type: "p",
    s: [
      { ko: "같은 칸을 가로로 읽으면 진화의 방향이 보입니다.", en: "Read across any row and you can see the direction of evolution." },
      { ko: "실험실 표에는 Mixtral, Qwen3-30B-A3B, SmolLM2까지 일곱 모델이 있습니다.", en: "The lab's table has seven models, adding Mixtral, Qwen3-30B-A3B, and SmolLM2." },
    ],
  },

  { type: "h2", ko: "2. 그대로인 것 — 블록을 쌓는다", en: "2. What stayed — stack the block" },
  {
    type: "p",
    s: [
      { ko: "<a href=\"/blog/transformer-block/\">트랜스포머 블록</a>은 9년째 같은 모양입니다.", en: "The <a href=\"/blog/transformer-block/\">transformer block</a> has kept its shape for nine years." },
      { ko: "토큰끼리 정보를 섞는 어텐션, 토큰마다 따로 계산하는 FFN, 그리고 입력을 그대로 더해 주는 잔차 연결입니다.", en: "Attention to mix information between tokens, an FFN applied to each token separately, and residual connections that add the input back." },
      { ko: "이 블록을 6번 쌓던 걸 61번 쌓을 뿐입니다.", en: "Where it was stacked 6 times, it's now stacked 61." },
      { ko: "학습 방식도 같습니다. 다음 토큰을 맞히는 손실을 <a href=\"/blog/backprop/\">역전파</a>로 줄입니다.", en: "Training is the same too: minimize next-token loss with <a href=\"/blog/backprop/\">backprop</a>." },
    ],
  },

  { type: "h2", ko: "3. 바뀐 것 — 부품 여섯 개", en: "3. What changed — six parts" },
  {
    type: "list",
    items: [
      { ko: "<strong>구조</strong>: 인코더-디코더에서 디코더만으로. 번역기에서 범용 생성기가 됐습니다(<a href=\"/blog/gpt-decoder/\">GPT 편</a>).", en: "<strong>Layout</strong>: encoder-decoder → decoder-only. A translator became a general generator (<a href=\"/blog/gpt-decoder/\">GPT post</a>)." },
      { ko: "<strong>위치</strong>: 사인 함수를 더하던 방식에서, 벡터를 위치만큼 <strong>회전</strong>시키는 RoPE로. 긴 문맥으로 늘리기도 쉬워졌습니다. → 1편", en: "<strong>Position</strong>: from adding sine waves to RoPE, which <strong>rotates</strong> vectors by position — and is easier to stretch to long contexts. → Part 1" },
      { ko: "<strong>정규화·활성화</strong>: 정규화를 블록 앞으로 옮기고(Pre), 더 가벼운 RMSNorm으로. 활성화는 ReLU에서 게이트를 단 SwiGLU로. 깊게 쌓아도 학습이 안 무너지게 하는 변화입니다. → 2편", en: "<strong>Norm & activation</strong>: normalization moved in front of each block (Pre) and got lighter (RMSNorm); ReLU became the gated SwiGLU. Changes that keep deep stacks trainable. → Part 2" },
      { ko: "<strong>어텐션 캐시</strong>: 헤드마다 K·V를 따로 두던 것(MHA)을 여러 헤드가 나눠 쓰거나(GQA) 압축해서(MLA) 저장합니다. → 3편", en: "<strong>Attention cache</strong>: instead of every head keeping its own K and V (MHA), heads share them (GQA) or store them compressed (MLA). → Part 3" },
      { ko: "<strong>FFN</strong>: 하나의 큰 FFN을 여러 전문가로 쪼개고, 토큰마다 몇 개만 켭니다(MoE). → 4편", en: "<strong>FFN</strong>: one big FFN split into many experts, with only a few switched on per token (MoE). → Part 4" },
      { ko: "<strong>어휘</strong>: 3.7만 개에서 최근 모델은 12~15만 개로(Mixtral은 3.2만으로 예외). 같은 문장을 더 적은 토큰으로 자릅니다.", en: "<strong>Vocabulary</strong>: from ~37k to 128k–152k in recent models (Mixtral, at 32k, is the exception), so the same sentence takes fewer tokens." },
    ],
  },

  { type: "h2", ko: "4. 크기 — 671B인데 토큰 하나엔 37B", en: "4. Size — 671B, but 37B per token" },
  {
    type: "p",
    s: [
      { ko: "설정값만으로 파라미터 수를 계산해 봤습니다.", en: "I computed parameter counts from the config values alone." },
      { ko: "공식 발표와 1~2% 안에서 맞습니다. 2017년 base 모델은 약 6,300만 개로 계산됐고, 논문은 6,500만 개라고 적었습니다.", en: "They match the official figures within 1–2%. The 2017 base model comes out at about 63M; the paper says 65M." },
    ],
  },
  {
    type: "code",
    code: "$ params --from config.json            # total     active per token\n  Transformer base (2017)                 63M        63M\n  GPT-2 small                             124M       124M\n  Llama 3.1 8B                            8.0B       8.0B\n  Mixtral 8x7B                            46.7B      12.9B\n  Qwen3-30B-A3B                           30.5B      3.35B\n  DeepSeek-V3                             671B       37.6B    # 5.6%",
  },
  {
    type: "p",
    s: [
      { ko: "MoE 모델은 전체와 활성이 다릅니다.", en: "For MoE models, total and active differ." },
      { ko: "DeepSeek-V3는 앞 3개 층을 빼고 61개 층 중 58개가 MoE이고, 그 층마다 전문가 256개 중 8개와 공유 전문가 1개만 켭니다.", en: "In DeepSeek-V3, 58 of 61 layers (all but the first 3) are MoE, and each switches on just 8 of 256 experts plus 1 shared expert." },
      { ko: "그래서 671B짜리 모델이 토큰 하나를 처리할 때는 37B 남짓만 계산합니다.", en: "So a 671B model computes only about 37B for each token." },
      { ko: "지식은 크게 담고 계산은 작게 하는 것, 이게 MoE의 요점입니다.", en: "Store a lot of knowledge, compute a little — that's the point of MoE." },
    ],
  },

  { type: "h2", ko: "5. KV 캐시 — 긴 대화의 진짜 비용", en: "5. The KV cache — the real cost of long chats" },
  {
    type: "p",
    s: [
      { ko: "생성할 때는 지난 토큰의 K·V를 저장해 둡니다(<a href=\"/blog/gpt-decoder/\">KV 캐시</a>).", en: "During generation, past tokens' K and V are stored (<a href=\"/blog/gpt-decoder/\">the KV cache</a>)." },
      { ko: "이 캐시는 대화가 길어질수록 선형으로 커집니다.", en: "That cache grows linearly as the conversation gets longer." },
    ],
  },
  {
    type: "code",
    code: "$ kv-cache --dtype bf16 --tokens 131072   # 128K tokens, one conversation\n  Llama 3.1 8B    GQA 32→8      16 GB     (64 GB if every head cached its own)\n  DeepSeek-V3     MLA latent    8.6 GB    (610 GB without compression, 71×)",
  },
  {
    type: "p",
    s: [
      { ko: "Llama 3.1은 헤드 32개가 K·V 8벌을 나눠 써서 캐시를 4분의 1로 줄였습니다.", en: "Llama 3.1's 32 heads share 8 sets of K and V, cutting the cache to a quarter." },
      { ko: "DeepSeek-V3는 K·V를 512차원짜리 잠재 벡터 하나로 압축하고, 위치용 64차원 키 하나만 더해 저장합니다.", en: "DeepSeek-V3 compresses K and V into a single 512-dimensional latent vector, plus one 64-dimensional key for position." },
      { ko: "모델이 671B로 훨씬 큰데도 토큰당 캐시는 Llama 3.1 8B보다 작습니다.", en: "Despite being a far larger 671B model, its per-token cache is smaller than Llama 3.1 8B's." },
      { ko: "긴 컨텍스트 시대에 어텐션이 다이어트한 이유가 여기 있습니다.", en: "This is why attention went on a diet in the long-context era." },
    ],
  },

  { type: "h2", ko: "6. 공개 모델만 볼 수 있다", en: "6. We can only see the open models" },
  {
    type: "p",
    s: [
      { ko: "Claude Opus 5.5나 GPT-6 Astra 같은 비공개 모델은 설정 파일을 공개하지 않습니다.", en: "Closed models like Claude Opus 5.5 or GPT-6 Astra don't publish their config files." },
      { ko: "그래서 이 시리즈는 논문과 설정 파일이 공개된 모델로 설명합니다.", en: "So this series explains with models whose papers and configs are public." },
      { ko: "비공개 모델에 대해서는 회사가 밝힌 것까지만 쓰고, 추측은 추측이라고 적겠습니다.", en: "For closed models I'll write only what the companies disclose, and label guesses as guesses." },
    ],
  },
  {
    type: "callout",
    tone: "warn",
    ko: "설정 파일이 모든 걸 말해 주진 않습니다. 학습 데이터, 학습 방법, 사후 학습(RLHF 등)은 대개 설정에 없고, 모델 성능의 큰 부분이 거기서 나옵니다. 이 시리즈는 <strong>구조</strong>의 진화를 다룹니다.",
    en: "A config file doesn't tell the whole story. Training data, training recipes, and post-training (RLHF and the like) usually aren't in it — and much of a model's quality comes from there. This series is about the evolution of <strong>architecture</strong>.",
  },

  { type: "h2", ko: "앞으로 다룰 것", en: "What's ahead" },
  {
    type: "list",
    items: [
      { ko: "1편 위치를 아는 법 — 사인파에서 RoPE, 그리고 긴 문맥으로 늘리기", en: "Part 1 Knowing position — from sine waves to RoPE, and stretching to long contexts" },
      { ko: "2편 깊게 쌓아도 안 무너지게 — Pre-norm, RMSNorm, SwiGLU", en: "Part 2 Stacking deep without collapse — Pre-norm, RMSNorm, SwiGLU" },
      { ko: "3편 어텐션 다이어트 — KV 캐시, GQA, MLA, FlashAttention", en: "Part 3 Attention on a diet — KV cache, GQA, MLA, FlashAttention" },
      { ko: "4편 전문가들 — MoE는 어디서 왔고 딥시크는 무엇을 바꿨나", en: "Part 4 The experts — where MoE came from and what DeepSeek changed" },
      { ko: "5편 키우는 법칙 — 스케일링 법칙과 숫자 정밀도", en: "Part 5 The laws of growth — scaling laws and numeric precision" },
      { ko: "6편 생각하는 모델 — 추론 학습과 추론 시간 계산", en: "Part 6 Models that think — training for reasoning and test-time compute" },
    ],
  },

  { type: "hr" },
  {
    type: "sources",
    html: "<h3>출처 · Sources</h3><ul><li>Vaswani et al., <a href=\"https://arxiv.org/abs/1706.03762\">Attention Is All You Need</a> (2017) — base model: 6 layers, d_model 512, 8 heads, d_ff 2048, 65M params</li><li>config.json: <a href=\"https://huggingface.co/openai-community/gpt2/blob/main/config.json\">GPT-2</a> · <a href=\"https://huggingface.co/unsloth/Meta-Llama-3.1-8B/blob/main/config.json\">Llama 3.1 8B</a> · <a href=\"https://huggingface.co/mistralai/Mixtral-8x7B-v0.1/blob/main/config.json\">Mixtral 8x7B</a> · <a href=\"https://huggingface.co/deepseek-ai/DeepSeek-V3/blob/main/config.json\">DeepSeek-V3</a> · <a href=\"https://huggingface.co/Qwen/Qwen3-30B-A3B/blob/main/config.json\">Qwen3-30B-A3B</a> · <a href=\"https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct/blob/main/config.json\">SmolLM2-135M</a></li><li>DeepSeek-AI, <a href=\"https://arxiv.org/abs/2412.19437\">DeepSeek-V3 Technical Report</a> (2024) — 671B total, 37B activated per token</li><li>DeepSeek-AI, <a href=\"https://arxiv.org/abs/2405.04434\">DeepSeek-V2</a> (2024) — Multi-head Latent Attention</li><li>Mistral AI, <a href=\"https://mistral.ai/news/mixtral-of-experts\">Mixtral of experts</a> — 46.7B total, 12.9B per token</li><li>Qwen, <a href=\"https://qwenlm.github.io/blog/qwen3/\">Qwen3: Think Deeper, Act Faster</a></li><li>계산 코드: <a href=\"/lab/arch.js\">/lab/arch.js</a></li></ul>",
  },
];
