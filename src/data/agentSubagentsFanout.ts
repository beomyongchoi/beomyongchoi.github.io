import type { BiBlock } from "./aiParadox";

export const blocks: BiBlock[] = [
  {
    type: "callout",
    tone: "tldr",
    ko: "<strong>결론부터.</strong> 단일 에이전트에 모든 작업을 순차 위임하는 방식은 대규모 코드베이스에서 병목을 유발합니다. <strong>Google Antigravity(AGY)</strong>는 메인 에이전트가 탐색·테스트·리팩토링 등 역할별 <strong>동적 서브에이전트(Dynamic Subagents)</strong>를 생성하고 독립된 워크스페이스(Branch/Share)에서 병렬 실행합니다.",
    en: "<strong>The short version.</strong> Delegating all tasks sequentially to a single agent creates a major bottleneck in large codebases. <strong>Google Antigravity (AGY)</strong> solves this by spawning role-specific <strong>Dynamic Subagents</strong> that execute in parallel across isolated workspaces (Branch/Share).",
  },
  {
    type: "callout",
    tone: "warn",
    ko: "<strong>2026-10 업데이트.</strong> 이 글은 2026-07 기준으로 썼습니다. 최신 Flash는 이제 <strong>Gemini 3.8 Flash</strong>입니다. 서브에이전트 구조 설명은 Antigravity 문서 기준으로 보강했고, 문서에 없는 \"검증 후 병합\"·\"오버헤드 무시 가능\"은 필자 해석으로 표시했습니다. 실험실의 24.0s → 6.8s는 가상 시뮬레이션 값입니다.",
    en: "<strong>Update (2026-10).</strong> Written as of 2026-07. The latest Flash is now <strong>Gemini 3.8 Flash</strong>. The subagent section now follows the Antigravity docs; claims the docs don't make (\"verified merging\", \"negligible overhead\") are marked as my interpretation. The lab's 24.0s → 6.8s is a simulated figure.",
  },

  {
    type: "p",
    s: [
      { ko: "단일 에이전트 루프의 한계는 명확합니다.", en: "The limits of a single-agent loop are clear." },
      { ko: "파일 탐색, 테스트 코드 작성, 리팩토링을 한 스레드에서 순차 처리하면 실행 시간이 비례하여 증가합니다.", en: "Processing file exploration, test writing, and refactoring sequentially in one thread inflates total execution time." },
      { ko: "중간 단계의 오류가 전체 스레드의 컨텍스트 오염으로 이어지기도 합니다.", en: "Intermediate errors can also pollute the context of the entire thread." },
    ],
  },

  { type: "h2", ko: "동적 서브에이전트(Dynamic Subagents)의 아키텍처", en: "Architecture of Dynamic Subagents" },

  {
    type: "p",
    s: [
      { ko: "Antigravity는 메인 에이전트가 필요 시 서브에이전트를 동적으로 분생(Spawn)하는 구조를 취합니다.", en: "Antigravity dynamically spawns subagents on demand from the main agent." },
      { ko: "각 서브에이전트는 고유한 역할(Role), 시스템 프롬프트, 격리된 워크스페이스(Branch mode)를 부여받습니다.", en: "Each subagent is assigned a dedicated role, system prompt, and an isolated workspace (Branch mode)." },
      { ko: "서브에이전트는 메인 스레드의 컨텍스트를 오염시키지 않고 독립적으로 동작합니다.", en: "Subagents operate independently without polluting the main thread's context." },
    ],
  },

  {
    type: "code",
    code: "Antigravity Multi-Agent Topology (Tokyo Night Dark Terminal)\n\n[Main Orchestrator Agent]\n  │\n  ├──> [Subagent A: Code Explorer]  ── (Reads repo & indexes dependencies)\n  ├──> [Subagent B: Test Writer]    ── (Generates unit tests in isolated branch)\n  └──> [Subagent C: Refactor Engine] ── (Applies core logic changes)\n  │\n  └── Async Message Passing & Merging ──> Unified Verified Commit\n\n# Parallel execution reduces total turnaround latency by up to 70%",
  },

  {
    type: "callout",
    tone: "tip",
    ko: "서브에이전트 수가 늘어남에 따라 작업 실행 타임라인이 어떻게 병렬화되는지 확인해보세요. <a href=\"/playground/agent-topology/\">동적 서브에이전트 위상(Topology) 시각화 →</a>",
    en: "Observe how execution timelines parallelize as subagent count increases. <a href=\"/playground/agent-topology/\">Dynamic Subagent Topology Visualizer →</a>",
  },

  { type: "h2", ko: "독립 워크스페이스와 메세지 기반 비동기 통합", en: "Isolated Workspaces & Async Message Merging" },

  {
    type: "p",
    s: [
      { ko: "서브에이전트의 강점은 안전성에 있습니다.", en: "The core advantage of subagents lies in execution safety." },
      { ko: "워크스페이스 모드는 부모를 그대로 쓰는 <code>inherit</code>, git worktree로 복제하는 <code>branch</code>, 공유하는 <code>share</code> 세 가지입니다.", en: "Workspace modes are <code>inherit</code> (use the parent as-is), <code>branch</code> (a git worktree copy), and <code>share</code>." },
      { ko: "서브에이전트는 부모의 대화 이력을 물려받지 않고, 끝나면 결과 메시지를 부모에게 돌려줍니다.", en: "Subagents don't inherit the parent's conversation history and send a result message back when done." },
      { ko: "그 결과를 검증하고 합치는 건 메인 에이전트(또는 사람)의 몫입니다.", en: "Verifying and merging that result is up to the main agent (or you)." },
    ],
  },

  {
    type: "p",
    s: [
      { ko: "서브에이전트 모델은 <code>inherit</code>/<code>flash</code>/<code>pro</code> 중에 고를 수 있습니다.", en: "Each subagent's model can be <code>inherit</code>, <code>flash</code>, or <code>pro</code>." },
      { ko: "빠른 Flash를 서브에이전트에 붙이면 생성·수집 오버헤드가 상대적으로 작아진다는 게 필자의 해석입니다.", en: "My take: pairing subagents with a fast Flash keeps spawn-and-collect overhead relatively small." },
    ],
  },

  { type: "h2", ko: "요약과 다음 편 예고", en: "Summary & Next Episode" },

  {
    type: "p",
    s: [
      { ko: "병렬 오케스트레이션은 대규모 엔지니어링 작업을 잘게 쪼개어 속도와 안전성을 동시에 확보하는 핵심 메커니즘입니다.", en: "Parallel orchestration is the key mechanism for splitting massive engineering tasks into fast, safe units." },
      { ko: "다음 2편에서는 이와 대척점에 있는 <strong>Claude Fable 5의 Mythos급 단일 에이전트 심층 장기 추론(Long-horizon Reasoning)</strong>을 다룹니다.", en: "In Episode 2, we will examine the opposite paradigm: <strong>Claude Fable 5's Mythos-class single-agent deep long-horizon reasoning</strong>." },
    ],
  },

  { type: "hr" },
  {
    type: "sources",
    html: "<h3>출처 · Sources</h3><ul><li><a href=\"https://antigravity.google/docs/subagents?tab=cli\">Antigravity — Subagents</a></li><li><a href=\"https://ai.google.dev/gemini-api/docs/models\">Gemini API — Models</a></li></ul>",
  },
];
