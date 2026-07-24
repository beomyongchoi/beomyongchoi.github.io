import type { BiBlock } from "./aiParadox";

export const blocks: BiBlock[] = [
  {
    type: "callout",
    tone: "tldr",
    ko: "<strong>결론부터.</strong> AI 모델의 성패는 더 이상 모델 크기(Parameter Size)만으로 결정되지 않습니다. <strong>Gemini 3.6 Flash</strong>는 가변 추론(<strong>Thinking Effort</strong>)을 도입하여 작업 난이도(Low/Medium/High)에 따라 생각의 깊이를 동적으로 조절합니다. 그 결과 Pro급 정확도를 유지하면서도 토큰 소비와 지연 시간을 비약적으로 낮췄습니다.",
    en: "<strong>The short version.</strong> AI model success is no longer dictated solely by parameter size. <strong>Gemini 3.6 Flash</strong> introduces variable reasoning (<strong>Thinking Effort</strong>) to dynamically adjust thinking depth based on task complexity (Low/Medium/High). As a result, it retains Pro-level accuracy while significantly reducing token consumption and latency.",
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
      { ko: "Gemini 3.6 Flash는 요청마다 추론 예산(Thinking Budget)을 다르게 할당합니다.", en: "Gemini 3.6 Flash allocates a different thinking budget per request." },
      { ko: "<strong>Low Effort</strong>는 단순 분류·정형 데이터 추출처럼 즉각적인 응답이 필요한 작업에 쓰입니다.", en: "<strong>Low Effort</strong> targets tasks needing instant responses, like simple classification or structured extraction." },
      { ko: "<strong>Medium Effort</strong>는 표준적인 코드 작성과 일반 질의응답을 담당합니다.", en: "<strong>Medium Effort</strong> handles standard code generation and general Q&A." },
      { ko: "<strong>High Effort</strong>는 멀티스텝 알고리즘 연산이나 복잡한 에이전트 추론 루프에 활용됩니다.", en: "<strong>High Effort</strong> is reserved for multi-step algorithmic reasoning and complex agentic loops." },
    ],
  },

  {
    type: "code",
    code: "Thinking Effort Scaling Pattern (Tokyo Night Terminal Metric)\n\n[Low Effort]   ████░░░░░░░░░░  Latency:  80ms | Tokens:  120 | Accuracy: 91.2%\n[Med Effort]   ████████░░░░░░  Latency: 240ms | Tokens:  450 | Accuracy: 95.8%\n[High Effort]  ██████████████  Latency: 650ms | Tokens: 1200 | Accuracy: 98.4%\n\n# Dynamic adjustment cuts average agent loop latency by 60%",
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
      { ko: "Gemini 3.6 Flash는 루프 초기 탐색 구간에서는 Low Effort로 속도를 올립니다.", en: "Gemini 3.6 Flash accelerates early exploration turns using Low Effort." },
      { ko: "심층 문제 해결이 필요한 시점에만 High Effort로 전환합니다.", en: "It switches to High Effort only when deep problem solving is required." },
      { ko: "이 구조 덕분에 평균 턴어라운드 타임을 유지하면서도 전체 토큰 소비를 <strong>17% 절감</strong>합니다.", en: "This structure maintains fast average turnaround times while cutting overall token usage by <strong>17%</strong>." },
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
];
