import type { BiBlock } from "./aiParadox";

export const blocks: BiBlock[] = [
  {
    type: "callout",
    tone: "tldr",
    ko: "<strong>결론부터.</strong> 지형 전체는 안 보여도 발밑의 기울기는 잴 수 있습니다. 가중치를 살짝 건드려 손실이 오르나 내리나 보면 됩니다. 그리고 기울기의 반대쪽으로 한 걸음 — <code>w ← w − lr × 기울기</code>. 이 한 줄의 반복이 학습입니다. 보폭인 learning rate가 운명을 가릅니다. 너무 작으면 기어가고, 적당하면 골짜기에 안착하고, 크면 양쪽 비탈을 왕복하고, 더 크면 걸음마다 더 높은 곳에 꽂히며 폭발합니다. LLM 사전학습은 이런 걸음 수십만 번이고, 걸음마다 수십억 개의 가중치가 함께 움직입니다.",
    en: "<strong>The short version.</strong> You can't see the whole landscape, but you can measure the slope under your feet — nudge a weight and watch the loss rise or fall. Then step against the slope: <code>w ← w − lr × slope</code>. That one line, repeated, is training. The learning rate — your step size — decides your fate: too small crawls, right settles into the valley, too big bounces between the slopes, way too big lands higher with every step and the loss explodes. An LLM pre-training run is hundreds of thousands of these steps, each one moving billions of weights at once.",
  },

  {
    type: "p",
    s: [
      { ko: "<a href=\"/blog/loss-function/\">0편</a>에서 우리는 점수판을 얻었습니다.", en: "In <a href=\"/blog/loss-function/\">part 0</a> we built the scoreboard." },
      { ko: "어떤 가중치 W를 내밀어도 손실이 '얼마나 틀렸는지'를 숫자 하나로 답합니다.", en: "Hand it any weights W and the loss answers \"how wrong\" with one number." },
      { ko: "데이터를 고정하면 그 숫자들이 지형이 됩니다 — W마다 고도 하나.", en: "Fix the data and those numbers become a landscape — one altitude per W." },
      { ko: "학습은 그 지형에서 낮은 곳 찾기입니다.", en: "Learning is finding a low point in that landscape." },
      { ko: "그런데 어떻게 찾을까요?", en: "But how?" },
    ],
  },

  {
    type: "p",
    s: [
      { ko: "전부 시험해 볼 수는 없습니다.", en: "We can't try them all." },
      { ko: "가중치가 수백만 개면 후보 W는 사실상 무한합니다.", en: "With millions of weights, the candidate Ws are effectively infinite." },
      { ko: "지도도 없습니다 — 지형 전체를 볼 방법이 없으니까요.", en: "And there's no map — no way to see the whole landscape at once." },
      { ko: "우리가 아는 건 지금 서 있는 자리의 고도뿐입니다.", en: "All we know is the altitude of the spot we're standing on." },
      { ko: "그걸로 충분합니다.", en: "That's enough." },
    ],
  },

  { type: "h2", ko: "1. 안개 속의 등산가", en: "1. A hiker in the fog" },
  {
    type: "p",
    s: [
      { ko: "안개가 짙게 낀 산비탈에 서 있다고 해봅시다.", en: "Picture yourself on a hillside in thick fog." },
      { ko: "골짜기는 안 보이고 지도도 없습니다.", en: "You can't see the valley, and there's no map." },
      { ko: "하지만 발바닥은 압니다 — 어느 쪽이 내리막인지, 얼마나 가파른지.", en: "But your feet know — which way is downhill, and how steep." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "그러면 전략은 하나뿐입니다.", en: "Then there's only one strategy." },
      { ko: "발밑의 기울기를 느끼고, 내리막으로 한 걸음.", en: "Feel the slope underfoot; take one step downhill." },
      { ko: "다시 느끼고, 다시 한 걸음.", en: "Feel again; step again." },
      { ko: "지형 전체를 몰라도 이 반복은 낮은 곳으로 흘러갑니다.", en: "Without ever seeing the landscape, this loop flows toward a low point." },
    ],
  },

  { type: "h2", ko: "2. 살짝 밀어보면 기울기를 안다", en: "2. Nudge it and feel the slope" },
  {
    type: "p",
    s: [
      { ko: "모델은 밀어보는 것으로 발밑을 느낍니다.", en: "A model feels the ground by nudging." },
      { ko: "0편의 최소 모델을 다시 씁니다 — 예측 = <code>w × x</code>, 데이터는 x = 2에 정답 6, 손실은 <code>(2w − 6)²</code>.", en: "Reuse part 0's smallest model — prediction = <code>w × x</code>, one data point x = 2 with answer 6, loss <code>(2w − 6)²</code>." },
      { ko: "w = 2에서 손실은 <code>(4 − 6)² = 4</code>입니다.", en: "At w = 2 the loss is <code>(4 − 6)² = 4</code>." },
      { ko: "w를 2.01로 아주 조금 올려봅니다.", en: "Nudge w up a hair, to 2.01." },
      { ko: "손실은 <code>3.9204</code> — 내려갔습니다.", en: "The loss becomes <code>3.9204</code> — it fell." },
      { ko: "이 자리에서는 w를 키우는 쪽이 내리막입니다.", en: "At this spot, increasing w is downhill." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "방향만이 아니라 가파름도 나옵니다.", en: "The nudge gives more than direction — it gives steepness." },
      { ko: "손실 변화 ÷ w 변화 = <code>−0.0796 ÷ 0.01 ≈ −8</code>.", en: "Change in loss ÷ change in w: <code>−0.0796 ÷ 0.01 ≈ −8</code>." },
      { ko: "이 숫자가 그 자리의 <strong>기울기</strong>입니다 — 방향과 가파름을 한꺼번에 담은 수.", en: "That number is the <strong>slope</strong> at that spot — direction and steepness in one." },
      { ko: "(수학에서는 미분(derivative)이라 부릅니다. 이 시리즈에서는 '밀어서 잰다'는 감각이면 충분합니다.)", en: "(Math calls it a derivative. For this series, measure-by-nudging is all we need.)" },
      { ko: "반대편도 재봅시다: w = 4에서 4.01로 올리면 손실은 4에서 <code>4.0804</code>로 오릅니다 — 기울기 약 +8.", en: "Measure the far side too: at w = 4, nudging to 4.01 pushes the loss from 4 up to <code>4.0804</code> — slope about +8." },
      { ko: "부호가 곧 방향입니다. 음수면 w를 키우는 쪽이, 양수면 줄이는 쪽이 내리막입니다.", en: "The sign is the direction: negative means raising w is downhill; positive means lowering it is." },
    ],
  },

  { type: "h2", ko: "3. 업데이트 한 줄", en: "3. The one-line update" },
  {
    type: "p",
    s: [
      { ko: "이제 규칙을 쓸 수 있습니다: <code>새 w = w − lr × 기울기</code>.", en: "Now we can write the rule: <code>new w = w − lr × slope</code>." },
      { ko: "빼기인 이유는 부호에 있습니다.", en: "The minus sign follows from the sign." },
      { ko: "기울기가 양수라는 건 w를 키울수록 손실이 는다는 뜻입니다 — 그러니 빼서 반대로 갑니다.", en: "A positive slope means raising w raises the loss — so we subtract, and walk the other way." },
      { ko: "방금 본 w = 2에서는 기울기가 음수(−8)였으니, 빼면 w가 커집니다 — 골짜기 쪽으로.", en: "At w = 2 the slope was negative (−8), so subtracting pushes w up — toward the valley." },
      { ko: "<code>lr</code>은 learning rate, 보폭입니다.", en: "<code>lr</code> is the learning rate — the step size." },
      { ko: "이 걷기의 이름이 <strong>경사하강(gradient descent)</strong>이고, 이 한 줄의 반복이 학습의 전부입니다.", en: "This walk is called <strong>gradient descent</strong>, and this line, repeated, is all of training." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "숫자로 걸어봅시다.", en: "Let's walk it with real numbers." },
      { ko: "가장 단순한 골짜기, 포물선 <code>손실 = (w − 3)²</code> — 바닥은 w = 3입니다.", en: "The simplest valley: the parabola <code>loss = (w − 3)²</code>, bottom at w = 3." },
      { ko: "이 포물선의 기울기는 <code>2(w − 3)</code>입니다. 유도는 필요 없습니다 — 결과만 받아 씁니다.", en: "Its slope is <code>2(w − 3)</code>. No derivation needed — we just take the result." },
      { ko: "믿기지 않으면 아까처럼 밀어보면 됩니다: w = 5에서 5.01로 올리면 손실은 4에서 <code>4.0401</code>로, 변화율은 <code>0.0401 ÷ 0.01 ≈ +4</code> — 공식의 <code>2(5 − 3) = 4</code> 그대로입니다.", en: "Don't trust it? Nudge, like before: from w = 5 to 5.01 the loss goes 4 → <code>4.0401</code>, a rate of <code>0.0401 ÷ 0.01 ≈ +4</code> — exactly the formula's <code>2(5 − 3) = 4</code>." },
      { ko: "w = 5, lr = 0.25로 출발: <code>5 − 0.25 × 4 = 4</code>.", en: "Start at w = 5 with lr = 0.25: <code>5 − 0.25 × 4 = 4</code>." },
      { ko: "w = 4의 기울기는 +2, 다음 걸음은 <code>4 − 0.25 × 2 = 3.5</code>. 또 한 걸음이면 3.25.", en: "At w = 4 the slope is +2, so next: <code>4 − 0.25 × 2 = 3.5</code>. One more lands at 3.25." },
      { ko: "바닥에 가까울수록 기울기가 작아지고, 보폭도 저절로 짧아집니다.", en: "Near the bottom the slope shrinks, so the steps shorten on their own." },
      { ko: "3에 사뿐히 안착합니다.", en: "It settles gently onto 3." },
    ],
  },
  {
    type: "code",
    code: [
      "loss = (w - 3)^2      slope(w) = 2(w - 3)      lr = 0.25",
      "rule: w <- w - lr * slope",
      "",
      "w = 5.000   slope = +4.0   next w = 5.000 - 0.25*4.0 = 4.000",
      "w = 4.000   slope = +2.0   next w = 4.000 - 0.25*2.0 = 3.500",
      "w = 3.500   slope = +1.0   next w = 3.500 - 0.25*1.0 = 3.250",
      "w = 3.250   slope = +0.5   next w = 3.250 - 0.25*0.5 = 3.125",
      "  ...",
      "w -> 3      (the bottom: slope -> 0, steps fade out)",
    ].join("\n"),
  },

  { type: "h2", ko: "4. learning rate — 보폭이 운명을 가른다", en: "4. Learning rate — step size is destiny" },
  {
    type: "p",
    s: [
      { ko: "같은 포물선, 같은 출발점 w = 5, 같은 규칙.", en: "Same parabola, same start at w = 5, same rule." },
      { ko: "lr 하나만 바꿔도 네 가지 운명이 갈립니다.", en: "Change only the lr and four different fates unfold." },
      { ko: "실전에서 학습을 자주 망가뜨리는 다이얼 중 하나가 이것입니다.", en: "In practice, this dial is one of the usual ways a run breaks." },
    ],
  },
  {
    type: "list",
    items: [
      { ko: "<strong>기어간다 (lr = 0.01).</strong> 첫걸음은 <code>5 − 0.01 × 4 = 4.96</code>. 걸음마다 골짜기까지의 거리가 2%씩만 줍니다. 100걸음 뒤에도 w ≈ 3.27입니다(2%씩 100번 줄인 결과). 방향은 맞는데 하세월입니다.", en: "<strong>Crawl (lr = 0.01).</strong> First step: <code>5 − 0.01 × 4 = 4.96</code>. Each step closes only 2% of the gap to the valley. After 100 steps, w ≈ 3.27 — the result of shrinking the gap 2% a hundred times. Right direction, glacial pace." },
      { ko: "<strong>안착한다 (lr = 0.25).</strong> 걸음마다 거리가 절반으로 줍니다. 5 → 4 → 3.5 → 3.25 — 몇 걸음이면 사실상 바닥입니다.", en: "<strong>Settle (lr = 0.25).</strong> Each step halves the gap. 5 → 4 → 3.5 → 3.25 — effectively at the bottom in a handful of steps." },
      { ko: "<strong>왕복한다 (lr = 1).</strong> w = 5의 기울기는 +4, 걸음은 −4 — w = 1에 착지합니다. 바닥을 지나쳐 반대편 <em>같은 높이</em>에 떨어진 겁니다. 그래서 기울기는 정확히 거울상인 −4, 걸음은 +4 — 정확히 5로 복귀합니다. 영원히 5 ↔ 1, 바닥은 한 번도 못 밟습니다.", en: "<strong>Oscillate (lr = 1).</strong> At w = 5 the slope is +4, the step −4 — landing at w = 1. That's past the bottom, at the <em>same height</em> on the far side. So the slope is the exact mirror, −4, and the step +4 — right back to 5. Forever 5 ↔ 1, never touching bottom." },
      { ko: "<strong>폭발한다 (lr = 1.5).</strong> <code>5 − 1.5 × 4 = −1</code>, 그다음 11, 그다음 −13. 착지할 때마다 골짜기와의 거리가 두 배가 되고, 손실은 걸음마다 더 높은 곳에 꽂힙니다. loss가 치솟다 NaN이 찍히는 런 — 그 익숙한 그림의 유력한 용의자가 이겁니다.", en: "<strong>Explode (lr = 1.5).</strong> <code>5 − 1.5 × 4 = −1</code>, then 11, then −13. Every landing doubles the distance to the valley, and each step lands the loss higher than the last. The run where the loss rockets up and prints NaN — this is a prime suspect." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "왕복과 폭발의 원리는 하나입니다.", en: "Oscillation and explosion share one mechanism." },
      { ko: "포물선은 골짜기에서 멀수록 가파릅니다.", en: "The farther from the valley, the steeper the parabola." },
      { ko: "가파른 기울기에 큰 보폭을 곱하면 걸음이 바닥을 지나쳐 반대편 비탈에 꽂힙니다.", en: "Multiply a steep slope by a big step size and the step flies past the bottom into the far slope." },
      { ko: "착지한 곳이 더 가파르면 다음 걸음은 더 큽니다 — 그게 폭발입니다.", en: "If the landing spot is steeper still, the next step is bigger — that's the explosion." },
    ],
  },
  {
    type: "code",
    code: [
      "loss = (w-3)^2   valley at w = 3   start at w = 5",
      "slope(w) = 2(w-3)      rule: w <- w - lr * slope",
      "",
      "lr = 0.01   5 -> 4.96 -> 4.9208 -> ...          crawls   (gap -2%/step)",
      "lr = 0.25   5 -> 4 -> 3.5 -> 3.25 -> 3.125      settles  (gap halves)",
      "lr = 1.0    5 -> 1 -> 5 -> 1 -> 5 -> ...        oscillates forever",
      "lr = 1.5    5 -> -1 -> 11 -> -13 -> 35 -> ...   diverges (gap doubles)",
      "",
      "after 100 steps:",
      "lr = 0.01   w = 3.27       still walking",
      "lr = 0.25   w = 3.000...   done long ago",
      "lr = 1.5    |w| ~ 10^30    loss ~ 10^61 (float32 -> inf/NaN)",
    ].join("\n"),
  },

  {
    type: "p",
    s: [
      { ko: "이제 0편의 그 그림 — 내려가는 loss curve — 을 다시 봅시다.", en: "Now look again at that picture from part 0 — the descending loss curve." },
      { ko: "그건 은유가 아니라 기록입니다.", en: "It's not a metaphor; it's a log." },
      { ko: "걸음마다 고도를 한 번씩 적은, 이 걷기의 고도 기록.", en: "The altitude log of this walk, one entry per step." },
      { ko: "작은 모델은 수천 걸음, LLM 사전학습은 수십만 걸음입니다 — 걸음마다 수십억 개의 가중치가 함께 움직이고, GPU 클러스터에서 몇 주씩 걷습니다.", en: "A small model walks thousands of steps; an LLM pre-training run, hundreds of thousands — each step moving billions of weights at once, for weeks on a GPU cluster." },
      { ko: "곡선이 미끄러져 내려가면 걷기가 잘되는 것이고, 치솟으면 방금 본 lr = 1.5의 세계에 들어간 겁니다.", en: "A curve sliding down means the walk is working; a curve rocketing up means you've entered the lr = 1.5 regime we just watched." },
    ],
  },

  {
    type: "p",
    s: [
      { ko: "정직하게 두 가지만 짚습니다.", en: "Two honest caveats." },
      { ko: "이 걷기가 찾는 건 <em>근처의</em> 낮은 곳입니다 — 세상에서 제일 낮은 곳이라는 보장은 없습니다.", en: "This walk finds <em>a nearby</em> low point — no guarantee it's the world's lowest." },
      { ko: "거대 모델에서는 그걸로 충분합니다. 실전이 반복해서 증명했습니다.", en: "For huge models, that's enough. Practice has proven it again and again." },
      { ko: "그리고 0편의 복선 하나가 여기서 회수됩니다 — 제곱오차가 매끈하다고 했습니다.", en: "And one part-0 setup pays off here — we said squared error is smooth." },
      { ko: "매끈한 지형은 어디서나 기울기가 정의된다는 뜻입니다. 이 걷기의 전제 조건이 바로 그것입니다.", en: "A smooth landscape has a well-defined slope everywhere. That is exactly this walk's precondition." },
    ],
  },

  {
    type: "callout",
    tone: "tip",
    ko: "<strong>실전에서는.</strong> 매 걸음 데이터 전체로 기울기를 재지 않습니다. 작은 묶음(mini-batch)으로 어림잡아 걷는 게 <strong>SGD</strong>입니다 — 걸음은 조금 흔들리지만 훨씬 쌉니다. <strong>Adam</strong>은 가중치마다 보폭을 자동으로 조절해 주는 변형이고, 실전에서는 그 개량형인 <strong>AdamW</strong>가 LLM 학습의 표준입니다. LLM 사전학습 런 하나는 GPU 클러스터에서 이런 걸음 수십만 번이고, learning rate를 학습 중에 어떻게 올렸다 내릴지 — 스케줄 — 는 ML 전체에서 가장 공들여 튜닝되는 손잡이 중 하나입니다.",
    en: "<strong>In practice.</strong> Real training doesn't measure the slope on the full dataset each step. <strong>SGD</strong> walks on slopes estimated from a small mini-batch — noisier steps, vastly cheaper. <strong>Adam</strong> is a variant that adapts each weight's step size automatically; its refinement <strong>AdamW</strong> is the standard for LLM training. One LLM pre-training run is hundreds of thousands of these steps on a GPU cluster, and how the learning rate ramps and decays over a run — the schedule — is among the most-tuned knobs in all of ML.",
  },

  {
    type: "p",
    s: [
      { ko: "직접 굴려보면 몸에 남습니다.", en: "It sticks better if you roll it yourself." },
      { ko: "<a href=\"/playground/gradient/\">실험실</a>에 포물선과 공을 준비해 뒀습니다.", en: "The <a href=\"/playground/gradient/\">playground</a> has the parabola and a ball waiting." },
      { ko: "learning rate 슬라이더를 끌면서 공을 떨어뜨려 보세요.", en: "Drag the learning-rate slider and drop the ball." },
      { ko: "안착, 왕복, 화면 밖으로 날아가는 폭발까지 — 네 가지 운명을 30초면 다 봅니다.", en: "Settling, ping-ponging, flying clean off the chart — all four fates in thirty seconds." },
    ],
  },

  { type: "h2", ko: "다음 편 — 수백만 개의 기울기를 한 번에", en: "Next up — millions of slopes in one pass" },
  {
    type: "p",
    s: [
      { ko: "지금까지는 가중치가 하나였습니다.", en: "So far we've held a single weight." },
      { ko: "진짜 모델은 수백만 개고, GPT급은 수십억 개입니다.", en: "A real model has millions; GPT-scale, billions." },
      { ko: "원리는 그대로입니다 — 가중치 하나하나에 같은 질문을 던집니다: 너를 올리면 손실이 오르니, 내리니?", en: "The principle survives — you ask every weight the same question: if I raise you, does the loss go up or down?" },
      { ko: "그 기울기를 전부 모은 목록의 이름이 <strong>gradient</strong>입니다. '경사하강'의 gradient가 바로 이것입니다.", en: "The list of all those slopes is called the <strong>gradient</strong> — the gradient in \"gradient descent.\"" },
      { ko: "한 걸음은 모든 가중치를 각자의 기울기 반대쪽으로 조금씩, 한꺼번에 옮깁니다.", en: "One step moves every weight a little against its own slope, all at once." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "그러려면 한 걸음마다 <em>모든</em> 가중치의 기울기가 필요합니다 — 수백만 개, 매 걸음 새로.", en: "That means every step needs the slope of <em>every</em> weight — millions of them, fresh, each step." },
      { ko: "아까처럼 하나씩 밀어보면, 걸음 하나에 모델을 수백만 번 돌려야 합니다.", en: "Nudging one at a time, as we did, would take millions of model runs per step." },
      { ko: "불가능합니다.", en: "Impossible." },
      { ko: "그런데 실제 학습은 모델을 앞으로 한 번 돌리고, 뒤로 한 번 훑는 것으로 전부 얻습니다.", en: "Yet real training gets them all by running the model forward once and sweeping backward once." },
      { ko: "그 트릭의 이름이 <strong>backpropagation</strong>입니다. 다음 편에서 뜯어봅니다.", en: "That trick is called <strong>backpropagation</strong>. We take it apart next." },
    ],
  },
];
