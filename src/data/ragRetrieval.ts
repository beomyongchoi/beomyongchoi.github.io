import type { BiBlock } from "./aiParadox";

// Measured 2026-10-13 against public/lab/rag-index.json (373 chunks, 21 posts) with
// multilingual-e5-small q8 — identical in Node (scripts) and the browser lab.
export const blocks: BiBlock[] = [
  {
    type: "callout",
    tone: "tldr",
    ko: "<strong>결론부터.</strong> RAG의 답은 <strong>검색이 찾아온 문단</strong>보다 좋아질 수 없습니다. 키워드 검색은 같은 <em>글자</em>를, 임베딩 검색은 같은 <em>뜻</em>을 찾습니다. 이 블로그 글로 실험해 보니 둘 다 한 번씩 엉뚱한 걸 1위에 올렸습니다. 점수 대신 <strong>순위만 섞는 하이브리드(RRF)</strong>가 두 경우 모두 정답을 2위 안으로 끌어올렸습니다.",
    en: "<strong>The short version.</strong> A RAG answer can't be better than <strong>the passages retrieval brings back</strong>. Keyword search finds the same <em>characters</em>; embedding search finds the same <em>meaning</em>. Tested on this blog's posts, each put the wrong thing first once. <strong>A hybrid that merges ranks, not scores (RRF)</strong> pulled the right answer into the top 2 both times.",
  },

  {
    type: "p",
    s: [
      { ko: "LLM은 제 블로그 글을 모릅니다.", en: "An LLM doesn't know my blog posts." },
      { ko: "그래서 질문이 오면 관련 문단을 먼저 찾아 프롬프트에 붙여 줍니다.", en: "So when a question comes in, you first find the relevant passages and paste them into the prompt." },
      { ko: "이게 <strong>RAG(Retrieval-Augmented Generation)</strong>입니다.", en: "That's <strong>RAG (Retrieval-Augmented Generation)</strong>." },
      { ko: "생성(G)은 모델이 알아서 하지만, 검색(R)이 엉뚱한 문단을 가져오면 모델은 엉뚱한 근거로 그럴듯하게 답합니다.", en: "Generation (G) is the model's job, but if retrieval (R) brings the wrong passage, the model answers plausibly from the wrong evidence." },
      { ko: "이번 글은 R만 뜯어봅니다. 재료는 이 블로그 자신입니다.", en: "This post takes apart R alone, using this blog itself as the corpus." },
    ],
  },

  {
    type: "callout",
    tone: "tip",
    ko: "같은 질문을 세 가지 검색에 동시에 던져 보세요. 키워드 검색은 바로 되고, 의미 검색은 모델(약 120MB)을 받으면 켜집니다. <a href=\"/playground/rag/\">이 블로그에 물어보기 →</a>",
    en: "Throw the same question at all three searches at once. Keyword search works right away; semantic search turns on after a ~120 MB model download. <a href=\"/playground/rag/\">Ask this blog →</a>",
  },

  { type: "hr" },

  { type: "h2", ko: "1. 인덱스 — 글을 소제목 단위로 자른다", en: "1. The index — cut posts at their headings" },
  {
    type: "p",
    s: [
      { ko: "글 21편을 소제목마다 잘랐습니다. 600자가 넘는 절은 문장 경계에서 한 번 더 잘랐습니다.", en: "I cut 21 posts at every heading, splitting any section over 600 characters at a sentence boundary." },
      { ko: "한국어와 영어를 따로 넣어 조각은 모두 <strong>373개</strong>입니다.", en: "Korean and English go in separately, for <strong>373 chunks</strong> in total." },
      { ko: "소제목 단위로 자르면 검색 결과가 글의 그 절로 바로 연결됩니다.", en: "Cutting at headings means every result can deep-link to its section." },
      { ko: "<a href=\"/blog/query-fanout/\">AI 답변 엔진이 문서를 통째로 읽지 않는다</a>는 글에서 본 문단 단위 검색을 직접 만든 셈입니다.", en: "It's a hand-built version of the passage-level retrieval from <a href=\"/blog/query-fanout/\">AI answer engines don't read pages whole</a>." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "각 조각은 다국어 임베딩 모델 <strong>multilingual-e5-small</strong>로 384차원 벡터가 됩니다.", en: "Each chunk becomes a 384-dimensional vector via the multilingual embedding model <strong>multilingual-e5-small</strong>." },
      { ko: "이 모델은 문서 앞에 <code>passage:</code>, 질문 앞에 <code>query:</code>를 붙이도록 학습됐습니다. 모델 카드는 빼면 성능이 떨어진다고 적어 둡니다.", en: "It was trained with <code>passage:</code> before documents and <code>query:</code> before questions; the model card warns that dropping them degrades performance." },
      { ko: "조각 임베딩은 빌드할 때 미리 계산해 두고, 브라우저는 질문 한 줄만 임베딩합니다.", en: "Chunk embeddings are precomputed at build time; the browser only embeds your one-line question." },
      { ko: "이 글 자체는 인덱스에서 뺐습니다. 아래 테스트 질문을 그대로 인용하고 있어서, 넣었더니 키워드 검색이 이 글을 1위로 올렸습니다. 평가 질문이 문서에 섞이면 결과가 오염됩니다.", en: "This post itself is left out of the index. It quotes the test questions below verbatim, and when I included it, keyword search ranked this post #1. Let eval questions leak into the corpus and the results are contaminated." },
    ],
  },

  { type: "h2", ko: "2. 키워드 검색 — 같은 글자를 찾는다", en: "2. Keyword search — same characters" },
  {
    type: "p",
    s: [
      { ko: "<strong>BM25</strong>는 질문의 단어가 조각에 얼마나 자주, 얼마나 드물게 나오는지로 점수를 매깁니다.", en: "<strong>BM25</strong> scores a chunk by how often the query's words appear in it and how rare those words are overall." },
      { ko: "한국어는 형태소 분석기 대신 두 글자씩 잘라(bigram) 셉니다. \"역전파\"는 \"역전\"과 \"전파\"가 됩니다.", en: "For Korean I skip a morphological analyzer and count two-character bigrams: \"역전파\" becomes \"역전\" and \"전파\"." },
      { ko: "문제는 같은 뜻을 다른 글자로 쓸 때입니다.", en: "The trouble starts when the same meaning is written with different characters." },
    ],
  },
  {
    type: "code",
    code: "$ ask \"학습률이 너무 크면 어떻게 되나요\"\n  keyword   1. 경사하강 › 결론부터                     13.78\n            2. 샘플링 › top-k — 개수로 자르면…           10.86   ✗\n  semantic  1. 경사하강 › 결론부터                     0.878\n            2. 경사하강 › learning rate — 보폭이 운명을…  0.862   ✓",
  },
  {
    type: "p",
    s: [
      { ko: "경사하강 글은 \"학습률\" 대신 \"learning rate\"라고 씁니다.", en: "The gradient-descent post says \"learning rate,\" not \"학습률.\"" },
      { ko: "키워드 검색은 질문과 글자가 일부 겹친 샘플링 글을 2위에 올렸습니다.", en: "Keyword search put the sampling post second, on partial character overlap with the question." },
      { ko: "임베딩은 두 표현이 같은 뜻인 걸 알고 learning rate 절을 2위로 찾았습니다.", en: "The embedding knows the two terms mean the same thing and found the learning-rate section at #2." },
    ],
  },

  { type: "h2", ko: "3. 의미 검색 — 같은 뜻을 찾는다, 늘 그렇진 않다", en: "3. Semantic search — same meaning, not always" },
  {
    type: "p",
    s: [
      { ko: "그럼 임베딩이면 충분할까요? 반대 사례도 나왔습니다.", en: "So is embedding enough? The opposite case showed up too." },
    ],
  },
  {
    type: "code",
    code: "$ ask \"모델이 학습 데이터를 통째로 외워 버리면?\"\n  semantic  1. BERT › MLM — 15%를 가리고 맞힌다         0.872   ✗\n            2. 경사하강 › 결론부터                     0.870   ✗\n            3. 손실 › 손실은 가중치 위의 지형이다          0.867   ✗\n  keyword   1. 실전 › 과적합 — train은 내려가는데…        15.43   ✓",
  },
  {
    type: "p",
    s: [
      { ko: "\"외워 버린다\"는 과적합을 설명하는 말이지만, 그 절에는 \"과적합\"과 \"외우기\"라는 단어로 쓰여 있습니다.", en: "\"Memorizes\" describes overfitting, but that section phrases it as \"overfitting\" and \"memorizing.\"" },
      { ko: "작은 다국어 모델은 이 연결을 놓쳤고, 상위 세 개가 모두 빗나갔습니다.", en: "The small multilingual model missed the link; its top three all missed." },
      { ko: "키워드 검색은 \"학습\", \"데이터\" 같은 글자가 겹친 덕에 과적합 절을 1위로 찾았습니다.", en: "Keyword search found the overfitting section first, thanks to overlapping characters like \"학습\" (training) and \"데이터\" (data)." },
      { ko: "임베딩은 마법이 아닙니다. 모델 크기와 학습 데이터만큼만 뜻을 압니다.", en: "Embeddings aren't magic: they know meaning only as well as their size and training data allow." },
    ],
  },

  { type: "h2", ko: "4. 점수는 확률이 아니다", en: "4. Scores aren't probabilities" },
  {
    type: "p",
    s: [
      { ko: "첫 질문의 의미 검색 점수를 보면 1위 0.878, 10위 0.851, 373개 중 꼴찌가 0.732입니다.", en: "For the first question, the semantic scores run: #1 0.878, #10 0.851, last of 373 at 0.732." },
      { ko: "1위와 10위가 0.03도 안 벌어집니다. 0.87이 \"87% 맞다\"는 뜻이 아닙니다.", en: "#1 and #10 are less than 0.03 apart. 0.87 does not mean \"87% right.\"" },
      { ko: "BM25 점수는 13.78처럼 전혀 다른 눈금을 씁니다.", en: "BM25 uses a completely different scale — 13.78, say." },
      { ko: "그래서 두 점수를 그냥 더하면 BM25가 다 이깁니다.", en: "So if you simply add the two scores, BM25 wins every time." },
    ],
  },

  { type: "h2", ko: "5. 하이브리드 — 점수 말고 순위를 섞는다", en: "5. Hybrid — merge ranks, not scores" },
  {
    type: "p",
    s: [
      { ko: "<strong>RRF(Reciprocal Rank Fusion)</strong>는 점수를 버리고 순위만 씁니다.", en: "<strong>RRF (Reciprocal Rank Fusion)</strong> throws away the scores and keeps only the ranks." },
      { ko: "각 목록에서 r위인 조각에 <code>1 / (60 + r)</code>를 주고 더합니다. 60은 흔히 쓰는 상수입니다.", en: "A chunk at rank r in each list gets <code>1 / (60 + r)</code>, summed across lists. 60 is the commonly used constant." },
      { ko: "Cormack 등이 2009년 SIGIR에서 이 단순한 방법이 더 복잡한 순위 결합보다 낫다고 보고했습니다.", en: "Cormack et al. reported at SIGIR 2009 that this simple method beats more complex rank-fusion schemes." },
    ],
  },
  {
    type: "list",
    items: [
      { ko: "\"학습률\" 질문: 하이브리드 2위가 learning rate 절입니다. 키워드 쪽의 샘플링 오답은 밀려났습니다.", en: "The \"학습률\" (learning rate) question: hybrid #2 is the learning-rate section; keyword's sampling miss got pushed down." },
      { ko: "\"외워 버리면\" 질문: 하이브리드 2위가 과적합 절입니다. 의미 검색 혼자서는 상위 3위 안에 못 넣었습니다.", en: "The \"memorizes\" question: hybrid #2 is the overfitting section — semantic search alone couldn't get it into the top 3." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "어느 한쪽이 확실히 맞히면, 다른 쪽이 틀려도 그 조각은 위로 올라옵니다.", en: "When either side clearly gets it, that chunk rises even if the other side misses." },
      { ko: "둘 다 애매하게 걸친 조각도 올라옵니다. 그래서 1위가 늘 정답은 아닙니다. 두 번째 질문의 1위는 여전히 손실 글이었습니다.", en: "Chunks that both sides half-like rise too, so #1 isn't always right — the second question's #1 was still the loss post." },
    ],
  },

  { type: "h2", ko: "6. 실무에서는", en: "6. In practice" },
  {
    type: "list",
    items: [
      { ko: "<strong>기본값은 하이브리드</strong>로 둡니다. 고유명사·숫자·코드는 키워드가, 바꿔 말한 질문은 임베딩이 잡습니다.", en: "<strong>Default to hybrid.</strong> Keywords catch proper nouns, numbers, and code; embeddings catch paraphrased questions." },
      { ko: "<strong>자르는 단위가 검색 품질</strong>입니다. 소제목 하나가 자기 완결적인 답이 되게 쓰면, 사람도 검색기도 그 절만 읽고 이해합니다.", en: "<strong>How you chunk is retrieval quality.</strong> Write each section as a self-contained answer, and both people and retrievers can understand it alone." },
      { ko: "상위 몇 개를 질문과 함께 한 번 더 채점하는 <strong>리랭커</strong>를 붙이는 게 보통 다음 단계입니다.", en: "The usual next step is a <strong>reranker</strong> that rescores the top few together with the question." },
    ],
  },
  {
    type: "callout",
    tone: "warn",
    ko: "이 실험은 글 21편, 질문 몇 개짜리입니다. 키워드와 임베딩 중 무엇이 낫다는 일반 결론이 아니라, 둘이 <em>다르게</em> 틀린다는 걸 보여주는 사례로 읽어 주세요. 실험실에서 직접 질문을 바꿔 보면 반례가 금방 나옵니다.",
    en: "This is 21 posts and a handful of questions. Read it not as a verdict on keyword vs. embedding, but as a case showing they fail <em>differently</em>. Change the questions in the lab and counterexamples turn up fast.",
  },

  { type: "hr" },
  {
    type: "sources",
    html: "<h3>출처 · Sources</h3><ul><li>Cormack, Clarke &amp; Buettcher, <a href=\"https://doi.org/10.1145/1571941.1572114\">Reciprocal rank fusion outperforms Condorcet and individual rank learning methods</a>, SIGIR 2009</li><li><a href=\"https://huggingface.co/intfloat/multilingual-e5-small\">intfloat/multilingual-e5-small</a> — model card (query:/passage: prefixes)</li><li>인덱스·검색 코드: <a href=\"/lab/rag.js\">/lab/rag.js</a> · <a href=\"/lab/rag-index.json\">/lab/rag-index.json</a></li></ul>",
  },
];
