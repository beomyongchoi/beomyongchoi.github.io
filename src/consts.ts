// ---------------------------------------------------------------------------
// Global site constants + i18n UI strings.
// ---------------------------------------------------------------------------

export const SITE = {
  url: "https://beomyongchoi.github.io",
  author: "Beomyong Choi",
  authorKo: "최범용",
  email: "dev.bychoi@gmail.com",
  github: "https://github.com/beomyongchoi",
  linkedin: "https://www.linkedin.com/in/beomyong-choi-079973109/",
  defaultLocale: "ko",
  locales: ["ko", "en"],
} as const;

export type Locale = (typeof SITE.locales)[number];

export const LOCALE_TAG: Record<Locale, string> = {
  ko: "ko-KR",
  en: "en-US",
};

type Nav = { home: string; work: string; blog: string; about: string; resume: string; playground: string };

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
    title: "최범용 — 백엔드·AI 엔지니어",
    description:
      "커머스와 물류에서 검색·데이터 파이프라인과 AWS EKS 기반 MSA를 만들었습니다. 지금은 AI 서비스와 AEO를 만듭니다.",
    tagline: "커머스·물류 백엔드를 만들었고, 지금은 AI를 만듭니다.",
    role: "백엔드 · AI 엔지니어",
    nav: { home: "홈", work: "작업", blog: "블로그", about: "소개", resume: "이력서", playground: "실험실" },
    langSwitch: "EN",
    wipTitle: "곧 채워집니다",
    wipBody: "글을 준비하고 있습니다.",
  },
  en: {
    siteName: "Beomyong Choi",
    title: "Beomyong Choi — Backend & AI Engineer",
    description:
      "I built search and data pipelines and AWS EKS microservices in commerce and logistics. Now I build AI products and work on AEO.",
    tagline: "Backend in commerce and logistics, now building AI.",
    role: "Backend & AI Engineer",
    nav: { home: "Home", work: "Work", blog: "Blog", about: "About", resume: "Resume", playground: "Playground" },
    langSwitch: "KO",
    wipTitle: "Coming soon",
    wipBody: "Posts are on the way.",
  },
};
