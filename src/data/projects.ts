// Work / portfolio data. Company name (KaiCore) is intentionally omitted;
// the client construction company is anonymized as "A".
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
    slug: "aeo-platform",
    title: {
      ko: "AI 답변엔진 가시성 측정 플랫폼 (AEO)",
      en: "AEO — AI Answer-Engine Visibility Platform",
    },
    summary: {
      ko: "ChatGPT·Gemini·Claude·Perplexity 등 여러 AI 답변엔진을 동시에 호출해, 브랜드가 얼마나·어떻게 노출되는지 측정하는 분석 플랫폼입니다. 브랜드명을 숨긴 쿼리(Type A)와 포함한 쿼리(Type B)를 분리해 신뢰할 수 있는 베이스라인을 만들고, 페르소나별로 점수를 분해합니다.",
      en: "An analytics platform that queries multiple AI answer engines (ChatGPT, Gemini, Claude, Perplexity) at once to measure how a brand surfaces. It splits brand-anonymous (Type A) from brand-aware (Type B) queries for an honest baseline, and breaks scores down by persona.",
    },
    role: { ko: "설계·개발 (백엔드·AI 파이프라인)", en: "Design & build (backend + AI pipeline)" },
    stack: ["FastAPI", "LangGraph", "Next.js", "LLM APIs", "MySQL"],
    featured: true,
  },
  {
    slug: "aeo-case-study",
    title: {
      ko: "A건설 AEO 케이스 스터디",
      en: "AEO Case Study — Construction Company A",
    },
    summary: {
      ko: "국내 대형 건설사 A를 대상으로 AEO 측정 방법론을 실제 적용한 사례입니다. 4개 AI 엔진에서 자발적 노출과 브랜드 방어를 측정하고, AI가 인용하는 출처 분석·사실 오류(할루시네이션) 검출·미노출 질문에 대한 콘텐츠 초안까지 제공했습니다.",
      en: "A real-world application of the AEO methodology for a large Korean construction company (anonymized as “A”). I measured spontaneous visibility and brand defense across four AI engines, analyzed which sources the AIs cite, detected factual hallucinations, and delivered content drafts for the questions where the brand wasn't surfacing.",
    },
    role: { ko: "방법론 설계·측정·리포팅", en: "Methodology, measurement & reporting" },
    stack: ["AEO Platform", "Source Attribution", "Hallucination Detection", "Persona Analysis"],
    metrics: [
      { label: { ko: "GEO 종합 점수", en: "Overall GEO score" }, value: "27.4 → 29.3" },
      { label: { ko: "측정 AI 엔진", en: "AI engines measured" }, value: "4" },
      { label: { ko: "분석한 인용 출처", en: "Cited sources analyzed" }, value: "343" },
    ],
    featured: true,
  },
  {
    slug: "hotel-saas",
    title: { ko: "호텔 운영 관리 SaaS", en: "Hotel Operations SaaS" },
    summary: {
      ko: "여러 호텔을 운영하는 사업자를 위한 멀티테넌트 대시보드입니다. 운영사–호텔그룹–호텔–직원의 4단계 권한 구조 위에서 OTA 리뷰·랭킹을 자동 수집하고 매출·근태 리포트를 관리합니다. Claude API로 리뷰 답변을 생성하고 AEO 랭킹도 함께 측정합니다.",
      en: "A multi-tenant dashboard for operators running several hotels. On a four-level permission model (operator → hotel group → hotel → staff), it auto-collects OTA reviews and rankings and manages revenue/attendance reports. It drafts review replies with the Claude API and tracks AEO rankings too.",
    },
    role: { ko: "풀스택 개발", en: "Full-stack development" },
    stack: ["Next.js", "Fastify", "Prisma", "MySQL", "Docker", "Claude API"],
  },
  {
    slug: "content-infra",
    title: { ko: "AI 친화 콘텐츠 발행 인프라", en: "AI-Friendly Content Publishing Infra" },
    summary: {
      ko: "SEO·AEO 자산을 한 도메인에 집중시키는 멀티사이트 콘텐츠 인프라입니다. 하나의 도메인 아래 하위경로(subpath) 구조로 여러 사이트를 운영하고 Nginx 리버스 프록시로 라우팅하며, Cloudflare의 AI 크롤러 제어와 Content Signals를 적용해 AI 답변엔진이 콘텐츠를 잘 수집하도록 설계했습니다.",
      en: "A multi-site content infrastructure that concentrates SEO/AEO assets on one domain. It runs several sites under a single domain via a subpath structure routed through an Nginx reverse proxy, and applies Cloudflare's AI crawler controls and Content Signals so answer engines can ingest the content cleanly.",
    },
    role: { ko: "인프라 설계·운영", en: "Infra design & operations" },
    stack: ["GCP", "Docker", "Nginx", "WordPress Multisite", "Cloudflare"],
  },
];
