import type { BiBlock } from "./aiParadox";

// Model scores: measured 2026-10-16 in Chrome WebGPU on /arcade/crossy/ and /arcade/galaga/, model side only,
// 3 games each (random seeds). No-model baselines: public/lab/crossy.js + galaga.js, seeds 1–30, guardrail =
// allowed(); a blocked pick falls back to a random allowed move. Same rules as the arcade (TICKS 240).
// 4-1 hint experiment (2026-10-17, not shipped): outlook.fire = "WILL HIT"/"will miss" via playing "stay"
// until the bullet lands; Qwen3 run in Node CPU q8 (scratch duel-eval.mjs), seed 1, 80 ticks, guardrail on.
export const blocks: BiBlock[] = [
  {
    type: "callout",
    tone: "tldr",
    ko: "<strong>결론부터.</strong> 하네스는 모델 바깥의 전부입니다. 무엇을 보여 줄지, 무엇을 고를 수 있게 할지, 모델의 버릇을 어떻게 보정할지를 정합니다. 같은 Qwen3-0.6B가 하네스를 끄면 길을 평균 4줄 건너고, 켜면 40줄 건넙니다. 그런데 모델 없이 \"항상 위로\"에 같은 하네스만 붙여도 50줄이 나왔습니다. 성적을 올린 건 대부분 하네스였습니다.",
    en: "<strong>The short version.</strong> The harness is everything outside the model. It decides what the model sees, what it may pick, and how its habits get corrected. The same Qwen3-0.6B crosses 4 rows on average with the harness off and 40 with it on. But with no model at all — just \"always go up\" plus the same harness — we got 50. Most of the gain came from the harness.",
  },

  {
    type: "p",
    s: [
      { ko: "<a href=\"/arcade/\">오락실</a>에 사람과 디시전 모델이 같은 판을 나란히 하는 게임을 두 개 올렸습니다.", en: "The <a href=\"/arcade/\">arcade</a> now has two games where a person and a decision model play the same board side by side." },
      { ko: "모델 쪽에는 \"하네스 켜기\" 스위치가 있습니다.", en: "The model's side has a \"harness on\" switch." },
      { ko: "켜면 모델이 훨씬 잘합니다. 이번 글은 왜 그런지, 그리고 그 공이 누구 몫인지 봅니다.", en: "Turn it on and the model does far better. This post looks at why, and at who deserves the credit." },
    ],
  },

  {
    type: "callout",
    tone: "tip",
    ko: "직접 스위치를 켜고 꺼 보세요. 모델이 받은 글도 그대로 볼 수 있습니다. <a href=\"/arcade/crossy/\">길 건너기 →</a> · <a href=\"/arcade/galaga/\">갤러그 →</a>",
    en: "Flip the switch yourself. You can also read the exact text the model gets. <a href=\"/arcade/crossy/\">Road crossing →</a> · <a href=\"/arcade/galaga/\">Galaga →</a>",
  },

  { type: "hr" },

  { type: "h2", ko: "1. 하네스란 — 모델 바깥의 전부", en: "1. What a harness is — everything outside the model" },
  {
    type: "p",
    s: [
      { ko: "모델이 하는 일은 하나입니다. 글을 받아 다음에 올 것의 확률을 내놓습니다.", en: "A model does one thing. It takes text and returns probabilities for what comes next." },
      { ko: "어떤 글을 넣을지, 어떤 선택지를 줄지, 나온 확률을 어떻게 쓸지는 모델 바깥에서 정합니다.", en: "What text goes in, which options it gets, and how the probabilities are used are all decided outside the model." },
      { ko: "이 바깥 부분을 <strong>하네스</strong>라고 부릅니다. Claude Code나 Codex 같은 코딩 에이전트도 모델 위에 얹은 하네스입니다.", en: "That outside part is the <strong>harness</strong>. Coding agents like Claude Code and Codex are harnesses built around a model." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "OpenAI는 2026년 2월 이 작업을 <strong>하네스 엔지니어링</strong>이라고 불렀습니다.", en: "In February 2026 OpenAI called this work <strong>harness engineering</strong>." },
      { ko: "사람은 환경과 의도를 설계하고, 에이전트가 실행한다는 뜻입니다.", en: "People design the environment and the intent; the agent executes." },
      { ko: "오락실 게임은 이걸 아주 작게 줄인 실험입니다.", en: "The arcade games are a very small version of that experiment." },
    ],
  },

  { type: "h2", ko: "2. 스위치 하나로 달라진 성적", en: "2. One switch, very different scores" },
  {
    type: "code",
    code: "$ duel --model-only --chrome-webgpu       # 3 games each\n                        road crossing (rows)   galaga (points)\n  Qwen3-0.6B  harness   72 / 10 / 38           1100 / 1100 / 1000\n  Qwen3-0.6B  raw        3 /  3 /  5              0 (\"left\" every tick)\n  Laya        harness   25 /  8 / 13            900\n  Laya        raw        1 /  2 /  1            900 (\"fire\" every tick)",
  },
  {
    type: "p",
    s: [
      { ko: "모델은 그대로입니다. 바뀐 건 모델에게 건넨 글과 고를 수 있는 선택지뿐입니다.", en: "The model is the same. Only the text it gets and the options it may pick changed." },
      { ko: "길 건너기에서 Qwen3는 10배 넘게 멀리 갔습니다. 갤러그에서는 0점이 1,000점대가 됐습니다.", en: "In road crossing Qwen3 went more than ten times farther. In Galaga it went from 0 to over 1,000 points." },
    ],
  },

  { type: "h2", ko: "3. 하네스가 한 세 가지", en: "3. Three things the harness does" },
  { type: "p", s: [{ ko: "하네스를 켜면 세 가지가 동시에 바뀝니다.", en: "Switching the harness on changes three things at once." }] },
  {
    type: "list",
    items: [
      { ko: "<strong>보여 주는 것</strong>: 화면 대신, 수마다 다음 순간에 어떻게 되는지를 미리 계산해 건넵니다.", en: "<strong>What it sees</strong>: instead of the screen, a precomputed note on what each move leads to next tick." },
      { ko: "<strong>고를 수 있는 것</strong>: 죽거나 아무 일도 안 일어나는 수는 선택지에서 뺍니다.", en: "<strong>What it may pick</strong>: moves that die or do nothing are removed from the options." },
      { ko: "<strong>버릇 보정</strong>: 내용과 상관없이 특정 답을 좋아하는 버릇을 재서 나눠 냅니다.", en: "<strong>Habit correction</strong>: measure the model's preference for certain answers regardless of input, then divide it out." },
    ],
  },

  { type: "h2", ko: "3-1. 보여 주는 것 — 계산은 코드가", en: "3-1. What it sees — let code do the math" },
  { type: "p", s: [{ ko: "하네스를 끄면 모델은 화면을 글자로 옮긴 걸 받습니다.", en: "With the harness off, the model gets the screen transcribed into characters." }] },
  {
    type: "code",
    code: "# raw — what the model reads with the harness off\nYou are P. C = car, T = tree. Row +1 is ahead.\nrow +2 ....CC... (road, cars move left 1 cell every 3 ticks)\nrow +1 .C..C...C (road, cars move right 1 cell every 1 tick)\nrow +0 ....CP..C (road, cars move right 1 cell every 2 ticks)\nrow -1 .....T... (grass)\n\n# harness — same moment\nup: UNSAFE: a car hits you\nleft: UNSAFE: a car hits you\nright: safe\ndown: blocked by a tree\nstay: safe",
  },
  {
    type: "p",
    s: [
      { ko: "위쪽 글로 \"위로 가면 치인다\"를 알려면 꽤 많은 계산이 필요합니다.", en: "Getting \"up gets you hit\" from the top text takes a fair amount of work." },
      { ko: "내 열을 세고, 바로 윗줄의 같은 열을 찾고, 차가 한 틱 뒤 어디 있을지 더해야 합니다.", en: "Count your column, find the same column one row up, then add where the car will be one tick later." },
      { ko: "모델은 이 격자를 2차원으로 보지 않습니다. <a href=\"/blog/tokens-embeddings/\">토큰</a>이 한 줄로 늘어선 것으로 봅니다.", en: "The model doesn't see this grid in 2D. It sees a single line of <a href=\"/blog/tokens-embeddings/\">tokens</a>." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "0.6B 모델에게 이 계산은 무리입니다. 그런데 게임 코드는 이미 정확히 알고 있습니다.", en: "That's too much for a 0.6B model. The game code, though, already knows the answer exactly." },
      { ko: "하네스는 그 답을 수마다 한 줄로 적어 줍니다. 모델은 계산하지 않고 읽기만 하면 됩니다.", en: "The harness writes it out as one line per move. The model only has to read, not compute." },
    ],
  },

  { type: "h2", ko: "3-2. 고를 수 있는 것 — 가드레일", en: "3-2. What it may pick — the guardrail" },
  {
    type: "p",
    s: [
      { ko: "글로 \"UNSAFE\"라고 적어 줘도 작은 모델은 가끔 그 수를 고릅니다.", en: "Even with \"UNSAFE\" written out, a small model sometimes picks that move." },
      { ko: "그래서 하네스는 그런 수의 확률을 0으로 만들고 나머지를 다시 나눕니다.", en: "So the harness sets those moves to zero probability and renormalizes the rest." },
      { ko: "게임 화면의 확률 막대에 \"차단\"으로 뜨는 게 이것입니다.", en: "That's what shows up as \"blocked\" on the probability bars in the game." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "강화학습에서는 이걸 <strong>무효 행동 마스킹</strong>이라고 부릅니다.", en: "Reinforcement learning calls this <strong>invalid action masking</strong>." },
      { ko: "2020년 Huang과 Ontañón은 마스킹이 무효 행동에 벌점을 주는 방식보다 잘 확장된다고 보였습니다.", en: "In 2020 Huang and Ontañón showed that masking scales better than penalizing invalid actions." },
      { ko: "에이전트에서는 도구 권한이나 출력 스키마가 같은 역할을 합니다.", en: "In agents, tool permissions and output schemas play the same role." },
    ],
  },

  { type: "h2", ko: "3-3. 버릇 보정 — 모델이 좋아하는 답", en: "3-3. Habit correction — the answer a model likes" },
  {
    type: "p",
    s: [
      { ko: "하네스를 끈 갤러그에서 Qwen3는 매 틱 \"left\"만 골랐습니다. 화면이 어떻든 같았습니다.", en: "In Galaga with the harness off, Qwen3 picked \"left\" every single tick. Whatever the screen showed." },
      { ko: "빈 화면을 줘도 \"fire\"에는 0.4%만 줬습니다. 이건 판단이 아니라 버릇입니다.", en: "Even on an empty screen it gave \"fire\" only 0.4%. That's a habit, not a judgment." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "2021년 논문 Calibrate Before Use는 이 버릇을 재서 나누는 방법을 냈습니다.", en: "The 2021 paper Calibrate Before Use proposed measuring this habit and dividing it out." },
      { ko: "내용 없는 입력(\"N/A\")을 넣어 선택지별 확률을 재고, 실제 확률을 그 값으로 나눕니다.", en: "Feed a content-free input (\"N/A\"), record each option's probability, and divide real outputs by it." },
      { ko: "갤러그에는 이 보정을 켰습니다.", en: "We turned this on for Galaga." },
    ],
  },
  {
    type: "callout",
    tone: "warn",
    ko: "길 건너기에서는 보정이 오히려 성적을 깎았습니다. 모델이 \"up\"을 좋아하는 이유가 버릇이 아니라 목표였기 때문입니다. \"위로 건너라\"는 지시가 만든 선호를 나눠 내면 목표까지 지워집니다. 그래서 길 건너기에는 보정을 끕니다.",
    en: "In road crossing, calibration made scores worse. The model's preference for \"up\" wasn't a habit; it was the goal. Divide out the preference that \"cross by moving up\" creates and you erase the goal too. So calibration stays off for road crossing.",
  },

  { type: "h2", ko: "4. 그런데 공은 누구 몫인가", en: "4. So who gets the credit?" },
  {
    type: "p",
    s: [
      { ko: "여기서 질문을 하나 더 해야 합니다. 하네스를 켰을 때 잘한 건 모델일까요, 하네스일까요?", en: "One more question has to be asked here. With the harness on, is it the model doing well, or the harness?" },
      { ko: "모델을 빼고 아주 단순한 규칙에 같은 가드레일을 붙여 30판씩 돌려 봤습니다.", en: "We removed the model, attached the same guardrail to very simple rules, and ran 30 games each." },
    ],
  },
  {
    type: "code",
    code: "$ node baseline.mjs --seeds 1-30           # no model, mean score\n                          road crossing   galaga\n  fixed (up / left) raw          5.2         0\n  fixed + guardrail             50.3        73\n  random raw                     2.6       683\n  random + guardrail             3.7      1460\n  # Qwen3 + harness (3 games)   40.0      1067",
  },
  {
    type: "p",
    s: [
      { ko: "길 건너기에서 \"항상 위로\"에 가드레일만 붙여도 평균 50줄입니다. Qwen3 평균 40줄보다 높습니다.", en: "In road crossing, \"always up\" plus the guardrail averages 50 rows. That beats Qwen3's 40." },
      { ko: "갤러그에서는 무작위로 고르고 가드레일만 붙여도 1,460점입니다. 역시 Qwen3보다 높습니다.", en: "In Galaga, picking at random with the guardrail scores 1,460. Again above Qwen3." },
      { ko: "이 두 게임에서는 성적 대부분이 가드레일에서 나왔습니다. 모델은 크게 보태지 못했습니다.", en: "In these two games, most of the score came from the guardrail. The model added little." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "모델이 쓸모없다는 뜻은 아닙니다. 게임이 단순해서 한 틱 앞만 보면 거의 풀리기 때문입니다.", en: "That doesn't make the model useless. These games are simple enough that looking one tick ahead nearly solves them." },
      { ko: "앞을 더 길게 내다봐야 하는 문제라면 모델의 몫이 커집니다.", en: "On problems that need longer lookahead, the model's share grows." },
      { ko: "다만 이 측정 없이 \"모델이 10배 잘한다\"고 썼다면 하네스의 공을 모델에게 준 셈입니다.", en: "But writing \"the model does 10× better\" without this measurement would have handed the harness's credit to the model." },
    ],
  },

  { type: "h2", ko: "4-1. 힌트를 더 주면 모델이 나아질까", en: "4-1. Does a better hint help the model?" },
  {
    type: "p",
    s: [
      { ko: "갤러그 하네스는 \"맞는가\"만 알려 주고, 어디를 쏴야 맞는지는 알려 주지 않습니다.", en: "The Galaga harness only says whether you'll get hit. It never says where to shoot." },
      { ko: "그래서 \"지금 쏘면 맞는다 / 빗나간다\"를 한 줄 더 넣어 봤습니다.", en: "So we added one more line: \"this shot will hit / will miss.\"" },
    ],
  },
  {
    type: "code",
    code: "$ galaga --hint \"fire: the shot WILL HIT\"     # before -> after\n  rule bot (fires on WILL HIT), 30 seeds      1203 -> 2857\n  Qwen3 + harness, 1 seed, 80 ticks            200 ->  200   # picked \"right\" 64/80 times",
  },
  {
    type: "p",
    s: [
      { ko: "규칙 하나짜리 프로그램은 이 한 줄로 점수가 두 배 넘게 올랐습니다. Qwen3는 그대로였습니다.", en: "A one-rule program more than doubled its score from that line. Qwen3 didn't move." },
      { ko: "0.6B 모델은 문장을 읽고 그대로 따르지 못했습니다. 짧게 한 판만 잰 값이지만, 차이는 분명했습니다.", en: "The 0.6B model couldn't read the sentence and act on it. It was one short game, but the gap was clear." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "남은 방법은 맞힐 수 있을 때 \"쏘기\" 말고는 고를 수 없게 막는 것입니다.", en: "What's left is to block every option except \"fire\" whenever a shot would hit." },
      { ko: "모델 대신 무작위로 고르게 해도 이렇게 막으면 평균 2,003점이 나옵니다.", en: "With that block, even random picks instead of a model average 2,003 points." },
      { ko: "점수는 오르지만, 이건 모델이 잘해서가 아닙니다. 하네스가 판단을 하나 더 가져간 것입니다.", en: "The score goes up, but not because the model got better. The harness took over one more decision." },
    ],
  },

  { type: "h2", ko: "5. 에이전트를 만들 때 가져갈 것", en: "5. What to take into agent work" },
  {
    type: "list",
    items: [
      { ko: "<strong>정확히 계산할 수 있는 건 코드가 한다.</strong> 모델에게는 계산 결과를 읽기 쉬운 한 줄로 준다.", en: "<strong>Let code compute what code can compute exactly.</strong> Give the model the result as an easy-to-read line." },
      { ko: "<strong>선택지를 좁힌다.</strong> 틀리면 되돌릴 수 없는 행동은 프롬프트로 부탁하지 말고 아예 막는다.", en: "<strong>Narrow the options.</strong> Don't ask the prompt to avoid irreversible actions; block them outright." },
      { ko: "<strong>버릇을 잰다.</strong> 내용 없는 입력에 모델이 뭘 고르는지 먼저 본다. 단, 목표가 만든 선호까지 지우지 않는다.", en: "<strong>Measure habits.</strong> See what the model picks on a content-free input first — but don't erase preferences the goal itself creates." },
      { ko: "<strong>모델 없는 기준선을 같이 잰다.</strong> 같은 하네스에 단순한 규칙을 꽂아 돌려 보면 모델의 몫이 보인다.", en: "<strong>Measure a no-model baseline.</strong> Plug a dumb rule into the same harness and the model's real share shows up." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "마지막 항목은 이 글을 쓰다가 배웠습니다. 기준선을 재기 전까지는 저도 모델이 잘한다고 생각했습니다.", en: "I learned the last one while writing this post. Until I measured the baseline, I also thought the model was doing well." },
    ],
  },
  {
    type: "callout",
    tone: "tip",
    ko: "측정의 한계: 모델 점수는 브라우저에서 3판씩 잰 값이고, 기준선은 시드 30개 평균입니다. 하네스의 글만 주고 가드레일은 끈 조합은 아직 재지 않았습니다. 그게 모델 자체의 판단력을 보는 다음 실험입니다.",
    en: "Limits: the model scores are 3 browser games each; the baselines average 30 seeds. We haven't yet measured harness text without the guardrail. That's the next experiment for isolating the model's own judgment.",
  },

  {
    type: "sources",
    html: "<h3>출처 · Sources</h3><ul><li>OpenAI, <a href=\"https://openai.com/index/harness-engineering/\">Harness engineering: leveraging Codex in an agent-first world</a> (2026-02-11)</li><li>Zhao, Wallace, Feng, Klein, Singh, <a href=\"https://arxiv.org/abs/2102.09690\">Calibrate Before Use: Improving Few-Shot Performance of Language Models</a> (ICML 2021)</li><li>Huang, Ontañón, <a href=\"https://arxiv.org/abs/2006.14171\">A Closer Look at Invalid Action Masking in Policy Gradient Algorithms</a> (2020; FLAIRS 2022)</li><li>게임·하네스 코드: <a href=\"/lab/crossy.js\">/lab/crossy.js</a> · <a href=\"/lab/galaga.js\">/lab/galaga.js</a> · <a href=\"/lab/decide.js\">/lab/decide.js</a></li></ul>",
  },
];
