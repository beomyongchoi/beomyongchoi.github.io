import type { BiBlock } from "./aiParadox";

export const blocks: BiBlock[] = [
  {
    type: "callout",
    tone: "tldr",
    ko: "<strong>결론부터.</strong> AI 모델의 성패는 더 이상 모델 크기(Parameter Size)만으로 결정되지 않습니다. <strong>Gemini Flash</strong> 계열은 가변 추론(<strong>Thinking Effort</strong>)을 지원합니다. 개발자가 <code>thinking_level</code>(minimal/low/medium/high)로 생각의 깊이를 고르고, 지정하지 않으면 모델이 동적으로 정합니다. 쉬운 요청에 생각을 덜 쓰면 토큰과 지연 시간이 줄어듭니다.",
    en: "<strong>The short version.</strong> AI model success is no longer dictated solely by parameter size. The <strong>Gemini Flash</strong> line supports variable reasoning (<strong>Thinking Effort</strong>). Developers pick a <code>thinking_level</code> (minimal/low/medium/high); if unset, the model decides dynamically. Spending less thought on easy requests cuts tokens and latency.",
  },

  {
    type: "callout",
    tone: "warn",
    ko: "<strong>2026-10 업데이트.</strong> 이 글은 2026-07 기준으로 썼습니다. 지금 최신 Flash는 <strong>Gemini 3.8 Flash</strong>입니다. 가변 추론 원리는 그대로입니다. 초판의 \"3.6 Flash가 처음 도입\", \"모델이 루프 중 스스로 Low↔High 전환\" 서술은 사실과 달라 고쳤습니다.",
    en: "<strong>Update (2026-10).</strong> Written as of 2026-07. The latest Flash is now <strong>Gemini 3.8 Flash</strong>; the idea of variable reasoning still holds. The first draft's claims that 3.6 Flash \"introduced\" it and that the model switches Low↔High on its own mid-loop were wrong and have been fixed.",
  },

  {
    type: "p",
    s: [
      { ko: "전통적인 LLM 호출은 고정된 비용과 레이턴시를 지불했습니다.", en: "Traditional LLM calls carried fixed costs and latencies." },
      { ko: "단순 텍스트 요약이든 복잡한 리팩토링이든 같은 모델 체급을 거쳤습니다.", en: "Whether summarizing simple text or refactoring complex code, requests hit the same model weight." },
      { ko: "에이전트 시스템에서는 이 방식이 비효율을 초래합니다.", en: "In agentic systems, this static approach creates massive inefficiency." },
    ],
  },

  { type: "h2", ko: "가변 추론(Thinking Effort)의 작동 원리", en: "How Variable Reasoning (Thinking Effort) Works" },

  {
    type: "p",
    s: [
      { ko: "Gemini Flash는 요청마다 추론 예산(Thinking Budget)을 다르게 할당합니다.", en: "Gemini Flash allocates a different thinking budget per request." },
      { ko: "기본은 모델이 알아서 정하는 dynamic thinking이고, <code>thinking_level</code>로 직접 지정할 수 있습니다.", en: "The default is dynamic thinking; you can override it with <code>thinking_level</code>." },
      { ko: "<strong>Low Effort</strong>는 단순 분류·정형 데이터 추출처럼 즉각적인 응답이 필요한 작업에 쓰입니다.", en: "<strong>Low Effort</strong> targets tasks needing instant responses, like simple classification or structured extraction." },
      { ko: "<strong>Medium Effort</strong>는 표준적인 코드 작성과 일반 질의응답을 담당합니다.", en: "<strong>Medium Effort</strong> handles standard code generation and general Q&A." },
      { ko: "<strong>High Effort</strong>는 멀티스텝 알고리즘 연산이나 복잡한 에이전트 추론 루프에 활용됩니다.", en: "<strong>High Effort</strong> is reserved for multi-step algorithmic reasoning and complex agentic loops." },
    ],
  },

  {
    type: "code",
    code: "Thinking Effort Scaling Pattern (illustrative numbers — not a benchmark)\n\n[Low Effort]   ████░░░░░░░░░░  Latency:  80ms | Tokens:  120 | Accuracy: 91.2%\n[Med Effort]   ████████░░░░░░  Latency: 240ms | Tokens:  450 | Accuracy: 95.8%\n[High Effort]  ██████████████  Latency: 650ms | Tokens: 1200 | Accuracy: 98.4%\n\n# 예시값: 레벨이 오를수록 토큰·지연이 늘고 정확도가 오르는 경향만 표현",
  },

  {
    type: "callout",
    tone: "tip",
    ko: "직접 추론 깊이를 조절하며 응답 속도와 토큰 소비량의 변화를 확인해보세요. <a href=\"/playground/thinking-effort/\">Thinking Effort 시각화 시뮬레이터 →</a>",
    en: "Tune the thinking depth yourself and observe the changes in latency and token usage. <a href=\"/playground/thinking-effort/\">Thinking Effort Simulator →</a>",
  },

  { type: "h2", ko: "에이전틱 워크플로우에서의 파급력", en: "Impact on Agentic Workflows" },

  {
    type: "p",
    s: [
      { ko: "에이전트 시스템은 단일 호출로 끝나지 않습니다.", en: "Agent systems do not stop at a single call." },
      { ko: "도구 탐색, 코드 생성, 테스트 실행, 검증의 수십 차례 루프가 이어집니다.", en: "They run dozens of loop iterations across tool search, code generation, testing, and validation." },
      { ko: "모든 턴마다 고비용 추론을 수행하면 지연 시간이 누적되어 실무 사용이 불가능해집니다.", en: "Running heavy reasoning on every turn accumulates latency, making real-world use impossible." },
    ],
  },

  {
    type: "p",
    s: [
      { ko: "그래서 에이전트를 짤 때는 루프 초기 탐색 구간에 낮은 레벨을 지정해 속도를 올립니다.", en: "So when building an agent, you set a low level for early exploration turns to go fast." },
      { ko: "심층 문제 해결이 필요한 호출에만 high를 겁니다.", en: "You reserve high for the calls that need deep problem solving." },
      { ko: "레벨 전환은 모델이 아니라 오케스트레이터(개발자 코드)의 몫입니다.", en: "Switching levels is the orchestrator's job (your code), not the model's." },
      { ko: "참고로 Google은 3.6 Flash가 3.5 Flash보다 출력 토큰을 <strong>17% 덜</strong> 쓴다고 밝혔습니다(Artificial Analysis Index 기준).", en: "For reference, Google reports 3.6 Flash uses <strong>17% fewer</strong> output tokens than 3.5 Flash (on the Artificial Analysis Index)." },
    ],
  },

  { type: "h2", ko: "요약과 다음 편 예고", en: "Summary & Next Episode" },

  {
    type: "p",
    s: [
      { ko: "단순히 빠른 모델이 아니라 <strong>상황에 맞게 깊이를 조절하는 모델</strong>이 에이전트 시대의 새로운 기준입니다.", en: "The new standard in the agent era is not just a fast model, but a model that <strong>tunes its thinking depth to the situation</strong>." },
      { ko: "다음 1편에서는 이렇게 확보된 속도와 가변성을 바탕으로 Google Antigravity가 어떻게 <strong>동적 서브에이전트(Dynamic Subagents)</strong>를 병렬로 뻗어 나가는지 다룹니다.", en: "In Episode 1, we will explore how Google Antigravity leverages this speed and flexibility to fan out <strong>Dynamic Subagents</strong> in parallel." },
    ],
  },

  { type: "hr" },
  {
    type: "sources",
    html: "<h3>출처 · Sources</h3><ul><li><a href=\"https://ai.google.dev/gemini-api/docs/thinking\">Gemini API — Thinking</a></li><li><a href=\"https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-6-flash-3-5-flash-lite-3-5-flash-cyber/\">Google — Gemini 3.6 Flash</a></li><li><a href=\"https://ai.google.dev/gemini-api/docs/models\">Gemini API — Models</a></li></ul>",
  },
];
