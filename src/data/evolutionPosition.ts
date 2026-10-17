import type { BiBlock } from "./aiParadox";

// Scores, wavelengths and "unfinished hands" come from public/lab/rope.js (word vectors are fixed
// stand-ins: wordVec("개가",128,1) / wordVec("물었다",128,2), base 10,000), pinned by scripts/lab-rope.check.mjs.
// Model settings: Hugging Face config.json, fetched 2026-10-17.
export const blocks: BiBlock[] = [
  {
    type: "callout",
    tone: "tldr",
    ko: "<strong>결론부터.</strong> 어텐션은 그대로 두면 단어 순서를 모릅니다. 2017년 트랜스포머는 위치마다 정해진 벡터를 단어에 <strong>더했습니다</strong>. 지금 공개 모델 대부분은 <strong>RoPE</strong>를 씁니다. 더하지 않고 위치만큼 <strong>돌립니다</strong>. 그러면 두 단어의 점수가 서로 몇 칸 떨어졌는지에만 달라집니다. 긴 글을 읽게 하는 기술도 대부분 이 회전 속도를 조절하는 일입니다.",
    en: "<strong>The short version.</strong> Left alone, attention doesn't know word order. The 2017 Transformer <strong>added</strong> a fixed vector for each position to each word. Most open models today use <strong>RoPE</strong>: instead of adding, it <strong>rotates</strong> each vector by its position. Then the score between two words depends only on how far apart they are. Most tricks for reading longer text come down to adjusting the speed of that rotation.",
  },

  {
    type: "p",
    s: [
      { ko: "<a href=\"/blog/evolution-map/\">0편 지도</a>에서 2017년 이후 바뀐 부품을 표로 봤습니다.", en: "In <a href=\"/blog/evolution-map/\">Part 0, the map</a>, we tabulated the parts that changed after 2017." },
      { ko: "위치 표시 방식은 거의 모든 모델에서 바뀐 부품입니다.", en: "How position is encoded changed in nearly every model." },
      { ko: "이번 편은 왜 바꿨는지, 그리고 그게 긴 문맥과 어떻게 이어지는지 봅니다.", en: "This part looks at why, and how it ties into long context." },
    ],
  },

  {
    type: "callout",
    tone: "tip",
    ko: "단어 앞에 다른 단어를 끼워 가며 점수가 그대로인지, 학습 길이를 넘으면 어떤 바늘이 처음 보는 각도로 가는지 직접 볼 수 있습니다. <a href=\"/playground/rope/\">RoPE 회전 시계 →</a>",
    en: "You can insert words in front and check whether the score holds, and see which hands swing to unseen angles past the training length. <a href=\"/playground/rope/\">RoPE rotation clock →</a>",
  },

  { type: "hr" },

  { type: "h2", ko: "1. 어텐션은 순서를 모른다", en: "1. Attention doesn't know order" },
  {
    type: "p",
    s: [
      { ko: "<a href=\"/blog/attention-why/\">어텐션</a>은 단어 쌍마다 Q와 K의 내적으로 점수를 냅니다.", en: "<a href=\"/blog/attention-why/\">Attention</a> scores each pair of words with a dot product of Q and K." },
      { ko: "이 계산에는 단어가 몇 번째에 있는지가 들어가지 않습니다.", en: "Nothing in that calculation says where a word sits." },
      { ko: "\"개가 사람을 물었다\"와 \"사람이 개를 물었다\"는 같은 단어 묶음으로 보입니다.", en: "\"The dog bit the man\" and \"the man bit the dog\" look like the same bag of words." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "그래서 위치 정보를 어딘가에 넣어야 합니다.", en: "So position has to be put in somewhere." },
      { ko: "문제는 어떻게 넣느냐입니다.", en: "The question is how." },
    ],
  },

  { type: "h2", ko: "2. 첫 해법 — 위치 벡터를 더한다", en: "2. The first fix — add a position vector" },
  {
    type: "p",
    s: [
      { ko: "2017년 트랜스포머는 위치마다 사인·코사인 값으로 만든 벡터를 단어 벡터에 더했습니다.", en: "The 2017 Transformer added a vector of sines and cosines for each position to the word vector." },
      { ko: "BERT와 GPT-2는 위치 벡터 자체를 학습했습니다. BERT는 512칸, GPT-2는 1,024칸입니다.", en: "BERT and GPT-2 learned the position vectors instead: 512 slots for BERT, 1,024 for GPT-2." },
      { ko: "학습한 칸이 끝나면 그 뒤 위치를 나타낼 벡터가 없습니다.", en: "Past the last learned slot, there is no vector for the next position." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "더하는 방식에는 문제가 하나 더 있습니다. 같은 두 단어라도 문장 어디에 있느냐에 따라 점수가 달라집니다.", en: "Adding has one more problem. The same two words score differently depending on where they sit in the text." },
      { ko: "\"개가\"와 \"물었다\"를 두 칸 간격으로 두고, 앞에 단어를 끼워 위치만 밀어 봤습니다.", en: "We put \"dog\" and \"bit\" two tokens apart and slid them along by inserting words in front." },
    ],
  },
  {
    type: "code",
    code: "$ score --pair 개가,물었다 --gap 2         # base 10,000, d=128\n  positions      added (2017)    RoPE\n  3 and 5        55.738          0.3830\n  103 and 105    57.091          0.3830\n  5003 and 5005  61.640          0.3830\n  5 and 3        55.899          0.2032   # order flipped",
  },
  {
    type: "p",
    s: [
      { ko: "더하는 방식은 위치를 밀 때마다 점수가 움직입니다. RoPE는 그대로입니다.", en: "With adding, the score moves every time the pair slides. With RoPE, it stays put." },
      { ko: "그렇다고 RoPE가 순서를 무시하는 건 아닙니다. 앞뒤를 바꾸면 점수가 달라집니다.", en: "That doesn't mean RoPE ignores order. Swap the two and the score changes." },
    ],
  },

  { type: "h2", ko: "3. RoPE — 더하지 말고 돌린다", en: "3. RoPE — rotate instead of add" },
  {
    type: "p",
    s: [
      { ko: "RoPE는 Q와 K 벡터의 숫자를 두 개씩 짝지어 평면 위의 점으로 봅니다.", en: "RoPE pairs up the numbers in the Q and K vectors and treats each pair as a point on a plane." },
      { ko: "그리고 위치가 m이면 그 점을 m × θ만큼 돌립니다.", en: "At position m, it rotates that point by m × θ." },
      { ko: "두 벡터를 똑같이 돌리면 내적은 변하지 않습니다. 내적은 둘 사이의 각도에만 달려 있기 때문입니다.", en: "Rotating two vectors by the same amount leaves their dot product unchanged. A dot product depends only on the angle between them." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "위치 m의 Q와 위치 n의 K를 비교하면 남는 건 (m − n) × θ만큼의 각도 차이입니다.", en: "Compare Q at position m with K at position n, and what remains is an angle difference of (m − n) × θ." },
      { ko: "그래서 점수는 \"몇 칸 떨어졌나\"만 압니다. 문장 맨 앞이든 5,000번째든 같습니다.", en: "So the score only knows \"how far apart.\" At the start of the text or at token 5,000, it's the same." },
      { ko: "벡터 길이도 그대로라 단어의 의미는 건드리지 않습니다.", en: "The vector's length doesn't change either, so the word's meaning is left alone." },
    ],
  },

  { type: "h2", ko: "4. 바늘이 여러 개인 이유", en: "4. Why there are many hands" },
  {
    type: "p",
    s: [
      { ko: "짝마다 도는 속도 θ가 다릅니다. 시계의 초침·분침·시침과 비슷합니다.", en: "Each pair turns at a different speed θ, like the second, minute, and hour hands of a clock." },
      { ko: "가장 빠른 바늘은 6.3토큰마다 한 바퀴를 돕니다. 바로 옆 단어를 구별하는 데 씁니다.", en: "The fastest hand turns once every 6.3 tokens. It tells neighbors apart." },
      { ko: "가장 느린 바늘은 base가 10,000일 때 54,410토큰에 한 바퀴입니다. 먼 거리를 구별합니다.", en: "With base 10,000, the slowest hand takes 54,410 tokens per turn. It tells long distances apart." },
    ],
  },
  {
    type: "code",
    code: "$ rope --wavelengths --head-dim 128       # tokens per turn\n  base         fastest   slowest      used by\n  10,000       6.3       54,410       Llama 2, DeepSeek-V3 (64-dim slice)\n  500,000      6.3       2,559,196    Llama 3.1\n  1,000,000    6.3       5,063,256    Qwen3, Mixtral",
  },
  {
    type: "p",
    s: [
      { ko: "base를 키우면 느린 바늘이 더 느려집니다. 더 먼 거리까지 서로 다른 각도로 구별할 수 있습니다.", en: "Raise the base and the slow hands get slower, so they can tell apart even longer distances." },
      { ko: "최근 모델일수록 base가 큰 이유입니다.", en: "That's why newer models use bigger bases." },
    ],
  },

  { type: "h2", ko: "5. 계보", en: "5. Lineage" },
  {
    type: "list",
    items: [
      { ko: "<strong>2017</strong> 원조 트랜스포머. 사인·코사인 위치 벡터를 더함. base 10,000이 여기서 나왔습니다.", en: "<strong>2017</strong> The original Transformer adds sine/cosine position vectors. The base of 10,000 comes from here." },
      { ko: "<strong>2018~2019</strong> BERT·GPT-2. 위치 벡터를 학습. 칸 수가 곧 최대 길이였습니다.", en: "<strong>2018–2019</strong> BERT and GPT-2 learn the position vectors. The number of slots is the maximum length." },
      { ko: "<strong>2021</strong> Su 등, RoFormer 논문에서 RoPE 제안. 같은 해 EleutherAI의 GPT-J가 채택했습니다.", en: "<strong>2021</strong> Su et al. propose RoPE in the RoFormer paper. EleutherAI's GPT-J adopts it the same year." },
      { ko: "<strong>2021</strong> ALiBi. 위치 벡터 없이 거리만큼 점수를 깎는 다른 길. BLOOM이 썼습니다.", en: "<strong>2021</strong> ALiBi takes another road: no position vectors, just a penalty proportional to distance. BLOOM used it." },
      { ko: "<strong>2022</strong> PaLM이 RoPE를 씀.", en: "<strong>2022</strong> PaLM uses RoPE." },
      { ko: "<strong>2023</strong> LLaMA가 RoPE를 쓰면서 이후 공개 모델 대부분이 따라갔습니다.", en: "<strong>2023</strong> LLaMA uses RoPE, and most open models after it follow." },
    ],
  },

  { type: "h2", ko: "6. 학습 길이를 넘으면", en: "6. Past the training length" },
  {
    type: "p",
    s: [
      { ko: "느린 바늘 중 일부는 학습하는 동안 한 바퀴도 못 돕니다.", en: "Some of the slow hands never complete a single turn during training." },
      { ko: "모델은 그 바늘의 각도를 일부 범위에서만 봤습니다. 학습보다 긴 글을 넣으면 처음 보는 각도가 나옵니다.", en: "The model has seen only part of those hands' range. Feed it text longer than training and they reach angles it has never seen." },
      { ko: "학습 길이 이후에 성능이 갑자기 무너지는 주된 이유 중 하나로 꼽힙니다.", en: "This is considered one of the main reasons performance collapses past the training length." },
    ],
  },
  {
    type: "code",
    code: "$ rope --unfinished                       # hands that never finish a turn within training length\n  Llama 2 7B     base 10K   train 4K     18 / 64\n  Llama 3.1 8B   base 500K  train 8K     29 / 64\n  Qwen3-8B       base 1M    train 32K    24 / 64\n  DeepSeek-V3    base 10K   train 4K      9 / 32",
  },
  {
    type: "p",
    s: [
      { ko: "그래서 긴 문맥 기법은 대부분 바늘 속도를 조절합니다.", en: "So most long-context techniques adjust the speed of the hands." },
    ],
  },
  {
    type: "list",
    items: [
      { ko: "<strong>위치 보간(2023, Meta)</strong>: 모든 바늘을 같은 비율로 늦춰, 긴 글이 학습 때 본 각도 안에 들어오게 합니다. 대신 가까운 단어 구별이 흐려집니다.", en: "<strong>Position Interpolation (2023, Meta)</strong>: slow every hand by the same ratio so long text fits inside the angles seen in training. Nearby words get harder to tell apart." },
      { ko: "<strong>YaRN(2023)</strong>: 빠른 바늘은 두고 느린 바늘만 늦춥니다. DeepSeek-V3는 4K로 학습한 뒤 YaRN으로 128K까지 늘렸습니다.", en: "<strong>YaRN (2023)</strong>: leave the fast hands, slow only the slow ones. DeepSeek-V3 trained at 4K, then used YaRN to reach 128K." },
      { ko: "<strong>Llama 3.1(2024)</strong>: 같은 발상입니다. 한 바퀴가 2,048토큰보다 짧은 바늘은 그대로 두고, 8,192토큰보다 긴 바늘은 8배 늦춥니다. 그 사이는 섞습니다.", en: "<strong>Llama 3.1 (2024)</strong>: the same idea. Hands with a turn shorter than 2,048 tokens stay as they are; hands longer than 8,192 are slowed 8×; the ones in between are blended." },
    ],
  },
  {
    type: "callout",
    tone: "warn",
    ko: "속도만 바꾼다고 긴 글을 잘 읽게 되지는 않습니다. Llama 3.1과 DeepSeek-V3 모두 바꾼 설정으로 긴 글을 추가로 학습했습니다. 바늘 조절은 처음 보는 각도를 줄여 주고, 추가 학습이 그 각도를 쓰는 법을 가르칩니다.",
    en: "Changing the speeds alone doesn't make a model read long text well. Both Llama 3.1 and DeepSeek-V3 trained further on long text with the new settings. Adjusting the hands cuts down unseen angles; the extra training teaches the model to use them.",
  },

  { type: "h2", ko: "7. 정리", en: "7. Wrap-up" },
  {
    type: "p",
    s: [
      { ko: "위치를 더하던 방식은 \"몇 번째\"를 알려 줬습니다. RoPE는 \"몇 칸 떨어졌나\"를 알려 줍니다.", en: "Adding positions told the model \"which slot.\" RoPE tells it \"how far apart.\"" },
      { ko: "문장의 뜻은 대개 절대 위치보다 거리에 달려 있어서 이쪽이 잘 맞았습니다.", en: "Meaning usually depends more on distance than on absolute place, so this fit better." },
      { ko: "다음 편은 층을 깊게 쌓아도 학습이 버티게 만든 부품들입니다. Pre-norm, RMSNorm, SwiGLU를 봅니다.", en: "Next up: the parts that keep training stable as layers stack deep — Pre-norm, RMSNorm, and SwiGLU." },
    ],
  },

  {
    type: "sources",
    html: "<h3>출처 · Sources</h3><ul><li>Vaswani et al., <a href=\"https://arxiv.org/abs/1706.03762\">Attention Is All You Need</a> (2017) — sinusoidal positions, base 10,000</li><li>Devlin et al., <a href=\"https://arxiv.org/abs/1810.04805\">BERT</a> (2018) · <a href=\"https://huggingface.co/google-bert/bert-base-uncased/blob/main/config.json\">config</a> — 512 positions</li><li>OpenAI GPT-2 <a href=\"https://huggingface.co/openai-community/gpt2/blob/main/config.json\">config</a> — n_positions 1024</li><li>Su et al., <a href=\"https://arxiv.org/abs/2104.09864\">RoFormer: Enhanced Transformer with Rotary Position Embedding</a> (2021)</li><li>Press, Smith, Lewis, <a href=\"https://arxiv.org/abs/2108.12409\">Train Short, Test Long (ALiBi)</a> (2021)</li><li>Chowdhery et al., <a href=\"https://arxiv.org/abs/2204.02311\">PaLM</a> (2022)</li><li>Touvron et al., <a href=\"https://arxiv.org/abs/2302.13971\">LLaMA</a> (2023)</li><li>Chen et al., <a href=\"https://arxiv.org/abs/2306.15595\">Extending Context Window of Large Language Models via Positional Interpolation</a> (2023)</li><li>Peng et al., <a href=\"https://arxiv.org/abs/2309.00071\">YaRN</a> (2023)</li><li>Llama Team, <a href=\"https://arxiv.org/abs/2407.21783\">The Llama 3 Herd of Models</a> (2024) · <a href=\"https://huggingface.co/unsloth/Meta-Llama-3.1-8B/blob/main/config.json\">config</a> — rope_theta 500,000, llama3 scaling factor 8</li><li>DeepSeek-AI, <a href=\"https://arxiv.org/abs/2412.19437\">DeepSeek-V3 Technical Report</a> (2024) · <a href=\"https://huggingface.co/deepseek-ai/DeepSeek-V3/blob/main/config.json\">config</a> — YaRN factor 40, qk_rope_head_dim 64</li><li><a href=\"https://huggingface.co/Qwen/Qwen3-8B/blob/main/config.json\">Qwen3-8B config</a> · <a href=\"https://huggingface.co/mistralai/Mixtral-8x7B-v0.1/blob/main/config.json\">Mixtral config</a> — rope_theta 1,000,000</li><li>계산 코드: <a href=\"/lab/rope.js\">/lab/rope.js</a></li></ul>",
  },
];
