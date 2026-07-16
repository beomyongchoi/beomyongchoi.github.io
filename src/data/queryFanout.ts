import type { BiBlock } from "./aiParadox";

export const blocks: BiBlock[] = [
  {
    type: "callout",
    tone: "tldr",
    ko: "<strong>결론부터.</strong> AI 답변 엔진은 페이지를 통째로 읽지 않습니다. 질문 하나를 여러 개의 하위 쿼리로 <strong>fan-out</strong>하고, 문서가 아니라 <strong>문단(passage) 단위</strong>로 검색·추출합니다. 그래서 인덱스에서 실제로 찾아지는 단위는 페이지가 아니라 문단입니다. 혼자 떼어놔도 말이 되고, 구체적 수치·고유명사를 담은 문단을 쓰세요.",
    en: "<strong>The short version.</strong> AI answer engines don't read a page top to bottom. They <strong>fan out</strong> a single question into several sub-queries and retrieve at the <strong>passage level</strong>, not the document level. So the unit that actually gets found in the index is a paragraph, not a page. Write paragraphs that stand on their own and carry concrete numbers and proper nouns.",
  },

  {
    type: "p",
    s: [
      { ko: "우리는 검색을 이렇게 상상합니다.", en: "We tend to picture search like this." },
      { ko: "질문을 넣으면 엔진이 관련 페이지를 찾고, 위에서 아래로 읽고, 답을 만든다.", en: "You type a question, the engine finds a relevant page, reads it top to bottom, and writes an answer." },
      { ko: "실제 동작은 다릅니다.", en: "The real behavior is different." },
      { ko: "<strong>질문이 쪼개지고, 문서도 쪼개집니다.</strong>", en: "<strong>The question gets split, and so does the document.</strong>" },
    ],
  },

  { type: "h2", ko: "Query fan-out — 질문 하나가 여러 개로 갈라진다", en: "Query fan-out — one question splits into many" },

  {
    type: "p",
    s: [
      { ko: "이건 은유가 아니라 실제로 돌아가는 기술입니다.", en: "This isn't a metaphor. It's a technique that actually runs in production." },
      { ko: "구글 AI Mode는 <strong>Query fan-out</strong>을 씁니다.", en: "Google's AI Mode uses <strong>query fan-out</strong>." },
      { ko: "커스텀 Gemini 2.5가 사용자 질문을 여러 개의 합성 하위 쿼리(subquery)로 분해합니다.", en: "A custom Gemini 2.5 breaks the user's question into several synthetic sub-queries." },
      { ko: "각 하위 쿼리는 웹과 지식그래프를 상대로 <strong>병렬 검색</strong>됩니다.", en: "Each sub-query runs a <strong>parallel search</strong> across the web and the knowledge graph." },
      { ko: "그렇게 모은 조각을 하나의 답으로 종합합니다.", en: "The engine then synthesizes those pieces into a single answer." },
    ],
  },

  {
    type: "p",
    s: [
      { ko: "예를 들어 \"소규모 팀에 쓸 만한 벡터 데이터베이스는?\"이라는 질문은 내부에서 대략 이렇게 갈라집니다.", en: "Take a question like \"which vector database is good for a small team?\" Internally it fans out roughly like this." },
    ],
  },

  {
    type: "code",
    code: "question: \"which vector DB for a small team?\"\n           │\n           ▼   query fan-out (Gemini 2.5)\n   ┌───────┼───────────────┬───────────────┐\n   ▼       ▼               ▼               ▼\n[sub 1]  [sub 2]        [sub 3]         [sub 4]\nopen-    query          self-host       managed\nsource   latency        ops burden &    tier\nlist &   at scale       memory need     pricing\nlicense\n   │       │               │               │\n   ▼       ▼               ▼               ▼\n  web / knowledge-graph search (parallel)\n   └───────┴───────┬───────┴───────────────┘\n                   ▼\n          one synthesized answer\n(each sub-query is matched against PASSAGES, not whole pages)",
  },

  {
    type: "callout",
    tone: "tip",
    ko: "직접 만져보며 읽으면 빠릅니다. 질문이 하위 쿼리로 쪼개지고, 구체적인 문단만 검색되고 형용사뿐인 문단은 걸러지는 걸 눈으로 보세요. <a href=\"/playground/fanout/\">Query Fan-out 시각화 →</a>",
    en: "It's faster to read with your hands. Watch a question fan out into sub-queries — specific paragraphs get retrieved and adjective-only ones get pruned. <a href=\"/playground/fanout/\">Query Fan-out visualizer →</a>",
  },

  {
    type: "p",
    s: [
      { ko: "핵심은 여기 있습니다.", en: "Here's the key point." },
      { ko: "엔진이 최종적으로 집어 오는 대상은 페이지 전체가 아니라 <strong>그 하위 쿼리에 정확히 답하는 문단</strong>입니다.", en: "What the engine ultimately pulls is not a whole page but <strong>the paragraph that precisely answers that sub-query</strong>." },
      { ko: "당신의 글은 이 하위 쿼리 중 하나에, 문단 하나로 걸립니다.", en: "Your writing gets caught on one of these sub-queries, as a single paragraph." },
    ],
  },

  { type: "h2", ko: "검색되는 단위는 문단이다 — RAG chunking과 같은 원칙", en: "The retrieval unit is the paragraph — the same principle as RAG chunking" },

  {
    type: "p",
    s: [
      { ko: "이건 새로운 이야기가 아닙니다.", en: "None of this is new." },
      { ko: "RAG 시스템을 만들어 본 사람에겐 익숙한 원칙입니다.", en: "Anyone who has built a RAG system already knows the principle." },
      { ko: "RAG는 문서 전체를 검색하지 않습니다.", en: "RAG doesn't retrieve whole documents." },
      { ko: "문서를 <strong>chunk(passage) 단위로 쪼개서</strong> 인덱싱하고, 질문과 가장 가까운 chunk만 꺼내옵니다.", en: "It indexes documents as <strong>chunks (passages)</strong> and pulls only the chunks closest to the query." },
    ],
  },

  {
    type: "p",
    s: [
      { ko: "이유는 단순합니다.", en: "The reason is simple." },
      { ko: "하위 쿼리 하나에 답하는 데 필요한 건 페이지 전체가 아니라 그중 몇 문단이기 때문입니다.", en: "Answering one sub-query needs a few paragraphs, not the entire page." },
      { ko: "관련된 문단만 정확히 골라 모델에 넣어야 노이즈가 줄고 답이 정확해집니다.", en: "Feeding the model only the relevant paragraphs cuts noise and sharpens the answer." },
    ],
  },

  {
    type: "p",
    s: [
      { ko: "그래서 chunking 베스트프랙티스는 이 지점을 명확히 합니다.", en: "That's why chunking best practices are explicit about this." },
      { ko: "좋은 chunk는 <strong>자기완결적(self-contained)</strong>이고, 의미적으로 완결되며, 구체적입니다.", en: "A good chunk is <strong>self-contained</strong>, semantically complete, and specific." },
      { ko: "예를 들어 표본 크기가 든 방법론 문단은, 그 문단만으로 \"몇 명을 조사했나\"라는 하위 쿼리에 답할 수 있습니다.", en: "For example, a methodology paragraph that states its sample size can answer the sub-query \"how many people were surveyed?\" on its own." },
      { ko: "그래서 그 문단은 인덱스에서 독립적으로 찾아지는 하나의 단위가 됩니다.", en: "So that paragraph becomes a unit that's found independently in the index." },
    ],
  },

  {
    type: "p",
    s: [
      { ko: "AI 답변 엔진이 웹 문단을 다루는 방식이 정확히 이겁니다.", en: "This is exactly how an AI answer engine treats web paragraphs." },
      { ko: "fan-out으로 나온 하위 쿼리 하나에 대해, 그에 답하는 self-contained 문단을 골라옵니다.", en: "For each fan-out sub-query, it selects the self-contained paragraph that answers it." },
    ],
  },

  { type: "h2", ko: "그래서 어떤 문단을 써야 하나", en: "So what kind of paragraph should you write" },

  {
    type: "p",
    s: [
      { ko: "정리하면, 검색되는 단위는 자기완결적이고 구체적인 문단입니다.", en: "To recap: the retrieved unit is a self-contained, specific paragraph." },
      { ko: "형용사만 늘어놓은 문단은 이 구조에서 불리합니다.", en: "A paragraph that's just a pile of adjectives loses in this structure." },
      { ko: "\"이 방법은 매우 효과적입니다\" 같은 문단은 떼어내는 순간 정보가 사라집니다.", en: "A paragraph like \"this method is highly effective\" carries no information the moment you lift it out." },
    ],
  },

  {
    type: "p",
    s: [
      { ko: "반대로 잘 검색되는 문단은 이렇습니다.", en: "Paragraphs that get retrieved well look like this instead." },
    ],
  },

  {
    type: "list",
    items: [
      { ko: "혼자 떼어놔도 말이 되는 문단. 앞 문단의 대명사·생략에 기대지 않고, 주어를 문단 안에 다시 넣는다.", en: "Stands on its own — it doesn't lean on a pronoun or omission from the previous paragraph, and it restates the subject inside the paragraph." },
      { ko: "구체적 <strong>수치</strong>를 담은 문단. 막연한 형용사 대신 실제 측정값을 적는다.", en: "Carries concrete <strong>numbers</strong> — actual measured values instead of vague adjectives." },
      { ko: "<strong>고유명사</strong>로 대상을 특정한 문단. 제품명·규격·버전을 적는다.", en: "Names things with <strong>proper nouns</strong> — product names, specs, versions." },
      { ko: "한 문단이 한 하위 쿼리에 대응하는 완결된 답이 되는 문단.", en: "Reads as one complete answer to one sub-query." },
    ],
  },

  {
    type: "p",
    s: [
      { ko: "이건 마케팅 요령이 아닙니다.", en: "This is not a marketing trick." },
      { ko: "<strong>retrieval 파이프라인이 문단 단위로 인덱싱한다는 사실</strong>에서 곧바로 따라 나오는 결론입니다.", en: "It follows directly from the fact that <strong>the retrieval pipeline indexes at the paragraph level</strong>." },
      { ko: "RAG의 chunking 원칙과 정확히 같은 말입니다.", en: "It's the same statement as RAG's chunking principle, word for word." },
    ],
  },

  { type: "h2", ko: "클릭이 사라지는 시대", en: "The era of vanishing clicks" },

  {
    type: "p",
    s: [
      { ko: "이 구조는 사용자 행동도 바꿉니다.", en: "This structure also changes user behavior." },
      { ko: "답이 검색 화면 안에서 끝나면 사용자는 클릭할 이유가 없습니다.", en: "When the answer ends inside the search screen, there's no reason to click." },
      { ko: "이게 zero-click입니다.", en: "That's zero-click." },
    ],
  },

  {
    type: "p",
    s: [
      { ko: "Pew Research(2025.7)에 따르면, AI 요약이 뜬 검색에선 일반 결과 클릭이 <strong>8%</strong>로 떨어집니다.", en: "Per Pew Research (July 2025), on searches that show an AI summary, clicks on regular results fall to <strong>8%</strong>." },
      { ko: "요약이 없을 때(15%)의 절반 수준입니다.", en: "That's about half the 15% seen without a summary." },
      { ko: "요약 안의 링크를 클릭하는 비율은 <strong>1%</strong>에 불과합니다.", en: "Clicks on the links inside the summary itself are just <strong>1%</strong>." },
    ],
  },

  {
    type: "p",
    s: [
      { ko: "Ahrefs는 AI Overview가 있으면 1위 페이지 CTR이 낮아진다고 봤습니다.", en: "Ahrefs found that an AI Overview lowers the click-through rate of the top-ranked page." },
      { ko: "초기 <strong>34.5%</strong> 하락으로 보고했고, 이후 <strong>58%</strong>로 갱신됐습니다.", en: "It initially reported a <strong>34.5%</strong> drop, later revised to <strong>58%</strong>." },
      { ko: "SparkToro(2024)는 미국 구글 검색의 약 <strong>58.5%</strong>가 클릭 없이 끝난다고 집계했습니다.", en: "SparkToro (2024) measured that about <strong>58.5%</strong> of U.S. Google searches end without a click." },
      { ko: "AI Overviews는 전체 검색의 20% 이상에 노출됩니다.", en: "AI Overviews appear on more than 20% of all searches." },
    ],
  },

  {
    type: "p",
    s: [
      { ko: "트래픽 관점에선 나쁜 소식입니다.", en: "From a traffic standpoint, that's bad news." },
      { ko: "하지만 검색이 사라지는 게 아니라 단위가 바뀌는 겁니다.", en: "But search isn't disappearing — the unit is shifting." },
      { ko: "페이지로 유입되던 게, 문단으로 인용되는 쪽으로 옮겨갑니다.", en: "What used to arrive as page visits now moves toward being cited as paragraphs." },
    ],
  },

  { type: "h2", ko: "정리", en: "Wrapping up" },

  {
    type: "p",
    s: [
      { ko: "AI 답변 엔진은 페이지를 읽지 않습니다.", en: "AI answer engines don't read pages." },
      { ko: "질문을 <strong>fan-out</strong>해 하위 쿼리를 만들고, <strong>passage 단위</strong>로 검색·추출해 종합합니다.", en: "They <strong>fan out</strong> the question into sub-queries, retrieve at the <strong>passage level</strong>, and synthesize." },
    ],
  },

  {
    type: "p",
    s: [
      { ko: "그러니 문단을 이렇게 쓰면 됩니다.", en: "So write your paragraphs this way." },
      { ko: "혼자 떼어놔도 말이 되고, 수치와 고유명사로 구체적인 문단.", en: "Self-contained, and specific with numbers and proper nouns." },
      { ko: "예전에는 \"잘 읽히는 글\"을 썼습니다.", en: "We used to write for readability." },
      { ko: "지금은 거기에 더해, <strong>각 문단이 혼자 검색되어 나가도 버티는 글</strong>을 써야 합니다.", en: "Now, on top of that, we have to write so that <strong>each paragraph holds up when it's retrieved alone</strong>." },
      { ko: "RAG가 찾기 좋은 단위가, 사람이 읽기에도 좋은 단위입니다.", en: "The unit that's easy for RAG to find is also the unit that's good for people to read." },
    ],
  },

  {
    type: "sources",
    html: "<h3>출처</h3><ul><li><a href=\"https://searchengineland.com/guide/query-fan-out\">Search Engine Land — Query fan-out guide</a></li><li><a href=\"https://www.searchenginejournal.com/query-fan-out-technique-in-ai-mode/552532/\">Search Engine Journal — Query Fan-Out Technique in AI Mode</a></li><li><a href=\"https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/\">Pew Research (2025.7) — Google users and AI summaries</a></li><li><a href=\"https://ahrefs.com/blog/ai-overviews-reduce-clicks/\">Ahrefs — AI Overviews reduce clicks</a></li><li><a href=\"https://sparktoro.com/blog/2024-zero-click-search-study-for-every-1000-us-google-searches-only-374-clicks-go-to-the-open-web-in-the-eu-its-360/\">SparkToro (2024) — Zero-click search study</a></li><li><a href=\"https://unstructured.io/blog/chunking-for-rag-best-practices\">Unstructured — Chunking for RAG best practices</a></li></ul>",
  },
];