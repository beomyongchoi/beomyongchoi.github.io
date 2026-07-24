import type { BiBlock } from "./aiParadox";

export const blocks: BiBlock[] = [
  {
    type: "callout",
    tone: "tldr",
    ko: "<strong>결론부터.</strong> 병렬 오케스트레이션이 속도를 극대화한다면, <strong>Claude Fable 5</strong>는 단일 스레드의 맥락 보존과 심층 추론을 극대화합니다. <strong>Mythos급 지능</strong>과 <strong>128k 출력 토큰</strong>을 바탕으로 며칠에 걸치는 초장기 작업(Long-horizon Tasks)에서도 에러 누적(Error Propagation) 없이 대규모 리팩토링을 완수합니다.",
    en: "<strong>The short version.</strong> While parallel orchestration maximizes speed, <strong>Claude Fable 5</strong> maximizes single-thread context retention and deep reasoning. Powered by <strong>Mythos-class intelligence</strong> and <strong>128k output tokens</strong>, it completes massive refactoring tasks across multi-day long-horizon tasks without error propagation.",
  },

  {
    type: "p",
    s: [
      { ko: "병렬 에이전트 분생이 항상 정답은 아닙니다.", en: "Spawning parallel agents is not always the answer." },
      { ko: "단일 코드베이스의 복잡한 인과관계나 깊은 의존성 사슬을 다룰 때는 스레드 분작이 오히려 맥락 파편화를 일으킵니다.", en: "When dealing with complex causal relationships or deep dependency chains in a single codebase, splitting threads can cause context fragmentation." },
      { ko: "이 지점에서 단일 에이전트의 심층 장기 추론(Long-horizon Reasoning)이 강력한 힘을 발휘합니다.", en: "This is where single-agent long-horizon reasoning proves its strength." },
    ],
  },

  { type: "h2", ko: "Mythos 아키텍처와 128k 대용량 출력 토큰", en: "Mythos Architecture & 128k Output Tokens" },

  {
    type: "p",
    s: [
      { ko: "Claude Fable 5는 안소롭의 최고 등급 지능 아키텍처인 Mythos 5 기반 상용 모델입니다.", en: "Claude Fable 5 is Anthropic's commercial model built on its top-tier Mythos 5 architecture." },
      { ko: "100만 토큰의 입력 윈도우와 함께 <strong>최대 128,000(128k) 출력 토큰</strong>을 지원합니다.", en: "It supports a 1M token input window along with <strong>up to 128k output tokens</strong>." },
      { ko: "단 한 번의 생성으로 대형 파일 십여 개 분량의 모듈 전체를 끊김 없이 리팩토링할 수 있습니다.", en: "A single generation pass can refactor entire modules spanning dozens of large files seamlessly." },
    ],
  },

  {
    type: "code",
    code: "Claude Fable 5 Deep Reasoning Pipeline (Tokyo Night Terminal Metric)\n\n[Input Context: 1M Tokens] ───> [Mythos Deep Engine] ───> [128k Output Stream]\n                                          │\n  ┌───────────────────────────────────────┴───────────────────────────────────────┐\n  ▼                                                                               ▼\n[Error Propagation Protection]                                      [Safety Fallback Classifier]\n  - Long-Horizon Causal Tracking (Turns 1~20+)                        - Security / Bio Scan Active\n  - Context Drift Rate < 0.8%                                         - Auto Fallback to Opus 4.8 if needed\n\n# Single-thread coherence maintained across days of async execution",
  },

  {
    type: "callout",
    tone: "tip",
    ko: "턴(Turn) 수가 누적되어도 맥락이 보존되고 에러 누적이 차단되는 방식을 확인해보세요. <a href=\"/playground/long-horizon/\">장기 추론 맥락 보존 시뮬레이터 →</a>",
    en: "Observe how context is retained and error propagation is blocked over extended turns. <a href=\"/playground/long-horizon/\">Long-Horizon Reasoning Simulator →</a>",
  },

  { type: "h2", ko: "에러 누적(Error Propagation) 차단과 안전 메커니즘", en: "Preventing Error Propagation & Safety Fallback" },

  {
    type: "p",
    s: [
      { ko: "장기 에이전틱 작업에서 가장 무서운 적은 에러의 누적입니다.", en: "The biggest enemy in long-horizon agent work is error propagation." },
      { ko: "초기 턴에서의 사소한 오판이 뒤로 갈수록 증폭되어 전체 결과를 망치기 때문입니다.", en: "A minor misjudgment in early turns amplifies over time, destroying the final outcome." },
      { ko: "Claude Fable 5는 높은 자체 검증 성능으로 장기 호흡에서도 맥락 이탈율(Context Drift)을 <strong>0.8% 미만</strong>으로 제어합니다.", en: "Claude Fable 5 utilizes high self-verification capabilities to keep context drift below <strong>0.8%</strong> even across long horizons." },
    ],
  },

  {
    type: "p",
    s: [
      { ko: "동시에 민감 작업 감지 시 <strong>Claude Opus 4.8</strong>로의 안전한 절환(Fallback) 메커니즘을 내장하고 있습니다.", en: "It also embeds a safe fallback mechanism to <strong>Claude Opus 4.8</strong> upon detecting sensitive operations." },
      { ko: "자율성과 안전성 사이의 균형을 극대화한 설계입니다.", en: "This design maximizes the balance between autonomy and safety." },
    ],
  },

  { type: "h2", ko: "요약과 다음 편 예고", en: "Summary & Next Episode" },

  {
    type: "p",
    s: [
      { ko: "병렬 분산이 오케스트레이션의 지평을 넓혔다면, Fable 5는 단일 에이전트가 도달할 수 있는 추론의 깊이를 넓혔습니다.", en: "While parallel orchestration broadens execution width, Fable 5 deepens single-agent reasoning capabilities." },
      { ko: "마지막 3편에서는 <strong>Google Antigravity(AGY)와 Claude Code를 실무에서 어떻게 적재적소에 조합할지</strong>, 그리고 <strong>Ponytail 플러그인을 활용한 과잉 엔지니어링 억제법</strong>을 다룹니다.", en: "In the final Episode 3, we will cover <strong>how to combine AGY and Claude Code in production</strong>, alongside <strong>preventing over-engineering with Ponytail</strong>." },
    ],
  },
];
