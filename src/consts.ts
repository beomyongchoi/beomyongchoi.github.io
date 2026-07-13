// ---------------------------------------------------------------------------
// Global site constants + i18n UI strings.
// Keep author-facing copy here so pages stay structural.
// ---------------------------------------------------------------------------

export const SITE = {
  url: "https://beomyongchoi.github.io",
  author: "Beomyong Choi",
  authorKo: "최범용",
  email: "dev.bychoi@gmail.com",
  github: "https://github.com/beomyongchoi",
  defaultLocale: "ko",
  locales: ["ko", "en"],
} as const;

export type Locale = (typeof SITE.locales)[number];

export const LOCALE_TAG: Record<Locale, string> = {
  ko: "ko-KR",
  en: "en-US",
};

// Topics the site should be recognized as an authority on (feeds JSON-LD).
export const KNOWS_ABOUT = [
  "Answer Engine Optimization",
  "AEO",
  "Generative Engine Optimization",
  "SEO",
  "Large Language Models",
  "Backend Engineering",
  "Full-stack Development",
];

type Nav = { home: string; work: string; blog: string; about: string; resume: string };

interface Strings {
  siteName: string;
  title: string;
  description: string;
  tagline: string;
  role: string;
  nav: Nav;
  langSwitch: string;
  wipTitle: string;
  wipBody: string;
}

export const T: Record<Locale, Strings> = {
  ko: {
    siteName: "최범용",
    title: "최범용 — AEO 엔지니어 · 풀스택 개발자",
    description:
      "백엔드 개발자에서 AEO(Answer Engine Optimization) 엔지니어로. ChatGPT·Gemini·Perplexity 같은 AI 답변엔진 시대의 브랜드 가시성을 측정하고 최적화합니다.",
    tagline: "AI 답변엔진 시대의 가시성을 설계합니다.",
    role: "AEO 엔지니어 · 풀스택 개발자",
    nav: { home: "홈", work: "작업", blog: "블로그", about: "소개", resume: "이력서" },
    langSwitch: "EN",
    wipTitle: "사이트를 새로 짓는 중입니다",
    wipBody:
      "포트폴리오 · 기술 블로그 · 이력서를 하나로 모으는 공간을 준비하고 있습니다. 곧 채워집니다.",
  },
  en: {
    siteName: "Beomyong Choi",
    title: "Beomyong Choi — AEO Engineer & Full-stack Developer",
    description:
      "From backend engineer to AEO (Answer Engine Optimization) engineer. I measure and optimize brand visibility for the age of AI answer engines like ChatGPT, Gemini, and Perplexity.",
    tagline: "Engineering visibility for the age of AI answer engines.",
    role: "AEO Engineer · Full-stack Developer",
    nav: { home: "Home", work: "Work", blog: "Blog", about: "About", resume: "Resume" },
    langSwitch: "KO",
    wipTitle: "Rebuilding this site",
    wipBody:
      "A single home for my portfolio, engineering blog, and resume is on the way. Content is coming soon.",
  },
};
