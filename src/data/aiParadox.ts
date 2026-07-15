// Aligned KO/EN content for the interactive bilingual "AI 코딩의 역설" post.
// Paragraphs are split into SENTENCES so each sentence is a click target that
// reveals its counterpart. Text may contain simple inline HTML (<strong>,<em>,<a>).

type S = { ko: string; en: string };

export type BiBlock =
  | { type: "h2"; ko: string; en: string }
  | { type: "p"; s: S[] }
  | { type: "quote"; ko: string; en: string }
  | { type: "callout"; tone: "tldr" | "warn" | "tip"; ko: string; en: string }
  | { type: "list"; items: S[] }
  | { type: "code"; code: string }
  | { type: "figure"; src: string; alt: string }
  | { type: "hr" }
  | { type: "sources"; html: string };

export const blocks: BiBlock[] = [
  { type: "figure", src: "/assets/ai-paradox-hero.png", alt: "AI 코딩의 역설 — 개발자 84%가 AI를 쓰지만 정확도를 믿는 건 29%뿐" },

  {
    type: "callout",
    tone: "tldr",
    ko: "<strong>결론부터.</strong> 개발자 84%가 AI를 씁니다. 그런데 정확도를 믿는 건 29%뿐입니다. 그러면서도 검증 없이 배포합니다. 코드는 빨리 늘고, 리팩터링은 줄고, 도구는 파편화됩니다. 남는 건 사람의 판단력입니다.",
    en: "<strong>The short version.</strong> 84% of developers use AI. Only 29% trust its accuracy. They ship it unverified anyway. Code piles up, refactoring shrinks, and the tools fragment. What's left is human judgment.",
  },

  {
    type: "p",
    s: [
      { ko: "AI는 이제 개발 현장의 기본값입니다.", en: "AI is the default on dev teams now." },
      { ko: "그런데 그 이면에 묘한 모순이 있습니다.", en: "But there's a strange contradiction underneath it." },
      { ko: "<strong>거의 모두가 AI로 코드를 짜지만, 그 결과를 믿는 사람은 드뭅니다.</strong>", en: "<strong>Almost everyone writes code with AI — yet almost no one trusts what it produces.</strong>" },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "숫자부터 짚고 갑니다.", en: "Start with the numbers." },
      { ko: "채택률은 조사마다 다릅니다.", en: "Adoption depends on who's counting." },
      { ko: "Stack Overflow 2025 설문은 84%(2024년 76%에서 상승), JetBrains와 DX 같은 조사는 90%를 넘깁니다.", en: "Stack Overflow's 2025 survey says 84% (up from 76% in 2024); surveys like JetBrains and DX put it north of 90%." },
      { ko: "정의가 다르기 때문입니다.", en: "The gap is definitional." },
      { ko: "Stack Overflow의 84%는 '쓰고 있거나 쓸 계획'까지 포함한 넓은 그룹이고, DX·JetBrains의 수치는 이미 도입을 마친 팀과 업무 환경을 기준으로 합니다.", en: "Stack Overflow's 84% is a wide net — everyone \"using or planning to use.\" DX and JetBrains measure teams and workplaces that have already adopted." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "AI 제품을 만드는 입장에서 이 데이터를 흥미롭게 봤습니다.", en: "As someone who builds AI products, I read this data with interest." },
      { ko: "화려한 채택률 뒤에 신뢰와 품질의 문제가 같이 걸어오고 있어서입니다.", en: "Behind the shiny adoption rate, problems of trust and quality are walking right alongside it." },
      { ko: "지금 우리가 마주한 다섯 가지 역설을 정리합니다.", en: "Here are the five paradoxes we're facing." },
    ],
  },

  { type: "h2", ko: "1. 신뢰의 역설 — 안 믿으면서 그대로 배포한다", en: "1. The trust paradox — we don't trust it, but we ship it anyway" },
  {
    type: "p",
    s: [
      { ko: "먼저 볼 것은 사용률과 신뢰도의 간극입니다.", en: "Start with the gap between usage and trust." },
      { ko: "Stack Overflow 2025에 따르면 AI 도구의 정확도를 신뢰한다는 응답은 <strong>29%</strong>에 그칩니다.", en: "Per Stack Overflow 2025, only <strong>29%</strong> trust the accuracy of AI tools." },
      { ko: "전년 40%대에서 크게 떨어졌습니다.", en: "That's down sharply from the 40s a year earlier." },
      { ko: "신뢰(33%)보다 불신(46%)이 많고, '매우 신뢰한다'는 3%뿐입니다.", en: "More distrust it (46%) than trust it (33%), and just 3% \"highly trust\" it." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "여기서 행동의 역설이 드러납니다.", en: "Here's the behavioral paradox." },
      { ko: "개발자들은 AI를 못 믿으면서도 검증 없이 코드를 내보냅니다.", en: "Developers don't trust AI, yet they ship its code without checking it." },
    ],
  },
  {
    type: "list",
    items: [
      { ko: "Veracode 2025: AI가 생성한 코드의 <strong>45%</strong>에서 보안 취약점이 나왔습니다. 사람이 쓴 코드보다 2.74배 많습니다. 특히 <strong>Java는 실패율 72%</strong>, XSS 방어 실패 86%, 로그 인젝션 방어 실패 88%였습니다.", en: "Veracode 2025: <strong>45%</strong> of AI-generated code had a security flaw — 2.74× more than human-written code. Java was the worst at a <strong>72% failure rate</strong>; models failed to defend against XSS 86% of the time and log injection 88%." },
      { ko: "GitGuardian: Copilot이 켜진 저장소의 <strong>6.4%</strong>에서 시크릿(자격 증명 등)이 유출됐습니다. 전체 공개 저장소 평균(4.6%)보다 약 <strong>40% 높은</strong> 수치입니다.", en: "GitGuardian: <strong>6.4%</strong> of repositories with Copilot active leaked a secret (credentials and the like) — about <strong>40% higher</strong> than the 4.6% baseline across all public repos." },
    ],
  },
  { type: "p", s: [{ ko: "Stack Overflow가 꼽은 1위 불만은 이 한 문장으로 요약됩니다.", en: "Stack Overflow's number-one frustration boils down to a single line." }] },
  { type: "quote", ko: "거의 맞지만, 완전히 맞지는 않다 — <em>almost right, but not quite.</em>", en: "Almost right, but not quite." },
  {
    type: "p",
    s: [
      { ko: "응답자의 45%가 이걸 가장 큰 불편으로 꼽았고, 66%는 이 '거의 맞는' 코드를 고치는 데 오히려 시간을 더 쓴다고 답했습니다.", en: "45% named this their biggest annoyance, and 66% say they spend <em>more</em> time fixing this \"almost-right\" code." },
      { ko: "문제는 도구가 아니라, 검증의 책임을 놓아버린 쪽에 있습니다.", en: "The problem isn't the tool — it's whoever let go of the duty to verify." },
    ],
  },

  {
    type: "callout",
    tone: "warn",
    ko: "<strong>주의</strong> — AI 코드는 '거의 맞음'이 가장 위험합니다. 그럴듯해서 검증을 건너뛰기 쉽습니다. 그 순간 취약점이 그대로 배포됩니다.",
    en: "<strong>Watch out</strong> — with AI code, \"almost right\" is the dangerous part. It looks fine, so it's easy to skip the check. That's the moment the vulnerability ships.",
  },

  { type: "h2", ko: "2. 생산성의 함정 — 60% 더 만들고, 8배 더 베낀다", en: "2. The productivity trap — 60% more code, 8× more copy-paste" },
  {
    type: "p",
    s: [
      { ko: "양이 늘면 질이 떨어진다는 우려는 데이터로 드러납니다.", en: "The worry that volume erodes quality shows up in the data." },
      { ko: "DX의 2025년 4분기 리포트를 보면, AI를 매일 쓰는 개발자는 그렇지 않은 개발자보다 PR 처리량이 <strong>60% 높습니다</strong>.", en: "In DX's Q4 2025 report, developers who use AI daily ship <strong>60% more pull requests</strong> than those who don't." },
    ],
  },
  { type: "p", s: [{ ko: "문제는 그 코드가 어떻게 만들어지는가입니다.", en: "The question is how that code gets made." }] },
  { type: "figure", src: "/assets/ai-paradox-divergence.png", alt: "GitClear: 복사·붙여넣기 코드는 8.3%에서 12.3%로 오르고, 리팩터링은 25%에서 10% 미만으로 떨어진다" },
  {
    type: "p",
    s: [
      { ko: "GitClear는 2020–2024년 코드 2.1억 줄을 분석했습니다.", en: "GitClear analyzed 211 million lines of code from 2020–2024." },
      { ko: "결과는 뚜렷합니다.", en: "The trend is unmistakable." },
    ],
  },
  {
    type: "list",
    items: [
      { ko: "복사·붙여넣기(중복) 코드 비중: 8.3% → <strong>12.3%</strong>", en: "Copy-pasted (duplicated) code: 8.3% → <strong>12.3%</strong>" },
      { ko: "2024년 한 해, 중복 코드 블록 빈도는 전년 대비 약 <strong>8배</strong> 급증", en: "In 2024 alone, duplicated code blocks jumped roughly <strong>8×</strong> year over year" },
      { ko: "리팩터링(코드 개선) 비중: 25% → <strong>10% 미만</strong>", en: "Refactoring (improving existing code): 25% → <strong>under 10%</strong>" },
      { ko: "2024년, 처음으로 복붙이 리팩터링을 추월", en: "In 2024, copy-paste overtook refactoring for the first time" },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "지금의 배포 속도를 위해 미래의 유지보수 비용을 미루고 있는 셈입니다.", en: "We're trading tomorrow's maintenance cost for today's shipping speed." },
      { ko: "눈앞의 PR은 빨라지지만, 중복은 이자처럼 쌓입니다.", en: "The PR in front of you gets faster; the duplication compounds like interest." },
    ],
  },

  {
    type: "callout",
    tone: "tip",
    ko: "<strong>팁</strong> — 생산성을 PR 개수로만 보지 마세요. 복붙·리팩터링 비율을 같이 추적해야 기술 부채가 눈에 들어옵니다.",
    en: "<strong>Tip</strong> — don't measure productivity by PR count alone. Track your copy-paste and refactoring ratios too, and the tech debt becomes visible.",
  },

  { type: "h2", ko: "3. 시니어의 역설 — 덜 쓰는데 더 번다", en: "3. The senior paradox — they use it less, but gain more" },
  {
    type: "p",
    s: [
      { ko: "AI 의존도와 효율은 나란히 가지 않습니다.", en: "Reliance and efficiency don't move together." },
      { ko: "경력이 짧을수록 AI를 더 자주 씁니다.", en: "The less experience you have, the more often you reach for AI." },
      { ko: "반대로 경력이 많을수록 신중합니다.", en: "The more experience, the more cautious." },
      { ko: "Stack Overflow에서 숙련 개발자는 '매우 신뢰' 2.6%로 가장 낮고, '매우 불신' 20%로 가장 높았습니다.", en: "In Stack Overflow's data, senior developers had the lowest \"highly trust\" rate (2.6%) and the highest \"highly distrust\" rate (20%)." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "그런데 시간 절약은 거꾸로 나타납니다.", en: "Yet the time savings run the other way." },
      { ko: "DX 기준 일반 개발자가 주당 3.6시간을 아낄 때, <strong>Staff+ 등급 시니어는 주당 4.4시간</strong>을 아낍니다.", en: "Per DX, the average developer saves 3.6 hours a week — while <strong>Staff+ engineers save 4.4</strong>." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "AI는 단순한 코딩 도구가 아니라 숙련도의 증폭기에 가깝습니다.", en: "AI is less a coding tool than an amplifier of skill." },
      { ko: "맥락을 쥔 사람이 도구를 더 날카롭게 통제하고, 더 큰 몫을 가져갑니다.", en: "Whoever holds the context steers it more sharply — and takes the bigger cut." },
    ],
  },

  { type: "h2", ko: "4. 모놀리스의 균열 — '쉐도우 AI'와 도구 파편화", en: "4. Cracks in the monolith — 'shadow AI' and tool fragmentation" },
  { type: "p", s: [{ ko: "Copilot이 시장을 독점한다는 인상과 달리, 데이터는 균열을 말합니다.", en: "Contrary to the impression that Copilot owns the market, the data tells a story of fragmentation." }] },
  { type: "figure", src: "/assets/ai-paradox-tools.png", alt: "JetBrains 2026년 1월: Copilot 인지도 76%·업무 도입 29%, Cursor 18%, Claude Code 18%" },
  {
    type: "p",
    s: [
      { ko: "JetBrains 2026년 1월 데이터를 보면, Copilot은 인지도 76%지만 업무 도입률은 <strong>29%</strong>에 머뭅니다.", en: "In JetBrains' January 2026 data, Copilot has 76% awareness but only <strong>29%</strong> workplace adoption." },
      { ko: "회사가 공식 도입하기 전에 개발자가 개인적으로 쓰는 '쉐도우 AI'가 많다는 뜻입니다.", en: "Much of that gap is \"shadow AI\" — developers using it on their own before the company officially adopts it." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "그 틈을 Cursor와 Claude Code가 파고듭니다.", en: "Cursor and Claude Code are moving into that gap." },
      { ko: "둘 다 업무 도입률 18%로 추격 중이고, 특히 Claude Code는 인지도가 9개월 만에 31%에서 57%로 뛰었습니다.", en: "Both sit at 18% workplace adoption, and Claude Code's awareness leapt from 31% to 57% in nine months." },
      { ko: "시장은 하나의 승자가 아니라, 워크플로우별로 최적화된 도구들로 갈라지고 있습니다.", en: "The market isn't consolidating around one winner; it's splitting into tools tuned for specific workflows." },
    ],
  },

  { type: "h2", ko: "5. 신뢰의 지역 격차 — 인도 56% vs 독일 22%", en: "5. The regional trust gap — India 56% vs. Germany 22%" },
  {
    type: "p",
    s: [
      { ko: "AI를 보는 시각은 기술 생태계에 따라 갈립니다.", en: "How people see AI splits along tech ecosystems." },
      { ko: "Stack Overflow 상위 응답국 중 인도는 56%가 AI를 신뢰해 가장 적극적이었고, 우크라이나가 41%로 뒤를 이었습니다.", en: "Among Stack Overflow's top-responding countries, India was the most bullish at 56% trust, followed by Ukraine at 41%." },
      { ko: "반면 독일은 22%에 그쳤습니다.", en: "Germany sat at just 22%." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "34%p의 격차는 단순한 문화 차이가 아닙니다.", en: "That 34-point spread isn't just culture." },
      { ko: "인도는 AI를 숙련도를 빠르게 끌어올리는 성장 동력으로 삼습니다.", en: "India treats AI as a growth engine to level up fast." },
      { ko: "규제와 데이터 프라이버시를 중시하는 독일은 도입 문턱을 더 높게 둡니다.", en: "Germany, with its emphasis on regulation and data privacy, sets a higher bar for adoption." },
      { ko: "이 온도차는 앞으로 글로벌 기술 허브의 지형을 바꿀 변수입니다.", en: "This temperature difference is a variable that could redraw the map of global tech hubs." },
    ],
  },

  { type: "h2", ko: "결론 — 개발자는 '작성자'에서 '판정관'으로", en: "The takeaway — developers move from 'author' to 'arbiter'" },
  {
    type: "p",
    s: [
      { ko: "코드를 직접 쓰는 시대를 지나, AI가 쏟아낸 결과를 심사하는 시대로 넘어가고 있습니다.", en: "We're moving past the era of writing code ourselves into one of judging what AI pours out." },
      { ko: "Stack Overflow에 따르면, AI의 답을 믿을 수 없을 때 개발자의 75%는 사람 동료를 찾는다고 답했습니다.", en: "Per Stack Overflow, when developers can't trust an AI answer, 75% turn to a human colleague." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "결국 AI 시대 개발자의 가치는 코드의 양이 아니라 품질과 보안을 책임지는 판단력에 있습니다.", en: "In the end, a developer's value in the AI era isn't the volume of code but the judgment to own its quality and security." },
      { ko: "AI가 코딩의 많은 부분을 대신할수록, 아키텍처를 설계하고 오답을 잡아내는 안목은 더 희소해집니다.", en: "The more coding AI takes over, the rarer the eye for designing architecture and catching wrong answers becomes." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "질문 하나로 마칩니다.", en: "One question to close on." },
      { ko: "생산성이 60% 올랐다면, 그 시간을 코드의 구조를 다지는 데 쓰고 있습니까, 아니면 '거의 맞는' 중복 코드를 8배 더 찍어내는 데 쓰고 있습니까.", en: "If your productivity is up 60%, are you spending that time firming up your code's structure — or cranking out 8× more \"almost-right\" duplicate code?" },
    ],
  },

  { type: "hr" },
  {
    type: "sources",
    html: `<h3>출처 · Sources</h3>
<ul>
<li>Stack Overflow — <a href="https://survey.stackoverflow.co/2025/ai">2025 Developer Survey: AI</a> · <a href="https://stackoverflow.blog/2025/12/29/developers-remain-willing-but-reluctant-to-use-ai-the-2025-developer-survey-results-are-here/">results blog</a></li>
<li>Veracode — <a href="https://www.veracode.com/resources/analyst-reports/2025-genai-code-security-report/">2025 GenAI Code Security Report</a></li>
<li>GitClear — <a href="https://www.gitclear.com/ai_assistant_code_quality_2025_research">AI Copilot Code Quality 2025 Research</a></li>
<li>DX — <a href="https://getdx.com/blog/ai-assisted-engineering-q4-impact-report-2025/">AI-assisted engineering: Q4 2025 impact report</a></li>
<li>JetBrains — <a href="https://blog.jetbrains.com/research/2026/04/which-ai-coding-tools-do-developers-actually-use-at-work/">Which AI Coding Tools Do Developers Actually Use at Work? (2026)</a></li>
<li>GitGuardian — <a href="https://blog.gitguardian.com/yes-github-copilot-can-leak-secrets/">Yes, GitHub Copilot can Leak (Real) Secrets</a></li>
</ul>`,
  },
];
