// Resume data. Current employer name is omitted (shown as a stealth startup);
// past employers are public per the user's PDF resume.
type L = { ko: string; en: string };

export interface Job {
  company: L;
  period: string;
  role: L;
  current?: boolean;
  bullets: L[];
}

export interface SkillGroup {
  label: L;
  items: string[];
}

export const summary: L = {
  ko: "커머스와 물류에서 검색·데이터 파이프라인, 수만 동접 트래픽, AWS EKS 기반 MSA를 다뤄온 백엔드 엔지니어입니다. 지금은 AI 서비스와 AEO를 만듭니다.",
  en: "A backend engineer who's worked on search and data pipelines, high-traffic systems, and AWS EKS microservices across commerce and logistics. Now I build AI products and work on AEO.",
};

export const jobs: Job[] = [
  {
    company: { ko: "스텔스 스타트업", en: "Stealth startup" },
    period: "2025 – 현재",
    role: { ko: "AEO · 풀스택 엔지니어", en: "AEO & Full-stack Engineer" },
    current: true,
    bullets: [
      {
        ko: "여러 AI 답변엔진을 동시 분석하는 AEO 측정 플랫폼 설계·개발 (FastAPI, LangGraph)",
        en: "Designed and built an AEO measurement platform that analyzes multiple AI answer engines at once (FastAPI, LangGraph)",
      },
      {
        ko: "국내 대형 건설사 대상 AEO 측정·리포팅으로 AI 가시성 지표 개선",
        en: "Ran AEO measurement and reporting for a large construction client, improving AI-visibility metrics",
      },
      {
        ko: "호텔 운영 멀티테넌트 SaaS 및 AI 친화 콘텐츠 발행 인프라 구축",
        en: "Built a multi-tenant hotel-operations SaaS and AI-friendly content-publishing infrastructure",
      },
    ],
  },
  {
    company: { ko: "(주)한익스프레스", en: "Hanexpress" },
    period: "2023.12 – 2025.08",
    role: { ko: "백엔드 엔지니어", en: "Backend Engineer" },
    bullets: [
      {
        ko: "물류 풀필먼트 솔루션 창고관리(WMS)·주문관리(FMS) 공통 모듈 개발 및 시스템 아키텍처 설계",
        en: "Built shared modules and designed system architecture for logistics fulfillment solutions (WMS/FMS)",
      },
      {
        ko: "AWS EKS 기반 MSA 플랫폼 구축",
        en: "Built an AWS EKS–based microservices platform",
      },
    ],
  },
  {
    company: { ko: "위메프", en: "WeMakePrice" },
    period: "2018.04 – 2023.05",
    role: { ko: "백엔드 엔지니어", en: "Backend Engineer" },
    bullets: [
      {
        ko: "카탈로그 기반 최저가 상품 자동 추출 및 상품 검색 서비스 개발 (위메프 AI셀렉트)",
        en: "Built lowest-price product extraction and product search (WeMakePrice AI Select)",
      },
      {
        ko: "쇼핑몰·인플루언서 SNS 데이터 수집 크롤러와 AWS SQS 파이프라인 구축 (일 1,000여 건)",
        en: "Built a crawler and AWS SQS pipeline collecting ~1,000 records/day from shopping sites and influencer feeds",
      },
      {
        ko: "Django 레거시를 Node.js(Express)로 마이그레이션, 동시접속 1–5만 규모의 트래픽 이벤트 대응",
        en: "Migrated a Django legacy system to Node.js (Express); handled events with 10k–50k concurrent users",
      },
    ],
  },
  {
    company: { ko: "주식회사 핀톡 (FinTalk)", en: "FinTalk" },
    period: "2016.02 – 2018.04",
    role: { ko: "백엔드 엔지니어", en: "Backend Engineer" },
    bullets: [
      {
        ko: "재무전문가–고객 매칭 서비스 개발 (Django, Google App Engine)",
        en: "Built a matching service between financial advisors and clients (Django, Google App Engine)",
      },
      { ko: "재무계산기 안드로이드 앱 개발", en: "Developed a financial-calculator Android app" },
    ],
  },
  {
    company: { ko: "유비투스코리아", en: "Ubitus Korea" },
    period: "2013.12 – 2014.02",
    role: { ko: "QA 인턴", en: "QA Intern" },
    bullets: [{ ko: "서비스 QA 업무 수행", en: "Performed service QA" }],
  },
];

export const education = {
  school: { ko: "한양대학교", en: "Hanyang University" },
  degree: { ko: "컴퓨터공학부 (컴퓨터공학) 졸업", en: "B.S. in Computer Science & Engineering" },
  period: "2009.03 – 2017.08",
};

export const training = {
  name: { ko: "아이펠(AIFFEL) 리서치 과정 수료", en: "AIFFEL AI Research Program" },
  period: "2025.07",
  desc: {
    ko: "NLP 중심 AI 전문가 과정. 팀 프로젝트로 RAG 기반 질의응답 시스템을 연구·개발.",
    en: "NLP-focused AI program; researched and built a RAG-based Q&A system in a team project.",
  },
};

export const skills: SkillGroup[] = [
  { label: { ko: "언어", en: "Languages" }, items: ["Python", "Java", "TypeScript"] },
  { label: { ko: "백엔드", en: "Backend" }, items: ["Spring", "JPA", "Django", "Node.js / Express", "Fastify"] },
  { label: { ko: "AI/ML", en: "AI/ML" }, items: ["PyTorch", "NLP", "RAG", "LangChain / LangGraph", "LLM APIs"] },
  { label: { ko: "인프라", en: "Infra" }, items: ["AWS", "GCP", "Docker", "Kubernetes (EKS)", "Nginx", "CI/CD", "MLOps"] },
];
