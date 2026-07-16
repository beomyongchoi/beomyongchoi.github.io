// Aligned KO/EN content for the interactive bilingual "글자가 어떻게 벡터가 되나 —
// 토큰화와 임베딩" post (Series 0편 · on-ramp). Paragraphs are split into SENTENCES
// so each sentence is a click target that reveals its counterpart. Text may contain
// simple inline HTML (<strong>,<code>,<a>).

import type { BiBlock } from "./aiParadox";

export const blocks: BiBlock[] = [
  {
    type: "callout",
    tone: "tldr",
    ko: "<strong>결론부터.</strong> 모델은 텍스트를 그대로 다루지 못합니다. 그래서 <strong>글자 → 토큰 → ID → 벡터</strong> 순으로 바꿉니다. 앞의 셋은 규칙 적용과 표 조회이고, 학습되는 건 마지막 임베딩 행렬 하나입니다. 이 벡터가 시리즈 전체의 출발 재료입니다.",
    en: "<strong>The short version.</strong> A model can't work with text directly. So it converts <strong>characters → tokens → IDs → vectors</strong>. The first three steps are rule application and a table lookup; the only thing learned is that final embedding matrix. This vector is the raw material the whole series starts from.",
  },

  {
    type: "p",
    s: [
      { ko: "이 글은 시리즈의 <strong>0편</strong>입니다.", en: "This is <strong>part 0</strong> of the series." },
      { ko: "\"글자가 어떻게 벡터가 되는가\"만 다룹니다.", en: "It covers one thing: how characters become vectors." },
      { ko: "어텐션도 트랜스포머도 아직 필요 없습니다.", en: "You don't need attention or transformers yet." },
    ],
  },

  { type: "h2", ko: "1. 먼저 글자를 토큰으로 쪼갠다", en: "1. First, split text into tokens" },
  {
    type: "p",
    s: [
      { ko: "모델은 텍스트를 그대로 다루지 않습니다.", en: "A model doesn't handle text as-is." },
      { ko: "먼저 <strong>토큰</strong>이라는 작은 단위로 쪼갭니다.", en: "It first splits text into small units called <strong>tokens</strong>." },
      { ko: "토큰은 대개 단어 하나가 아니라 <strong>서브워드</strong>입니다.", en: "A token is usually not a whole word but a <strong>subword</strong>." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "왜 단어 통째가 아니라 조각일까요.", en: "Why pieces instead of whole words?" },
      { ko: "조각(글자·바이트)까지 내려가면 표현하지 못할 단어가 없기 때문입니다.", en: "Because once you go down to pieces (characters, bytes), there's no word you can't represent." },
      { ko: "그래서 어휘에 없는 단어(<strong>OOV</strong>, out-of-vocabulary)를 만나도 조각의 조합으로 표현합니다.", en: "So even a word not in the vocabulary (<strong>OOV</strong>, out-of-vocabulary) gets built from a combination of pieces." },
      { ko: "덤으로 어근과 접미사 같은 형태소가 자동으로 갈립니다.", en: "As a bonus, morphemes like roots and suffixes get separated automatically." },
    ],
  },

  {
    type: "p",
    s: [
      { ko: "이 쪼개는 규칙을 만드는 대표적 방법이 <strong>BPE</strong>(byte pair encoding)입니다.", en: "The classic way to build these splitting rules is <strong>BPE</strong> (byte pair encoding)." },
      { ko: "가장 자주 함께 나오는 쌍을 반복해서 병합해 어휘를 만듭니다.", en: "It repeatedly merges the most frequently co-occurring pair to build a vocabulary." },
      { ko: "핵심은 <strong>이 병합이 단계적으로 쌓인다</strong>는 점입니다.", en: "The key is that <strong>these merges stack up in stages</strong>." },
      { ko: "첫 라운드는 문자·바이트 쌍을 병합하고, 이후 라운드는 이미 병합된 조각(심볼) 쌍을 다시 병합합니다.", en: "The first round merges character or byte pairs; later rounds merge pairs of already-merged pieces (symbols)." },
      { ko: "그래서 <code>to</code>+<code>ken</code> 같은 여러 글자짜리 조각이 하나의 토큰으로 굳습니다.", en: "That's how multi-character pieces like <code>to</code>+<code>ken</code> harden into a single token." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "여기서 \"흔한 단어=한 토큰, 드문 단어=여러 조각\"이 나옵니다.", en: "This is where \"common word = one token, rare word = several pieces\" comes from." },
      { ko: "자주 등장하는 조합일수록 하나의 토큰으로 승격되어 통째로 살아남습니다.", en: "The more often a combination appears, the sooner it gets promoted to one token and survives whole." },
      { ko: "드문 조합은 끝까지 병합되지 않아 여러 조각으로 남습니다.", en: "Rare combinations never get merged, so they stay as multiple pieces." },
      { ko: "예를 들어 <code>tokenization</code>은 <code>token</code>과 <code>ization</code>으로 갈립니다.", en: "For example, <code>tokenization</code> splits into <code>token</code> and <code>ization</code>." },
    ],
  },

  { type: "code", code: `\"tokenization\"
   │  BPE merge rules (character pairs first, then symbol pairs)
   ▼
[\"token\", \"ization\"]     # common stem + suffix
   │  look up each piece in the vocabulary
   ▼
[30001, 1634]            # token IDs (integers), GPT-2 vocabulary` },

  {
    type: "p",
    s: [
      { ko: "GPT-2가 쓰는 <strong>바이트 레벨 BPE</strong>는 여기서 한 겹 더 견고합니다.", en: "The <strong>byte-level BPE</strong> that GPT-2 uses is one layer sturdier." },
      { ko: "256개 바이트를 모두 어휘에 넣어, 어떤 언어·문자·이모지든 바이트로 조각낼 수 있습니다.", en: "It puts all 256 bytes in the vocabulary, so any language, script, or emoji can be broken into byte pieces." },
      { ko: "OOV가 \"무엇이든\" 표현되는 진짜 근거가 이 바이트 백오프입니다.", en: "This byte fallback is the real reason OOV can represent \"anything.\"" },
    ],
  },

  { type: "h2", ko: "2. 토큰마다 번호를 붙인다 — 어휘와 토큰 ID", en: "2. Number every token — vocabulary and token IDs" },
  {
    type: "p",
    s: [
      { ko: "쪼갠 토큰마다 정수 번호를 붙입니다.", en: "Each split token gets an integer number." },
      { ko: "이게 <strong>토큰 ID</strong>입니다.", en: "That's the <strong>token ID</strong>." },
      { ko: "번호를 붙일 수 있는 토큰의 전체 목록이 <strong>어휘</strong>(vocabulary)입니다.", en: "The full list of tokens you can number is the <strong>vocabulary</strong>." },
      { ko: "어휘 크기는 대략 1만~10만 사이입니다.", en: "Vocabulary size is roughly between 10,000 and 100,000." },
    ],
  },
  {
    type: "list",
    items: [
      { ko: "<strong>GPT-2</strong>: 50,257개 (바이트 256 + 병합 50,000 + 특수 토큰 1)", en: "<strong>GPT-2</strong>: 50,257 (256 bytes + 50,000 merges + 1 special token)" },
      { ko: "<strong>BERT</strong>: 30,522개 (WordPiece, BPE의 변형)", en: "<strong>BERT</strong>: 30,522 (WordPiece, a BPE variant)" },
      { ko: "<strong>GPT-4</strong>: 100,000개 이상", en: "<strong>GPT-4</strong>: 100,000+" },
    ],
  },
  {
    type: "callout",
    tone: "warn",
    ko: "토큰 ID는 <strong>임의의 번호</strong>일 뿐, 아직 의미가 없습니다. ID가 <code>1634</code>라고 <code>30001</code>보다 \"작은 뜻\"인 게 아닙니다. 번호가 가깝다고 뜻이 가까운 것도 아닙니다. 의미는 다음 단계인 임베딩에서 자리잡습니다.",
    en: "A token ID is just an <strong>arbitrary number</strong> — it carries no meaning yet. ID <code>1634</code> doesn't mean \"less\" than <code>30001</code>. Nearby numbers don't mean nearby meanings. Meaning settles in at the next step, the embedding.",
  },

  { type: "h2", ko: "3. 토큰 ID를 벡터로 바꾼다 — 임베딩 룩업", en: "3. Turn token IDs into vectors — the embedding lookup" },
  {
    type: "p",
    s: [
      { ko: "<strong>임베딩</strong>은 각 토큰 ID를 벡터로 바꾸는 <strong>룩업</strong>입니다.", en: "The <strong>embedding</strong> is a <strong>lookup</strong> that turns each token ID into a vector." },
      { ko: "<code>어휘크기 × d_model</code> 모양의 큰 행렬에서, 해당 ID의 <strong>한 행</strong>을 그대로 꺼내옵니다.", en: "From a big matrix of shape <code>vocab_size × d_model</code>, it pulls out the <strong>one row</strong> for that ID." },
      { ko: "<strong>d_model</strong>은 임베딩 벡터의 차원 수이고, 모델이 정하는 하이퍼파라미터입니다(GPT-2는 768).", en: "<strong>d_model</strong> is the number of dimensions in the embedding vector — a hyperparameter each model chooses (GPT-2 uses 768)." },
    ],
  },

  { type: "code", code: `Embedding matrix  (vocab_size × d_model  =  50,257 × 768)
┌────────────────────────────────────────────┐
│ ID     0  →  [ 0.02, -0.51, ...,  0.13 ]     │
│ ...                                          │
│ ID  1634  →  [-0.33,  0.19, ...,  0.02 ]  ←  \"ization\"
│ ...                                          │
│ ID 30001  →  [ 0.21, -0.08, ...,  0.44 ]  ←  \"token\"
│ ...                                          │
└────────────────────────────────────────────┘
   each row = one 768-dim vector (d_model = 768)` },

  {
    type: "p",
    s: [
      { ko: "이 행렬은 처음엔 <strong>랜덤</strong>입니다.", en: "This matrix starts out <strong>random</strong>." },
      { ko: "학습(역전파)이 돌면서 각 행의 숫자가 조금씩 조정됩니다.", en: "As training (backpropagation) runs, the numbers in each row get nudged little by little." },
      { ko: "그렇게 <strong>학습이 끝난 임베딩</strong>에서 비로소 의미가 자리잡습니다.", en: "It's only in the <strong>trained embedding</strong> that meaning finally settles in." },
      { ko: "크기를 감으로 잡아봅시다.", en: "Let's get a feel for the scale." },
      { ko: "GPT-2는 50,257 × 768이라, 이 행렬 하나만 약 <strong>3,860만 파라미터</strong>입니다.", en: "GPT-2's is 50,257 × 768, so this one matrix alone is about <strong>38.6 million parameters</strong>." },
    ],
  },

  { type: "h2", ko: "4. 왜 벡터인가 — 의미가 기하가 된다", en: "4. Why vectors — meaning becomes geometry" },
  {
    type: "p",
    s: [
      { ko: "토큰을 벡터로 놓는 순간, 의미 관계가 <strong>기하 관계</strong>로 바뀝니다.", en: "The moment you place tokens as vectors, meaning relationships become <strong>geometric</strong> ones." },
      { ko: "비슷한 뜻이면 벡터가 가깝게 자리 잡습니다.", en: "Similar meanings sit close together as vectors." },
      { ko: "유사도는 보통 <strong>코사인 유사도</strong>로 잽니다.", en: "Similarity is usually measured with <strong>cosine similarity</strong>." },
      { ko: "두 벡터가 이루는 각도가 좁을수록 비슷하다고 봅니다.", en: "The narrower the angle between two vectors, the more similar they are." },
      { ko: "크기(길이)는 무시하고 방향만 보기 때문에, 유클리드 거리와는 다릅니다.", en: "It ignores magnitude (length) and looks only at direction, which makes it different from Euclidean distance." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "이 기하적 성질을 처음 극적으로 보여준 게 <strong>word2vec</strong>입니다.", en: "The work that first showed off this geometric property dramatically was <strong>word2vec</strong>." },
      { ko: "가장 유명한 예가 벡터 산술입니다.", en: "Its most famous example is vector arithmetic." },
    ],
  },

  { type: "code", code: `king − man + woman  ≈  queen

# observed in word2vec / GloVe style STATIC embeddings
# meaning differences are encoded as directions in the space` },

  {
    type: "p",
    s: [
      { ko: "<code>king</code>에서 <code>man</code> 방향을 빼고 <code>woman</code> 방향을 더하면 <code>queen</code> 근처에 도착합니다.", en: "Subtract the <code>man</code> direction from <code>king</code> and add the <code>woman</code> direction, and you land near <code>queen</code>." },
      { ko: "의미의 차이가 <strong>벡터의 방향</strong>으로 담겨 있다는 뜻입니다.", en: "It means the difference in meaning is stored as a <strong>direction</strong> in vector space." },
    ],
  },
  {
    type: "callout",
    tone: "tip",
    ko: "이 등식은 word2vec·GloVe 같은 <strong>정적 임베딩</strong>에서 관찰된 성질입니다. 트랜스포머의 입력 임베딩도 같은 종류의 벡터 공간이라 비슷한 기하가 나타나지만, 이렇게 깔끔하게 성립한다고 보장된 것은 아닙니다. 여기서는 \"의미가 방향으로 담긴다\"는 직관만 가져가면 충분합니다.",
    en: "This equation is a property observed in <strong>static embeddings</strong> like word2vec and GloVe. A transformer's input embedding is the same kind of vector space, so similar geometry shows up — but it isn't guaranteed to hold this cleanly. Here, the intuition \"meaning is stored as direction\" is all you need to take away.",
  },
  {
    type: "p",
    s: [
      { ko: "쪼개짐과 좌표는 눈으로 보면 훨씬 빠릅니다.", en: "Splitting and coordinates click much faster when you see them." },
      { ko: "단어가 서브워드로 갈라지고, 비슷한 단어가 한곳에 모이고, king − man + woman이 queen을 가리키는 장면을 직접 만져볼 수 있습니다.", en: "You can watch words break into subwords, similar words cluster together, and king − man + woman point at queen." },
      { ko: "<a href=\"/playground/embeddings/\">임베딩 공간 만져보기 →</a> (word2vec 임베딩 기반)", en: "<a href=\"/playground/embeddings/\">Play with the embedding space →</a> (built on word2vec embeddings)" },
    ],
  },

  { type: "h2", ko: "5. 여기가 헷갈립니다 — 이 벡터는 아직 \"정적\"이다", en: "5. Here's the confusing part — this vector is still \"static\"" },
  {
    type: "p",
    s: [
      { ko: "가장 오해하기 쉬운 지점입니다.", en: "This is the easiest point to misread." },
      { ko: "입력 임베딩(룩업)은 <strong>정적</strong>입니다.", en: "The input embedding (the lookup) is <strong>static</strong>." },
      { ko: "같은 토큰 ID면 문장이 무엇이든 <strong>같은 출발 벡터</strong>를 꺼냅니다.", en: "For the same token ID, whatever the sentence, you pull out the <strong>same starting vector</strong>." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "예를 들어 <code>bank</code>는 강둑이든 은행이든 <strong>똑같은 벡터</strong>로 시작합니다.", en: "For example, <code>bank</code> starts as the <strong>same vector</strong> whether it's a riverbank or a money bank." },
      { ko: "룩업 단계에는 문맥이 없기 때문입니다.", en: "That's because the lookup step has no context." },
      { ko: "그리고 방금 본 word2vec이 바로 이 정적 임베딩의 대표입니다.", en: "And the word2vec we just saw is the textbook example of this static embedding." },
      { ko: "즉 정적 임베딩은 <strong>의미는 담되 문맥은 담지 못합니다</strong>.", en: "In other words, a static embedding <strong>holds meaning but not context</strong>." },
    ],
  },
  {
    type: "callout",
    tone: "warn",
    ko: "정적 벡터 하나로는 <strong>다의어를 원리적으로 가르지 못합니다</strong>. <code>bank</code>의 강둑·은행 구분은 룩업에서 절대 생기지 않습니다. 이 한계가 바로 다음 편에서 문맥을 주입하는 이유입니다. \"정적 출발 → 문맥 반영\"의 순서를 헷갈리지 마세요.",
    en: "A single static vector <strong>can't disambiguate a polysemous word in principle</strong>. The riverbank-vs-money-bank split for <code>bank</code> never arises in the lookup. That limit is exactly why the next part injects context. Don't mix up the order: <strong>static start → contextual update</strong>.",
  },

  { type: "hr" },

  { type: "h2", ko: "다음 편으로 — 정적 벡터가 문맥을 얻는 과정", en: "On to part 1 — how a static vector gains context" },
  {
    type: "p",
    s: [
      { ko: "정리하면 흐름은 이렇습니다.", en: "To recap, the flow is this." },
      { ko: "<strong>글자 → 토큰 → ID → 정적 벡터</strong>.", en: "<strong>characters → tokens → IDs → static vector</strong>." },
      { ko: "이 토큰 임베딩 벡터가 모델이 실제로 계산하는 형태입니다.", en: "This token-embedding vector is the form the model actually computes on." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "그럼 <code>bank</code>의 두 뜻은 언제 갈릴까요.", en: "So when do the two senses of <code>bank</code> split apart?" },
      { ko: "이 정적 벡터가 뒤 층들을 지나며 <strong>문맥을 반영한 벡터</strong>로 바뀔 때입니다.", en: "It's when this static vector passes through later layers and becomes a <strong>context-aware vector</strong>." },
      { ko: "직관만 미리 말하면, 주변의 <code>river</code>나 <code>money</code> 같은 토큰 벡터가 섞여 들어와 <code>bank</code> 벡터를 한쪽으로 밀어줍니다.", en: "The intuition, in advance: nearby token vectors like <code>river</code> or <code>money</code> mix in and push the <code>bank</code> vector one way or the other." },
      { ko: "그 섞는 메커니즘이 바로 <strong>어텐션</strong>입니다.", en: "That mixing mechanism is exactly <strong>attention</strong>." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "연결 고리 하나만 미리 놓겠습니다.", en: "Let me lay down one connecting link in advance." },
      { ko: "이 토큰 임베딩 벡터는 <strong>위치 인코딩</strong>이 더해진 뒤, 어텐션의 <strong>Q·K·V</strong>가 계산되는 출발 재료가 됩니다.", en: "After a <strong>positional encoding</strong> is added, this token-embedding vector becomes the raw material from which attention's <strong>Q, K, V</strong> are computed." },
      { ko: "정적으로 시작한 벡터가 어떻게 문맥을 얻는지, \"it\"이 왜 \"cat\"을 가리키게 되는지는 1편에서 이어집니다.", en: "How a vector that started static gains context, and why \"it\" comes to point at \"cat,\" continues in part 1." },
      { ko: "<a href=\"/blog/attention-why/\">1편: 어텐션은 궁합 계산이다 →</a>", en: "<a href=\"/blog/attention-why/\">Part 1: Attention is a compatibility calculation →</a>" },
    ],
  },

  {
    type: "sources",
    html: `<h3>출처 · Sources</h3>
<ul>
<li>Mikolov et al. (2013) — word2vec, vector arithmetic <code>king − man + woman ≈ queen</code> · <a href="https://arxiv.org/abs/1301.3781">Efficient Estimation of Word Representations in Vector Space</a></li>
<li>Sennrich et al. (2016) — BPE for NMT (subword units) · <a href="https://arxiv.org/abs/1508.07909">Neural Machine Translation of Rare Words with Subword Units</a></li>
<li>GPT-2 / BERT tokenizer docs — vocabulary sizes (50,257 / 30,522), byte-level BPE, WordPiece. Token IDs (<code>token</code> → 30001, <code>ization</code> → 1634) verified with the GPT-2 tokenizer.</li>
</ul>`,
  },
];
