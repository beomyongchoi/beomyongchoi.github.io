// Work / portfolio data. Company name (KaiCore) is intentionally omitted.
// All external clients are anonymized (construction client → "A", hotels → "Hotel Group").
type L = { ko: string; en: string };

export interface ProjectMetric {
  label: L;
  value: string;
}

export interface ProjectDetail {
  problem: L;
  approach: L[];
  result: L[];
}

export interface Project {
  slug: string;
  title: L;
  summary: L;
  role: L;
  stack: string[];
  metrics?: ProjectMetric[];
  featured?: boolean;
  detail?: ProjectDetail;
}

export const projects: Project[] = [
  {
    slug: "hotel-group-aeo",
    title: { ko: "호텔 그룹 AEO 운영", en: "Hotel Group AEO" },
    summary: {
      ko: "6개 호텔의 AI 검색 노출을 정기적으로 측정하고 개선하는 프로젝트입니다. Gemini·ChatGPT·Claude·Perplexity 네 개 AI에서 노출을 재고, 안 잡히는 질문에는 콘텐츠를 만들어 발행한 뒤 다시 측정합니다. 측정·발행·재측정을 반복하는 구조를 직접 운영합니다.",
      en: "Regularly measuring and improving AI-search visibility for six hotels. I check how they surface across Gemini, ChatGPT, Claude, and Perplexity, write and publish content for the questions they miss, then measure again — a measure, publish, remeasure loop I run end to end.",
    },
    role: { ko: "측정 · 콘텐츠 · 인프라", en: "Measurement, content & infra" },
    stack: ["AEO Platform", "WordPress Multisite", "Cloudflare", "GCP Cloud Run", "GA4"],
    metrics: [
      { label: { ko: "측정 쿼리", en: "Queries" }, value: "110" },
      { label: { ko: "AI 엔진 / 언어", en: "Engines / langs" }, value: "4 / 3" },
      { label: { ko: "운영 호텔", en: "Hotels" }, value: "6" },
    ],
    featured: true,
    detail: {
      problem: {
        ko: "호텔은 이제 네이버·구글만이 아니라 ChatGPT·Perplexity에서도 검색됩니다. 그런데 AI가 어떤 호텔을 추천하는지, 뭐라고 말하는지는 아무도 측정하지 않았습니다.",
        en: "Hotels now get discovered inside ChatGPT and Perplexity, not just Naver and Google. But nobody was measuring which hotels the AIs recommend, or what they say about them.",
      },
      approach: [
        {
          ko: "네 개 AI에서 6개 호텔의 노출을 정기적으로 측정합니다. 고객 유형(가족·비즈니스·외국인)과 언어(한·일·영)를 나눠 질문을 던져, 어느 관점에서 안 보이는지까지 봅니다.",
          en: "I measure visibility for six hotels across four AIs on a schedule — splitting questions by guest type (family, business, foreign travelers) and language (Korean, Japanese, English) to see exactly where they're invisible.",
        },
        {
          ko: "노출이 약한 질문을 찾아 콘텐츠 초안을 만들고, 사람이 검수한 뒤 발행합니다. 자동 생성만 믿지 않고 사람이 한 번 거릅니다.",
          en: "For the weak spots, I draft content, have a human review it, and publish. Nothing goes out on autopilot — a person always checks it.",
        },
        {
          ko: "발행한 콘텐츠가 실제로 AI 노출과 방문을 늘렸는지 GA4로 추적하고, 다시 측정합니다.",
          en: "Then I track whether the published content actually lifted AI visibility and traffic in GA4, and measure again.",
        },
      ],
      result: [
        {
          ko: "한 사이클에 110개 질문 × 4개 엔진 × 3개 언어를 측정합니다.",
          en: "One cycle covers 110 questions × 4 engines × 3 languages.",
        },
        {
          ko: "측정→발행→재측정 루프를 6개월째 실제로 돌리고 있습니다.",
          en: "The measure–publish–remeasure loop has been running for six months.",
        },
        {
          ko: "호텔별 대시보드에서 점수·트렌드·콘텐츠 성과를 실시간으로 확인합니다.",
          en: "A per-hotel dashboard shows scores, trends, and content performance in real time.",
        },
      ],
    },
  },
  {
    slug: "aeo-platform",
    title: { ko: "AEO 측정 플랫폼", en: "AEO Measurement Platform" },
    summary: {
      ko: "여러 AI 답변엔진을 동시에 호출해 브랜드가 얼마나 노출되는지 재는 엔진입니다. 브랜드명을 감춘 질문과 드러낸 질문을 나눠 정직한 기준값을 만들고, 페르소나별로 점수를 나눕니다. 호텔·건설사 같은 실제 고객에 씁니다.",
      en: "The engine behind that work. It queries multiple AI answer engines at once to measure how a brand surfaces, splits brand-hidden from brand-shown questions for an honest baseline, and breaks scores down by persona. Used with real clients in hospitality and construction.",
    },
    role: { ko: "설계 · 개발", en: "Design & build" },
    stack: ["FastAPI", "LangGraph", "Next.js", "LLM APIs", "MySQL"],
    featured: true,
    detail: {
      problem: {
        ko: "AEO 툴들은 브랜드명을 넣은 질문으로 점수를 부풀리기 쉽습니다. '진짜' 노출을 재려면 방법부터 달라야 합니다.",
        en: "It's easy for AEO tools to inflate scores by asking questions that already include the brand name. Measuring real visibility takes a different method.",
      },
      approach: [
        {
          ko: "브랜드명을 감춘 질문(Type A)과 드러낸 질문(Type B)을 분리해, 부풀리지 않은 기준값을 만듭니다.",
          en: "I separate brand-hidden questions (Type A) from brand-shown ones (Type B) to get a baseline that isn't inflated.",
        },
        {
          ko: "질문 생성 → 여러 AI 동시 호출 → 인용·발언 평가 → 출처 분석 → 사실 검증 → 점수화까지 LangGraph로 파이프라인을 짰습니다.",
          en: "I built the pipeline in LangGraph: generate questions → query several AIs at once → evaluate citations and claims → analyze sources → fact-check → score.",
        },
        {
          ko: "페르소나별로 점수를 쪼개, 어떤 고객 관점에서 브랜드가 안 보이는지 짚습니다.",
          en: "Scores break down by persona, so you can see which type of customer the brand is invisible to.",
        },
      ],
      result: [
        {
          ko: "Gemini·OpenAI·Claude·Perplexity 호출을 배치로 묶어 측정 비용을 낮췄습니다.",
          en: "Batching the Gemini, OpenAI, Claude, and Perplexity calls cut the cost per measurement.",
        },
        {
          ko: "호텔·건설사 등 실제 고객 운영에 쓰이고 있습니다.",
          en: "It's in production use with real clients in hospitality and construction.",
        },
      ],
    },
  },
  {
    slug: "hotel-saas",
    title: { ko: "호텔 운영 SaaS", en: "Hotel Operations SaaS" },
    summary: {
      ko: "여러 호텔을 운영하는 사업자를 위한 대시보드입니다. 운영사부터 직원까지 4단계 권한으로 나뉘고, OTA 리뷰와 랭킹을 자동으로 모읍니다. Claude로 리뷰 답변을 만들고, 호텔별 AEO 점수도 여기서 봅니다.",
      en: "A dashboard for operators running several hotels. Four permission levels from operator to staff, auto-collected OTA reviews and rankings, review replies drafted with Claude, and per-hotel AEO scores in one place.",
    },
    role: { ko: "풀스택 개발", en: "Full-stack" },
    stack: ["Next.js", "Fastify", "Prisma", "MySQL", "Claude API"],
    detail: {
      problem: {
        ko: "여러 호텔을 운영하는 사업자는 매출·리뷰·랭킹을 호텔마다 흩어진 채로 봅니다. 한눈에 비교할 곳이 없습니다.",
        en: "Operators running multiple hotels see revenue, reviews, and rankings scattered per property. There's no single place to compare them.",
      },
      approach: [
        {
          ko: "운영사–호텔그룹–호텔–직원 4단계 권한 구조 위에 하나의 대시보드로 묶었습니다.",
          en: "I unified everything into one dashboard on a four-level permission model: operator → hotel group → hotel → staff.",
        },
        {
          ko: "OTA 리뷰와 랭킹을 자동으로 수집하고, Claude로 리뷰 답변 초안을 만듭니다.",
          en: "It auto-collects OTA reviews and rankings, and drafts review replies with Claude.",
        },
      ],
      result: [
        {
          ko: "매출·근태·이슈 리포트와 AI 지표(리뷰·AEO 점수)를 한 화면에서 봅니다.",
          en: "Revenue, attendance, and issue reports sit next to AI metrics (reviews, AEO scores) on one screen.",
        },
      ],
    },
  },
  {
    slug: "aeo-report-a",
    title: { ko: "A건설 AEO 리포트", en: "AEO Report — Company A" },
    summary: {
      ko: "국내 대형 건설사를 대상으로 AI 검색 노출을 진단한 리포트입니다. 네 개 AI에서 노출과 브랜드 방어를 측정하고, AI가 인용하는 출처와 잘못 아는 사실을 짚었습니다.",
      en: "A diagnostic report for a large Korean construction company. I measured visibility and brand defense across four AIs, and flagged the sources they cite and the facts they get wrong.",
    },
    role: { ko: "측정 · 리포팅", en: "Measurement & reporting" },
    stack: ["AEO Platform", "Source Attribution", "Fact Check"],
    detail: {
      problem: {
        ko: "국내 대형 건설사가 AI 답변엔진에서 어떻게 노출되는지, 어떤 오정보가 도는지 알고 싶어 했습니다.",
        en: "A large construction company wanted to know how it shows up in AI answer engines, and what misinformation was circulating.",
      },
      approach: [
        {
          ko: "네 개 AI에서 노출과 브랜드 방어를 측정하고, AI가 인용하는 출처를 분류했습니다.",
          en: "I measured visibility and brand defense across four AIs and classified the sources they cite.",
        },
        {
          ko: "AI가 잘못 아는 사실(예: 본사 위치 오류)을 찾아냈습니다.",
          en: "I found facts the AIs got wrong — for example, a wrong headquarters location.",
        },
      ],
      result: [
        {
          ko: "노출·브랜드방어·종합 점수를 페르소나별로 정리해 리포트로 전달했습니다.",
          en: "Delivered a report with visibility, brand-defense, and overall scores broken down by persona.",
        },
        {
          ko: "고칠 우선순위(오정보 정정, 스키마·FAQ 추가 등)를 함께 제시했습니다.",
          en: "It came with a prioritized fix list — correct the misinformation, add schema and FAQs, and so on.",
        },
      ],
    },
  },
];
