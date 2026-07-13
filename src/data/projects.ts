// Work / portfolio data. Company name (KaiCore) is intentionally omitted.
// The construction client is anonymized as "A"; AZMT is shown by name.
export interface ProjectMetric {
  label: { ko: string; en: string };
  value: string;
}

export interface Project {
  slug: string;
  title: { ko: string; en: string };
  summary: { ko: string; en: string };
  role: { ko: string; en: string };
  stack: string[];
  metrics?: ProjectMetric[];
  featured?: boolean;
}

export const projects: Project[] = [
  {
    slug: "azmt-hotel-aeo",
    title: { ko: "AZMT 호텔 AEO 운영", en: "AZMT Hotel AEO" },
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
  },
  {
    slug: "aeo-platform",
    title: { ko: "AEO 측정 플랫폼", en: "AEO Measurement Platform" },
    summary: {
      ko: "여러 AI 답변엔진을 동시에 호출해 브랜드가 얼마나 노출되는지 재는 엔진입니다. 브랜드명을 감춘 질문과 드러낸 질문을 나눠 정직한 기준값을 만들고, 페르소나별로 점수를 나눕니다. AZMT와 A건설 같은 실제 고객에 씁니다.",
      en: "The engine behind that work. It queries multiple AI answer engines at once to measure how a brand surfaces, splits brand-hidden from brand-shown questions for an honest baseline, and breaks scores down by persona. Used with real clients like AZMT and Company A.",
    },
    role: { ko: "설계 · 개발", en: "Design & build" },
    stack: ["FastAPI", "LangGraph", "Next.js", "LLM APIs", "MySQL"],
    featured: true,
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
  },
];
