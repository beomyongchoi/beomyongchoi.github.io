import type { BiBlock } from "./aiParadox";

// Cache sizes and "conversations that fit" come from public/lab/arch.js (kvBytesGroups, conversationsFit),
// pinned by scripts/lab-arch.check.mjs. Paper figures checked against arXiv abstracts/bodies 2026-10-16.
export const blocks: BiBlock[] = [
  {
    type: "callout",
    tone: "tldr",
    ko: "<strong>결론부터.</strong> 긴 대화의 병목은 계산보다 메모리, 그중에서도 <strong>KV 캐시</strong>입니다. 그래서 어텐션은 헤드마다 따로 들고 있던 K·V를 줄였습니다. 한 벌을 다 같이 쓰거나(MQA), 몇 헤드씩 묶어 쓰거나(GQA), 작은 벡터로 압축합니다(MLA). Llama 3.1 8B는 GQA 덕에 80GB GPU 하나에 32K 토큰 대화를 4개가 아니라 16개 올립니다.",
    en: "<strong>The short version.</strong> The bottleneck in long chats is memory more than compute — specifically the <strong>KV cache</strong>. So attention cut back on the K and V each head used to keep. Heads share one set (MQA), share in groups (GQA), or store a small compressed vector (MLA). Thanks to GQA, Llama 3.1 8B fits 16 conversations of 32K tokens on one 80 GB GPU instead of 4.",
  },

  {
    type: "p",
    s: [
      { ko: "<a href=\"/blog/evolution-map/\">0편 지도</a>에서 128K 토큰 대화 하나의 캐시를 계산했습니다.", en: "In <a href=\"/blog/evolution-map/\">Part 0, the map</a>, we computed the cache for one 128K-token conversation." },
      { ko: "Llama 3.1 8B가 16GB, DeepSeek-V3가 8.6GB였습니다.", en: "Llama 3.1 8B needed 16 GB; DeepSeek-V3 needed 8.6 GB." },
      { ko: "이번 편은 그 숫자가 어떻게 줄었는지 따라갑니다.", en: "This part follows how those numbers got so small." },
    ],
  },

  {
    type: "callout",
    tone: "tip",
    ko: "K·V 헤드 수를 직접 줄여 보며 캐시와 동시 대화 수를 계산할 수 있습니다. <a href=\"/playground/kv/\">KV 캐시 다이어트 →</a> · 오락실: <a href=\"/arcade/gpu/\">GPU 테트리스 →</a>",
    en: "You can shrink the number of K/V heads yourself and watch the cache and the number of concurrent chats change. <a href=\"/playground/kv/\">KV cache diet →</a> · Arcade: <a href=\"/arcade/gpu/\">GPU Tetris →</a>",
  },

  { type: "hr" },

  { type: "h2", ko: "1. 캐시는 토큰마다 쌓인다", en: "1. The cache grows with every token" },
  {
    type: "p",
    s: [
      { ko: "<a href=\"/blog/gpt-decoder/\">GPT는 토큰을 하나씩</a> 만듭니다.", en: "<a href=\"/blog/gpt-decoder/\">GPT generates one token at a time</a>." },
      { ko: "새 토큰은 앞의 모든 토큰의 K·V를 봐야 합니다.", en: "Each new token has to look at the K and V of every token before it." },
      { ko: "매번 다시 계산하면 느리니까 저장해 둡니다. 이게 KV 캐시입니다.", en: "Recomputing them every time is slow, so they're stored. That's the KV cache." },
    ],
  },
  {
    type: "code",
    code: "# bytes per token = 2 (K and V) × layers × kv_heads × head_dim × 2 (bf16)\n$ kv-cache llama-3.1-8b\n  2 × 32 × 8 × 128 × 2   = 131,072 bytes  = 128 KB per token\n  × 32,768 tokens         = 4 GB per conversation\n  × 131,072 tokens        = 16 GB per conversation",
  },
  {
    type: "p",
    s: [
      { ko: "가중치는 대화가 몇 개든 한 벌이면 됩니다.", en: "The weights are one copy no matter how many conversations there are." },
      { ko: "캐시는 대화마다, 토큰마다 따로 쌓입니다.", en: "The cache piles up separately for every conversation and every token." },
      { ko: "그래서 긴 문맥을 여러 사람이 동시에 쓰면 캐시가 가중치보다 커집니다.", en: "So when many people use long contexts at once, the cache outgrows the weights." },
    ],
  },

  { type: "h2", ko: "2. MQA — K·V 한 벌을 다 같이", en: "2. MQA — one K/V for everyone" },
  {
    type: "p",
    s: [
      { ko: "원래 어텐션(MHA)은 헤드마다 Q·K·V를 따로 가집니다.", en: "The original attention (MHA) gives every head its own Q, K, and V." },
      { ko: "2019년 Noam Shazeer는 질문을 바꿨습니다. 쿼리는 헤드마다 두고, K·V는 <strong>하나만</strong> 두면 어떨까?", en: "In 2019, Noam Shazeer asked a different question: keep a query per head, but only <strong>one</strong> K and V?" },
      { ko: "이게 Multi-Query Attention(MQA)입니다. 캐시가 헤드 수만큼 줄어듭니다.", en: "That's Multi-Query Attention (MQA). The cache shrinks by a factor of the head count." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "대가는 품질입니다.", en: "The price is quality." },
      { ko: "모든 헤드가 같은 K·V를 보니, 헤드마다 다른 관계를 잡던 표현력이 줄어듭니다.", en: "With every head looking at the same K and V, the heads lose some of their ability to track different relationships." },
    ],
  },

  { type: "h2", ko: "3. GQA — 몇 헤드씩 묶어서", en: "3. GQA — share in groups" },
  {
    type: "p",
    s: [
      { ko: "2023년 Ainslie 등은 중간을 택했습니다. 헤드를 몇 그룹으로 나누고 그룹마다 K·V 한 벌을 둡니다.", en: "In 2023, Ainslie et al. took the middle road: split the heads into groups, one K/V set per group." },
      { ko: "이름은 Grouped-Query Attention(GQA)입니다. 그룹이 헤드 수와 같으면 MHA, 1개면 MQA입니다.", en: "It's called Grouped-Query Attention (GQA). With as many groups as heads it's MHA; with one group it's MQA." },
      { ko: "논문은 품질은 MHA에 가깝고 속도는 MQA에 가깝다고 보고했습니다.", en: "The paper reports quality close to MHA and speed close to MQA." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "이미 학습한 MHA 모델도 바꿀 수 있습니다.", en: "You can even convert an MHA model that's already trained." },
      { ko: "같은 그룹 헤드들의 K·V 가중치를 평균 내 합치고, 원래 사전학습 계산량의 5%만 더 학습합니다.", en: "Average the K/V weights of the heads in each group, then train a bit more — 5% of the original pre-training compute." },
      { ko: "Llama 2는 34B·70B에 GQA를 썼고, Llama 3는 8B부터 K·V 헤드 8개를 씁니다.", en: "Llama 2 used GQA in its 34B and 70B models; Llama 3 uses 8 K/V heads starting at 8B." },
    ],
  },
  {
    type: "code",
    code: "$ fit --model llama-3.1-8b --gpu 80GB --ctx 32768   # weights 15 GB (bf16)\n  MHA   32 K/V heads   16 GB per chat     4 chats\n  GQA    8 K/V heads    4 GB per chat    16 chats   # what Llama 3.1 ships\n  MQA    1 K/V head   0.5 GB per chat   130 chats",
  },
  {
    type: "p",
    s: [
      { ko: "같은 GPU에 동시 대화가 4배 들어갑니다.", en: "Four times as many conversations on the same GPU." },
      { ko: "서비스 입장에선 GPU 비용이 그만큼 줄어듭니다.", en: "For a service, that's GPU cost cut by the same factor." },
      { ko: "MQA까지 가면 130개지만, 대부분 모델은 품질을 생각해 GQA에서 멈췄습니다.", en: "MQA would fit 130, but most models stopped at GQA to protect quality." },
    ],
  },

  { type: "h2", ko: "4. MLA — 나눠 쓰는 대신 압축", en: "4. MLA — compress instead of share" },
  {
    type: "p",
    s: [
      { ko: "2024년 DeepSeek-V2는 다른 길을 갔습니다. Multi-head Latent Attention(MLA)입니다.", en: "In 2024, DeepSeek-V2 took a different path: Multi-head Latent Attention (MLA)." },
      { ko: "헤드마다 K·V를 두되, 저장은 <strong>작은 잠재 벡터 하나</strong>로만 합니다.", en: "Every head still gets its own K and V, but only <strong>one small latent vector</strong> is stored." },
      { ko: "필요할 때 이 벡터에 행렬을 곱해 각 헤드의 K·V를 풀어냅니다.", en: "When needed, a matrix multiply unpacks it into each head's K and V." },
    ],
  },
  {
    type: "code",
    code: "$ kv-cache deepseek-v3 --per-token\n  MHA (128 heads × (128+64 key, 128 value))   4,880 KB\n  MLA (latent 512 + shared rope key 64)          69 KB   # 71× smaller\n  # Llama 3.1 8B with GQA: 128 KB — a 671B model caches less per token",
  },
  {
    type: "p",
    s: [
      { ko: "풀어내는 계산은 실제로는 거의 안 합니다.", en: "In practice, the unpacking barely costs anything." },
      { ko: "K를 푸는 행렬은 Q 쪽 행렬에, V를 푸는 행렬은 출력 행렬에 미리 곱해 합칠 수 있습니다.", en: "The matrix that unpacks K can be folded into the query weights, and the one for V into the output weights." },
      { ko: "그러면 어텐션이 압축 벡터 위에서 바로 돌아갑니다.", en: "Then attention runs directly on the compressed vector." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "걸림돌은 <a href=\"/blog/evolution-map/\">RoPE</a>였습니다.", en: "The snag was <a href=\"/blog/evolution-map/\">RoPE</a>." },
      { ko: "RoPE는 위치마다 다른 회전을 곱합니다. 그래서 행렬을 미리 합쳐 둘 수 없습니다.", en: "RoPE multiplies in a different rotation at every position, so the matrices can't be pre-merged." },
      { ko: "DeepSeek은 위치 정보만 따로 64차원 키 하나에 담아 모든 헤드가 같이 쓰게 했습니다.", en: "DeepSeek moved the position information into a separate 64-dimensional key that all heads share." },
      { ko: "V2 논문은 DeepSeek 67B 대비 KV 캐시를 93.3% 줄이고 최대 생성 처리량을 5.76배로 올렸다고 보고합니다.", en: "The V2 paper reports a 93.3% smaller KV cache and 5.76× the maximum generation throughput versus DeepSeek 67B." },
    ],
  },

  { type: "h2", ko: "5. 캐시 말고 계산 — FlashAttention·PagedAttention", en: "5. Beyond the cache — FlashAttention, PagedAttention" },
  {
    type: "p",
    s: [
      { ko: "구조를 안 바꾸고 줄이는 방법도 있습니다.", en: "There are also savings that don't touch the architecture." },
      { ko: "FlashAttention(2022)은 어텐션 점수 행렬 N×N을 GPU 메모리에 통째로 쓰지 않습니다.", en: "FlashAttention (2022) never writes the full N×N attention-score matrix to GPU memory." },
      { ko: "작은 타일로 잘라 빠른 칩 내부 메모리에서 끝냅니다. 근사가 아니라 결과가 똑같습니다.", en: "It works in small tiles inside fast on-chip memory, and the result is exact — not an approximation." },
      { ko: "논문은 GPT-2(길이 1K) 학습이 3배 빨라졌다고 보고합니다.", en: "The paper reports 3× faster GPT-2 training at sequence length 1K." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "vLLM의 PagedAttention(2023)은 캐시 자리를 미리 크게 잡아 두지 않습니다.", en: "vLLM's PagedAttention (2023) stops reserving big chunks of cache up front." },
      { ko: "운영체제의 페이지처럼 작은 블록 단위로 필요할 때 붙입니다.", en: "Like an operating system's pages, it allocates small blocks only as needed." },
      { ko: "같은 지연 시간에서 처리량이 기존 시스템의 2~4배였습니다.", en: "At the same latency, throughput was 2–4× that of earlier systems." },
    ],
  },
  {
    type: "callout",
    tone: "warn",
    ko: "위 \"동시 대화\" 숫자는 가중치와 KV 캐시만 센 상한입니다. 실제 서버는 중간 계산값과 메모리 조각화 때문에 이보다 적게 올립니다. 비교는 정확하지만 절대값은 낙관적입니다.",
    en: "The \"concurrent chats\" figures above count only weights and KV cache, so they're an upper bound. Real servers fit fewer because of activations and memory fragmentation. The comparison holds; the absolute numbers are optimistic.",
  },

  { type: "h2", ko: "정리", en: "Recap" },
  {
    type: "list",
    items: [
      { ko: "<strong>MHA</strong>: 헤드마다 K·V. 표현력 최대, 캐시 최대.", en: "<strong>MHA</strong>: K/V per head. Most expressive, biggest cache." },
      { ko: "<strong>MQA</strong>(2019): K·V 한 벌. 캐시 최소, 품질 손해.", en: "<strong>MQA</strong> (2019): one K/V. Smallest cache, some quality loss." },
      { ko: "<strong>GQA</strong>(2023): 그룹마다 한 벌. 지금 공개 모델의 표준. Llama 3.1 8B는 32→8.", en: "<strong>GQA</strong> (2023): one per group. Today's default in open models; Llama 3.1 8B goes 32→8." },
      { ko: "<strong>MLA</strong>(2024): 잠재 벡터로 압축 + 위치 키 분리. DeepSeek-V3는 MHA 대비 71배 작음.", en: "<strong>MLA</strong> (2024): compress into a latent, split off the position key. DeepSeek-V3's cache is 71× smaller than MHA." },
      { ko: "<strong>FlashAttention·PagedAttention</strong>: 구조는 그대로, 메모리를 덜 쓰는 계산과 할당.", en: "<strong>FlashAttention, PagedAttention</strong>: same architecture, leaner computation and allocation." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "다음 4편은 어텐션 옆의 FFN입니다.", en: "Part 4 turns to the FFN beside attention." },
      { ko: "671B 모델이 토큰마다 37B만 쓰는 MoE를 다룹니다.", en: "It covers MoE — how a 671B model uses only 37B per token." },
    ],
  },

  { type: "hr" },
  {
    type: "sources",
    html: "<h3>출처 · Sources</h3><ul><li>Shazeer, <a href=\"https://arxiv.org/abs/1911.02150\">Fast Transformer Decoding: One Write-Head is All You Need</a> (2019) — MQA</li><li>Ainslie et al., <a href=\"https://arxiv.org/abs/2305.13245\">GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints</a> (2023) — mean-pooled heads, 5% uptraining</li><li>Touvron et al., <a href=\"https://arxiv.org/abs/2307.09288\">Llama 2</a> (2023) — GQA in 34B and 70B · Llama Team, <a href=\"https://arxiv.org/abs/2407.21783\">The Llama 3 Herd of Models</a> (2024) — 8 KV heads</li><li>DeepSeek-AI, <a href=\"https://arxiv.org/abs/2405.04434\">DeepSeek-V2</a> (2024) — MLA, decoupled RoPE, KV cache −93.3%, 5.76× throughput</li><li>Dao et al., <a href=\"https://arxiv.org/abs/2205.14135\">FlashAttention</a> (2022) — exact, IO-aware; 3× GPT-2 training</li><li>Kwon et al., <a href=\"https://arxiv.org/abs/2309.06180\">Efficient Memory Management for LLM Serving with PagedAttention</a> (2023) — 2–4× throughput</li><li>config.json: <a href=\"https://huggingface.co/unsloth/Meta-Llama-3.1-8B/blob/main/config.json\">Llama 3.1 8B</a> · <a href=\"https://huggingface.co/deepseek-ai/DeepSeek-V3/blob/main/config.json\">DeepSeek-V3</a></li><li>계산 코드: <a href=\"/lab/arch.js\">/lab/arch.js</a></li></ul>",
  },
];
