import type { BiBlock } from "./aiParadox";

export const blocks: BiBlock[] = [
  {
    type: "callout",
    tone: "tldr",
    ko: "<strong>결론부터.</strong> 단일 에이전트에 모든 작업을 순차 위임하는 방식은 대규모 코드베이스에서 병목을 유발합니다. <strong>Google Antigravity(AGY)</strong>는 메인 에이전트가 탐색·테스트·리팩토링 등 역할별 <strong>동적 서브에이전트(Dynamic Subagents)</strong>를 생성하고 독립된 워크스페이스(Branch/Share)에서 병렬 실행합니다.",
    en: "<strong>The short version.</strong> Delegating all tasks sequentially to a single agent creates a major bottleneck in large codebases. <strong>Google Antigravity (AGY)</strong> solves this by spawning role-specific <strong>Dynamic Subagents</strong> that execute in parallel across isolated workspaces (Branch/Share).",
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
      { ko: "부모 워크스페이스를 복제(Branch)하거나 공유(Share)하여 작업하므로 실증 코드베이스를 훼손하지 않습니다.", en: "They work in branched or shared workspaces, protecting the production codebase from breaking edits." },
      { ko: "작업 완료 시 메타데이터와 결과물만 메인 에이전트로 전달되어 검증 후 병합됩니다.", en: "Upon completion, only key metadata and artifacts pass back to the main agent for verified merging." },
    ],
  },

  {
    type: "p",
    s: [
      { ko: "Gemini 3.6 Flash의 빠른 턴어라운드 타임과 결합하면서 이 오케스트레이션의 효용이 극대화됩니다.", en: "Combined with Gemini 3.6 Flash's fast turnaround times, this orchestration reaches peak efficiency." },
      { ko: "서브에이전트 생성과 응답 수집에 드는 오버헤드가 거의 발생하지 않기 때문입니다.", en: "The overhead of spawning subagents and collecting responses becomes virtually negligible." },
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
];
