import type { BiBlock } from "./aiParadox";

export const blocks: BiBlock[] = [
  {
    type: "callout",
    tone: "tldr",
    ko: "<strong>결론부터.</strong> 최고의 에이전트는 존재하지 않으며, <strong>작업의 위상 구조(Topology)에 따른 적재적소의 선택</strong>이 핵심입니다. 빠른 병렬 스케줄링이 필요한 다중 모듈 작업에는 <strong>Gemini 3.6 Flash(AGY)</strong>가, 단일 맥락의 심층 추적이 필요한 작업에는 <strong>Claude Fable 5(Claude Code)</strong>가 적합합니다. 여기에 <strong>Ponytail</strong> 플러그인을 병행하여 과잉 엔지니어링을 차단해야 합니다.",
    en: "<strong>The short version.</strong> There is no single best agent model; success lies in <strong>matching the agent architecture to the task topology</strong>. Use <strong>Gemini 3.6 Flash (AGY)</strong> for parallel multi-module tasks, and <strong>Claude Fable 5 (Claude Code)</strong> for deep single-context tracing. Pair either with <strong>Ponytail</strong> to curb over-engineering.",
  },
  {
    type: "callout",
    tone: "warn",
    ko: "<strong>2026-10 업데이트.</strong> 이 글은 2026-07 기준으로 썼습니다. 모델은 이제 <strong>Gemini 3.8 Flash</strong>, <strong>Claude Fable 5.1 / Opus 5.5</strong>가 최신입니다. 병렬 대 심층이라는 선택 기준은 그대로입니다. 초판의 \"Ponytail 실시간 감사\"는 사실과 달라 고쳤고, 실험실의 \"Ponytail 점수\"는 필자가 만든 가상 지표입니다.",
    en: "<strong>Update (2026-10).</strong> Written as of 2026-07. Current models are <strong>Gemini 3.8 Flash</strong> and <strong>Claude Fable 5.1 / Opus 5.5</strong>; the parallel-vs-deep criterion still holds. The first draft's \"real-time Ponytail audit\" was wrong and is fixed; the lab's \"Ponytail score\" is my own illustrative metric.",
  },

  {
    type: "p",
    s: [
      { ko: "에이전트 선택은 성능 대결이 아닌 아키텍처 적합성 문제입니다.", en: "Selecting an agent platform is an architectural fit question, not a benchmark contest." },
      { ko: "프로젝트의 복잡도와 동시성 요건에 따라 최적의 도구가 갈립니다.", en: "The optimal tool depends on your project's complexity and concurrency needs." },
    ],
  },

  { type: "h2", ko: "아키텍처 비교 Matrix", en: "Architectural Comparison Matrix" },

  {
    type: "code",
    code: "Agent Architecture Decision Matrix (Tokyo Night Terminal)\n\n[Task Profile]                  [Recommended Platform]       [Core Advantage]\n─────────────────────────────────────────────────────────────────────────────────\n1. Multi-module exploration     ──> Gemini 3.6 Flash (AGY)   ──> Parallel Subagents & 60% Faster\n2. Single-pass deep refactor    ──> Claude Fable 5 (Code)    ──> 128k Output & Mythos Reasoning\n3. Over-Engineering Audit       ──> Ponytail Plugin          ──> Anti-abstraction Code Pruning\n\n# Match platform topology to code structure for optimal throughput",
  },

  {
    type: "callout",
    tone: "tip",
    ko: "프로젝트 특성을 입력하고 최적의 에이전트 조합과 Ponytail 코드 경량화 점수를 확인해보세요. <a href=\"/playground/agent-compare/\">에이전트 아키텍처 셀렉터 시뮬레이터 →</a>",
    en: "Input your project profile to discover the optimal agent mix and Ponytail score. <a href=\"/playground/agent-compare/\">Agent Architecture Selector →</a>",
  },

  { type: "h2", ko: "Ponytail 플러그인을 활용한 과잉 엔지니어링 억제", en: "Preventing Over-Engineering with Ponytail" },

  {
    type: "p",
    s: [
      { ko: "강력한 모델일수록 불필요한 보일러플레이트와 과도한 추상화 레이어를 생성하는 경향이 있습니다.", en: "Powerful models tend to introduce unnecessary boilerplate and excessive abstraction layers." },
      { ko: "이것이 코드베이스에 쌓이면 장기 유지보수 비용이 급증합니다.", en: "If left unchecked, this drastically increases long-term maintenance costs." },
    ],
  },

  {
    type: "p",
    s: [
      { ko: "<strong>Ponytail</strong>은 Claude Code 플러그인입니다. 코드를 쓰기 <em>전에</em> \"정말 필요한가 → 이미 있나 → 표준 라이브러리로 되나\" 순의 결정 사다리를 따르게 합니다.", en: "<strong>Ponytail</strong> is a Claude Code plugin. It makes the agent climb a decision ladder <em>before</em> writing code: is it needed → does it already exist → does the stdlib do it." },
      { ko: "사후 점검은 <code>/ponytail-review</code>(diff)와 <code>/ponytail-audit</code>(레포 전체)로 따로 돌립니다.", en: "After the fact, you run <code>/ponytail-review</code> (a diff) or <code>/ponytail-audit</code> (the whole repo)." },
      { ko: "모델의 지능(Gemini 3.6 / Fable 5)과 Ponytail의 코드 제약을 결합할 때 비로소 가장 정갈하고 유지보수 가능한 코드베이스가 완성됩니다.", en: "Combining raw model capability with Ponytail's code constraints yields the cleanest, most maintainable codebase." },
    ],
  },

  { type: "h2", ko: "시리즈를 마치며", en: "Closing the Series" },

  {
    type: "p",
    s: [
      { ko: "가변 추론(Thinking Effort)부터 동적 서브에이전트, 심층 장기 추론까지 AI 에이전트는 눈부시게 진화하고 있습니다.", en: "From variable reasoning to dynamic subagents and deep long-horizon reasoning, AI agents are evolving rapidly." },
      { ko: "도구의 메커니즘을 정확히 이해하고 적재적소에 배치하는 소프트웨어 엔지니어링 직관이 그 어느 때보다 중요합니다.", en: "Engineering intuition to understand these internal mechanisms and deploy them precisely matters more than ever." },
    ],
  },

  { type: "hr" },
  {
    type: "sources",
    html: "<h3>출처 · Sources</h3><ul><li><a href=\"https://github.com/DietrichGebert/ponytail\">Ponytail (GitHub)</a></li><li><a href=\"https://ai.google.dev/gemini-api/docs/models\">Gemini API — Models</a></li><li><a href=\"https://platform.claude.com/docs/en/about-claude/models/overview\">Claude Docs — Models overview</a></li></ul>",
  },
];
