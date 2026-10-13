import type { BiBlock } from "./aiParadox";

// All numbers below were measured in the browser with SmolLM2-135M-Instruct
// (transformers.js 4.3.0, WebGPU, q4f16) via /lab/lm.js + /lab/sampling.js on 2026-10-13.
export const blocks: BiBlock[] = [
  {
    type: "callout",
    tone: "tldr",
    ko: "<strong>결론부터.</strong> 다음 토큰 분포는 문맥마다 모양이 다릅니다. 그래서 <strong>개수로 자르는 top-k</strong>는 어느 쪽에선 꼭 틀립니다. <strong>누적 확률로 자르는 top-p</strong>는 모양에 맞춰 후보 수가 바뀌지만, temperature를 올리면 꼬리가 쏟아져 들어옵니다. <strong>1위 확률에 비례해 자르는 min-p</strong>는 이 경우에도 버팁니다. 전부 실제 모델로 잰 숫자입니다.",
    en: "<strong>The short version.</strong> The next-token distribution changes shape with context. So <strong>top-k, which cuts by count</strong>, is bound to be wrong somewhere. <strong>top-p, which cuts by cumulative probability</strong>, adapts its candidate count to the shape, but raise the temperature and the tail floods in. <strong>min-p, which cuts relative to the top token</strong>, holds up even then. Every number here was measured on a real model.",
  },

  {
    type: "p",
    s: [
      { ko: "4편 GPT에서 샘플링 규칙을 정의로만 봤습니다.", en: "In part 4 (GPT) we only saw the sampling rules as definitions." },
      { ko: "이번엔 실제 언어 모델의 분포 위에서 잘라 봅니다.", en: "This time we cut a real language model's distribution." },
      { ko: "모델은 <strong>SmolLM2-135M</strong>이고, 이 글을 읽는 브라우저 안에서 그대로 돌아갑니다.", en: "The model is <strong>SmolLM2-135M</strong>, and it runs right inside the browser you're reading this in." },
    ],
  },

  {
    type: "callout",
    tone: "tip",
    ko: "읽으면서 같이 돌려 보세요. 아래 숫자는 전부 이 실험실에서 나왔습니다. <a href=\"/playground/sampling/\">샘플링 실험실 열기 →</a>",
    en: "Run it alongside as you read — every number below came from this lab. <a href=\"/playground/sampling/\">Open the sampling lab →</a>",
  },

  { type: "hr" },

  { type: "h2", ko: "1. 분포는 문맥마다 모양이 다르다", en: "1. The distribution changes shape with context" },
  {
    type: "p",
    s: [
      { ko: "모델은 다음 토큰마다 어휘 <strong>49,152개 전부</strong>에 확률을 매깁니다.", en: "For every next token, the model assigns a probability to <strong>all 49,152</strong> tokens in its vocabulary." },
      { ko: "두 문장을 넣어 봤습니다.", en: "I fed it two sentences." },
    ],
  },
  {
    type: "code",
    code: "$ next-token \"The capital of France is\"     # entropy 2.97 bits\n  ␣the        ██████████████████████████  51.0%\n  ␣Paris      ██████████████░░░░░░░░░░░░  28.2%\n  ␣located    █░░░░░░░░░░░░░░░░░░░░░░░░░   1.9%\n\n$ next-token \"My favorite food is\"         # entropy 7.76 bits\n  ␣the        █████░░░░░░░░░░░░░░░░░░░░░   9.0%\n  ␣a          ████░░░░░░░░░░░░░░░░░░░░░░   8.6%\n  ␣definitely ██░░░░░░░░░░░░░░░░░░░░░░░░   4.6%",
  },
  {
    type: "p",
    s: [
      { ko: "첫 문장은 두 토큰이 확률의 79%를 가져갑니다.", en: "In the first sentence, two tokens take 79% of the probability." },
      { ko: "둘째 문장은 1위가 겨우 9%입니다.", en: "In the second, the top token gets barely 9%." },
      { ko: "엔트로피로 보면 2.97비트 대 7.76비트, 불확실성이 두 배 넘게 차이 납니다.", en: "In entropy terms that's 2.97 bits versus 7.76 — more than twice the uncertainty." },
      { ko: "샘플링 규칙은 이 두 모양을 <strong>같은 설정으로</strong> 다뤄야 합니다.", en: "A sampling rule has to handle both shapes <strong>with the same settings</strong>." },
    ],
  },

  { type: "h2", ko: "2. top-k — 개수로 자르면 한쪽에서 꼭 틀린다", en: "2. top-k — cutting by count is wrong somewhere" },
  {
    type: "p",
    s: [
      { ko: "top-k는 상위 k개만 남깁니다. k=40으로 두 문장을 잘라 봤습니다.", en: "top-k keeps only the top k. I cut both sentences at k=40." },
    ],
  },
  {
    type: "list",
    items: [
      { ko: "<strong>France</strong>: 40개가 남지만 확률의 79%는 단 2개에 몰려 있습니다. 나머지 38개는 13.5%를 잘게 나눠 갖고, 40위는 0.099%입니다. 확신이 큰 문맥에 후보를 40개나 열어 둔 셈입니다.", en: "<strong>France</strong>: 40 remain, but 79% of the mass sits on just 2. The other 38 split 13.5% in crumbs; #40 has 0.099%. We've opened 40 slots in a context the model is sure about." },
      { ko: "<strong>food</strong>: 40개 밖으로 잘려 나간 확률이 <strong>40.2%</strong>입니다. 모델이 열어 둔 가능성의 5분의 2를 버린 셈입니다.", en: "<strong>food</strong>: <strong>40.2%</strong> of the mass is cut beyond the top 40 — two-fifths of what the model considered possible, thrown away." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "뾰족한 분포엔 k가 너무 크고, 평평한 분포엔 너무 작습니다.", en: "For the peaked distribution k is too big; for the flat one, too small." },
      { ko: "어떤 k를 골라도 이 둘을 동시에 맞출 수는 없습니다.", en: "No single k fits both at once." },
    ],
  },

  { type: "h2", ko: "3. top-p — 개수를 모양에 맞춘다, temperature 전까지는", en: "3. top-p — the count follows the shape, until temperature" },
  {
    type: "p",
    s: [
      { ko: "top-p(nucleus)는 누적 확률이 p에 닿는 최소 집합만 남깁니다.", en: "top-p (nucleus) keeps the smallest set whose cumulative probability reaches p." },
      { ko: "Holtzman 등(ICLR 2020)이 확률 최대만 좇는 디코딩이 밋밋하고 반복적인 글을 낸다는 문제를 풀려고 제안했습니다.", en: "Holtzman et al. (ICLR 2020) proposed it to fix likelihood-maximizing decoding producing bland, repetitive text." },
      { ko: "p=0.9로 같은 두 문장을 자르면 남는 후보 수가 확 달라집니다.", en: "Cut the same two sentences at p=0.9 and the candidate counts diverge sharply." },
    ],
  },
  {
    type: "code",
    code: "$ top-p 0.9                       # kept / 49,152\n  France    ░ 21\n  food      ████████████████████ 561\n  code      ░ 26                  # \"def fibonacci(n):\"",
  },
  {
    type: "p",
    s: [
      { ko: "확신할 땐 좁게, 헷갈릴 땐 넓게 잡습니다.", en: "Narrow when confident, wide when unsure." },
      { ko: "top-k의 실패를 정확히 피합니다.", en: "It sidesteps exactly where top-k fails." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "문제는 temperature를 함께 올릴 때입니다.", en: "The trouble starts when you also raise the temperature." },
      { ko: "temperature는 자르기 전에 분포를 평평하게 펴니까요.", en: "Temperature flattens the distribution before anything gets cut." },
      { ko: "France 문장에서 T=1.5로 올리면 1위 확률이 51%에서 16.9%로 떨어집니다.", en: "On the France sentence, T=1.5 drops the top token from 51% to 16.9%." },
      { ko: "그러면 top-p 0.9가 남기는 후보가 21개에서 <strong>2,273개</strong>로 불어납니다.", en: "Then top-p 0.9 keeps <strong>2,273</strong> candidates instead of 21." },
      { ko: "원래 확률이 아주 낮던 꼬리 토큰들이 대거 들어옵니다.", en: "Tail tokens that used to be near-zero pour in." },
      { ko: "자르지 않고 T=1.8로 뽑으면 이렇게 됩니다.", en: "Sample at T=1.8 with no truncation and you get this:" },
    ],
  },
  {
    type: "code",
    code: "$ generate \"My favorite food is\" --temperature 1.8   # no truncation\n  disturbance Soldier sprinted responds rabiescomENT} someday\n    thirty glasses microbiQA ...NSAwin analy",
  },

  { type: "h2", ko: "4. min-p — 1위 확률에 비례한 문턱", en: "4. min-p — a threshold relative to the top token" },
  {
    type: "p",
    s: [
      { ko: "min-p는 1위 확률에 비례해 문턱을 정합니다.", en: "min-p sets its threshold in proportion to the top token's probability." },
      { ko: "min-p=0.1이면 \"1위 확률의 10% 이상\"인 토큰만 남깁니다.", en: "With min-p=0.1, only tokens with at least 10% of the top probability survive." },
      { ko: "Nguyen 등(ICLR 2025)이 제안했고, 특히 높은 temperature에서 품질과 다양성을 함께 지킨다고 보고했습니다.", en: "Nguyen et al. (ICLR 2025) proposed it and reported better quality and diversity, especially at high temperatures." },
    ],
  },
  {
    type: "code",
    code: "$ min-p 0.1                       # kept / 49,152\n  France    2      # ␣the, ␣Paris\n  food      15\n  code      5",
  },
  {
    type: "p",
    s: [
      { ko: "모델이 확신하면 1위가 높아 문턱도 높아집니다.", en: "When the model is confident, the top token is high, so the bar is high." },
      { ko: "헷갈리면 1위가 낮아 문턱도 같이 내려갑니다.", en: "When it's unsure, the top token is low and the bar drops with it." },
      { ko: "temperature로 1위가 낮아지면 문턱도 같이 내려가지만, 늘 1위 대비 비율입니다.", en: "When temperature lowers the top token, the bar drops too — but it's always a ratio of the top." },
      { ko: "그래서 1위보다 한참 낮은 꼬리는 여전히 잘립니다.", en: "So the far tail, way below the top, still gets cut." },
      { ko: "같은 T=1.8에 min-p 0.1만 걸었더니 이렇게 나왔습니다.", en: "Same T=1.8, with only min-p 0.1 added:" },
    ],
  },
  {
    type: "code",
    code: "$ generate \"My favorite food is\" --temperature 1.8 --min-p 0.1\n  my cooking, I like to create something that brings smiles to\n  my customers and your family, so this",
  },
  {
    type: "callout",
    tone: "warn",
    ko: "샘플 한 줄은 증명이 아닙니다. 135M짜리 작은 모델이고, 매번 다르게 뽑힙니다. 실험실의 \"5번 이어 쓰기\"로 직접 여러 번 비교해 보세요.",
    en: "One sample isn't proof. This is a small 135M model and every draw differs. Use the lab's \"continue 5 times\" to compare for yourself.",
  },

  { type: "h2", ko: "5. 실무에서는 — 하나만 고르고, 순서를 알아 둔다", en: "5. In practice — pick one, and know the order" },
  {
    type: "list",
    items: [
      { ko: "이 실험실의 순서는 <strong>temperature → top-k → top-p → min-p</strong>입니다. 라이브러리마다 순서와 기본값이 다를 수 있으니 문서를 확인하세요.", en: "This lab applies <strong>temperature → top-k → top-p → min-p</strong>. Libraries may differ in order and defaults, so check the docs." },
      { ko: "자르기 규칙은 보통 <strong>하나만</strong> 겁니다. 여러 개를 겹치면 가장 좁은 규칙이 이기고, 무엇이 효과를 냈는지 알기 어렵습니다.", en: "Usually apply <strong>just one</strong> truncation rule. Stack several and the narrowest wins — and you can't tell which one did the work." },
      { ko: "정답이 하나인 작업(추출·분류·코드)은 temperature를 낮게 둡니다. 다양성이 필요한 작업에서 temperature를 올린다면 min-p가 안전망이 됩니다.", en: "For single-answer tasks (extraction, classification, code), keep temperature low. If you raise it for diversity, min-p is the safety net." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "측정은 브라우저(WebGPU, 4비트 양자화)에서 했습니다.", en: "These measurements ran in the browser (WebGPU, 4-bit quantized)." },
      { ko: "기기나 백엔드에 따라 소수점 아래는 조금씩 달라질 수 있습니다.", en: "The decimals can shift a little by device and backend." },
    ],
  },

  { type: "h2", ko: "마치며", en: "Wrapping up" },
  {
    type: "p",
    s: [
      { ko: "모델이 내놓는 건 문장이 아니라 매 순간의 분포입니다.", en: "What a model produces isn't a sentence — it's a distribution at every step." },
      { ko: "같은 모델도 어떻게 자르느냐에 따라 시인이 되기도, 횡설수설하기도 합니다.", en: "The same model can be a poet or a babbler depending on how you cut it." },
      { ko: "실험실에서 France와 food를 오가며 슬라이더를 끝까지 밀어 보세요.", en: "Flip between France and food in the lab and push the sliders to the edges." },
    ],
  },

  { type: "hr" },
  {
    type: "sources",
    html: "<h3>출처 · Sources</h3><ul><li>Holtzman et al., <a href=\"https://arxiv.org/abs/1904.09751\">The Curious Case of Neural Text Degeneration</a> (ICLR 2020)</li><li>Nguyen et al., <a href=\"https://arxiv.org/abs/2407.01082\">Turning Up the Heat: Min-p Sampling for Creative and Coherent LLM Outputs</a> (ICLR 2025)</li><li><a href=\"https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct\">SmolLM2-135M-Instruct</a> (Hugging Face)</li><li><a href=\"https://huggingface.co/docs/transformers.js/index\">transformers.js</a></li></ul>",
  },
];
