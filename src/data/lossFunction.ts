import type { BiBlock } from "./aiParadox";

export const blocks: BiBlock[] = [
  {
    type: "callout",
    tone: "tldr",
    ko: "<strong>결론부터.</strong> 배우려면 점수가 필요합니다. 손실(loss)은 '얼마나 틀렸나'를 숫자 하나로 만듭니다. 값 예측엔 제곱오차 <code>(예측 − 정답)²</code>, 확률 예측엔 <code>−log p(정답)</code> — cross-entropy가 정석입니다. 데이터를 고정하면 손실은 가중치 W의 함수가 되고, 모든 W가 하나의 지형을 이룹니다. 학습 = 그 지형에서 낮은 곳 찾기. GPT의 사전학습 손실이 바로 다음 토큰 cross-entropy입니다.",
    en: "<strong>The short version.</strong> To learn, you need a score. The loss turns \"how wrong\" into a single number. For numeric predictions the classic is squared error, <code>(prediction − answer)²</code>; for probability predictions it's <code>−log p(correct)</code> — cross-entropy. Fix the data and the loss becomes a function of the weights W: every possible W forms one landscape. Learning = finding a low point in it. GPT's pre-training loss is exactly next-token cross-entropy.",
  },

  {
    type: "p",
    s: [
      { ko: "LLM 학습 소식에 늘 등장하는 그림이 있습니다.", en: "One picture keeps showing up in LLM training news." },
      { ko: "선 하나가 내려갑니다.", en: "One line, going down." },
      { ko: "그 선의 이름이 손실, loss입니다.", en: "That line is called the loss." },
      { ko: "이 글은 그 숫자가 정확히 뭔지 답합니다.", en: "This post answers exactly what that number is." },
    ],
  },

  {
    type: "p",
    s: [
      { ko: "사실 두 시리즈 내내 미뤄둔 말이기도 합니다.", en: "It's also the thing two whole series kept deferring." },
      { ko: "'가중치 W는 학습으로 얻는다 — 일단 주어졌다고 치자.'", en: "\"The weights W are learned — for now, take them as given.\"" },
      { ko: "<a href=\"/blog/nonlinear-network/\">행렬로 생각하기</a>에서도, <a href=\"/blog/gpt-decoder/\">트랜스포머 뜯어보기</a>에서도 그랬습니다.", en: "We said it in <a href=\"/blog/nonlinear-network/\">Thinking in Matrices</a>, and again in <a href=\"/blog/gpt-decoder/\">the Transformer series</a>." },
      { ko: "이번 시리즈가 그 상자를 엽니다.", en: "This series opens that box." },
      { ko: "0편은 점수판부터 만듭니다.", en: "Part 0 builds the scoreboard." },
      { ko: "W를 고치기 전에, 얼마나 틀렸는지부터 잴 수 있어야 하니까요.", en: "Before we can fix W, we have to be able to measure how wrong it is." },
    ],
  },

  { type: "h2", ko: "1. 왜 숫자 하나인가 — 손실이라는 계약", en: "1. Why one number? The contract called a loss" },
  {
    type: "p",
    s: [
      { ko: "비교할 수 없으면 개선할 수 없습니다.", en: "You can't improve what you can't compare." },
      { ko: "가중치 W와, W를 조금 바꾼 두 번째 후보가 있다고 합시다.", en: "Say we have weights W and a second candidate — W, nudged a little." },
      { ko: "어느 쪽이 나은지 말할 수 없다면, 바꿀 이유도 없습니다.", en: "If we can't say which one is better, there's no reason to change anything." },
      { ko: "'틀린 정도'가 숫자 여러 개짜리 목록이거나 감이라면, '더 낫다'는 애매해집니다.", en: "If \"how wrong\" were a list of numbers or a gut feeling, \"better\" would be ambiguous." },
      { ko: "숫자 하나면 어떤 두 후보든 줄 세울 수 있습니다.", en: "One number puts any two candidates in order." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "그래서 <strong>손실 함수</strong>를 만듭니다.", en: "So we build a <strong>loss function</strong>." },
      { ko: "(예측, 정답)을 받아 숫자 하나를 돌려줍니다.", en: "It takes (prediction, answer) and returns one number." },
      { ko: "계약은 '작을수록 좋다' 하나뿐입니다.", en: "The contract has a single clause — smaller is better." },
      { ko: "이 글의 두 손실은 완벽히 맞히면 0이 됩니다.", en: "The two losses in this post hit 0 on a perfect prediction." },
      { ko: "예측의 종류마다 정석이 하나씩 있습니다.", en: "Each kind of prediction has its own classic." },
      { ko: "쉬운 쪽부터 봅시다.", en: "Let's start with the easier one." },
    ],
  },

  { type: "h2", ko: "2. 값을 예측할 때 — 제곱오차", en: "2. Predicting a value — squared error" },
  {
    type: "p",
    s: [
      { ko: "집값을 맞히는 모델이 있다고 합시다.", en: "Say a model predicts home prices." },
      { ko: "모델이 3이라 했는데 정답은 5입니다.", en: "The model says 3; the answer is 5." },
      { ko: "오차는 <code>3 − 5 = −2</code>, 제곱하면 <code>(−2)² = 4</code> — 이게 손실입니다.", en: "The error is <code>3 − 5 = −2</code>; squared, <code>(−2)² = 4</code> — that's the loss." },
      { ko: "7이라 했어도 오차는 +2, 손실은 똑같이 4입니다.", en: "Had it said 7, the error would be +2 — and the loss the same 4." },
      { ko: "9라고 하면 오차 +4, 손실 16 — 빗나간 정도는 2배인데 손실은 4배입니다.", en: "Say 9, and the error is +4, the loss 16 — twice the miss, four times the loss." },
      { ko: "이 정석의 이름이 <strong>제곱오차</strong>, <code>(예측 − 정답)²</code>입니다 — 유일한 선택은 아니지만, 값 예측의 기본값입니다.", en: "This classic is <strong>squared error</strong>, <code>(prediction − answer)²</code> — not the only option, but the default for numeric predictions." },
    ],
  },
  {
    type: "code",
    code: [
      "prediction   answer   error   (error)^2",
      "    3           5      -2         4",
      "    7           5      +2         4    <- same miss, same loss",
      "    9           5      +4        16    <- 2x the miss, 4x the loss",
    ].join("\n"),
  },
  {
    type: "list",
    items: [
      { ko: "<strong>부호가 사라집니다.</strong> 위로 틀리든 아래로 틀리든 손실은 항상 0 이상입니다. 다만 이것만이라면 절댓값 |오차|로도 충분합니다 — 제곱을 쓰는 진짜 이유는 아래 둘입니다.", en: "<strong>The sign disappears.</strong> Overshoot or undershoot, the loss is always ≥ 0. But if that were all we wanted, absolute error |error| would do — the real reasons for squaring are the next two." },
      { ko: "<strong>큰 실수를 훨씬 세게 벌합니다.</strong> 2배 빗나가면 손실은 4배입니다. 절댓값이라면 2배로 끝입니다.", en: "<strong>Big misses are punished disproportionately.</strong> Double the miss, quadruple the loss. Absolute error would merely double." },
      { ko: "<strong>매끈합니다.</strong> 절댓값의 그래프는 오차 0에서 뾰족하게 꺾이지만, 제곱의 그래프는 어디에서도 꺾이지 않습니다. 왜 중요한지는 1편의 '내리막 걷기'에서 드러납니다.", en: "<strong>It's smooth.</strong> The graph of absolute error has a sharp kink at zero; the squared graph has no kink anywhere. Why that matters becomes clear in part 1's walk downhill." },
    ],
  },

  { type: "h2", ko: "3. 확률을 예측할 때 — cross-entropy", en: "3. Predicting probabilities — cross-entropy" },
  {
    type: "p",
    s: [
      { ko: "그런데 GPT의 출력은 숫자 하나가 아닙니다.", en: "But GPT's output isn't one number." },
      { ko: "가능한 모든 다음 <a href=\"/blog/tokens-embeddings/\">토큰(단어 조각)</a>마다 확률을 하나씩 매긴 목록입니다.", en: "It's a list — a probability for every possible next <a href=\"/blog/tokens-embeddings/\">token (a piece of a word)</a>." },
      { ko: "학습 중에는 정답을 이미 압니다.", en: "During training we already know the answer." },
      { ko: "실제 다음 토큰이 학습 텍스트에 그대로 적혀 있으니까요.", en: "The actual next token is sitting right there in the training text." },
      { ko: "채점은 딱 한 칸, <strong>정답에 준 확률 p</strong>만 봅니다.", en: "Scoring reads exactly one entry — <strong>the probability p given to the correct answer</strong>." },
      { ko: "손실은 <code>−log p</code>입니다.", en: "The loss is <code>−log p</code>." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "다른 칸은 안 봐도 됩니다.", en: "We can ignore every other entry." },
      { ko: "확률의 합은 1이라, 정답 칸을 끌어올리면 나머지는 저절로 내려갑니다.", en: "Probabilities sum to 1, so pushing the correct entry up necessarily pushes the rest down." },
      { ko: "log 계산법은 몰라도 됩니다 — 필요한 건 아래 표의 모양이 전부입니다.", en: "You don't need to know how to compute a log — the shape of this table is all you need." },
    ],
  },
  {
    type: "code",
    code: [
      "p(correct)    -log p    verdict",
      "------------------------------------------",
      "   1.00        0.00     perfect - free",
      "   0.90        0.11     nearly free",
      "   0.50        0.69     half sure",
      "   0.10        2.30     bad",
      "   0.01        4.61     almost none on the answer",
      "   -> 0        -> inf   unbounded",
    ].join("\n"),
  },
  {
    type: "p",
    s: [
      { ko: "표를 위에서 아래로 읽어봅시다.", en: "Read the table top to bottom." },
      { ko: "정답에 <code>p = 1</code>을 주면 <code>−log 1 = 0</code> — 완벽한 예측은 공짜입니다.", en: "Give the answer <code>p = 1</code> and <code>−log 1 = 0</code> — a perfect prediction is free." },
      { ko: "0.9를 줘도 0.11, 거의 공짜입니다 — log가 정답 근처를 싸게 만듭니다.", en: "Even 0.9 costs just 0.11, nearly free — the log makes near-certain-right cheap." },
      { ko: "반대로 정답에 확률을 적게 줄수록 벌금은 가파르게 커지고, p가 0에 가까워지면 한계 없이 치솟습니다.", en: "But the less probability the model gives the answer, the steeper the fine — and as p nears 0, it grows without bound." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "<code>1 − p</code>로도 될 것 같습니다.", en: "It seems <code>1 − p</code> would work too." },
      { ko: "맞히면 0이고, 틀릴수록 커지니까요.", en: "It's 0 when right and grows when wrong." },
      { ko: "하지만 그 벌금은 1에서 멈춥니다.", en: "But that fine stops at 1." },
      { ko: "정답에 0.10을 준 모델과 0.01을 준 모델이 거의 같은 벌을 받게 됩니다.", en: "A model giving the answer 0.10 and one giving 0.01 would pay nearly the same." },
      { ko: "<code>−log</code>는 다릅니다 — 2.30 대 4.61, 그리고 상한이 없습니다.", en: "<code>−log</code> is different — 2.30 versus 4.61, with no ceiling." },
      { ko: "이 채점 방식의 이름이 <strong>cross-entropy</strong>이고, 분류와 다음 토큰 예측의 정석입니다.", en: "This scoring rule is called <strong>cross-entropy</strong>, the classic for classification and next-token prediction." },
      { ko: "한 가지 주의 — 이 손실은 정답 칸만 보므로, 나머지 확률이 오답 하나에 몰렸든 고르게 퍼졌든 벌점은 같습니다.", en: "One caveat — it reads only the correct entry, so whether the remaining probability piles onto one wrong answer or spreads evenly, the penalty is identical." },
    ],
  },

  { type: "h2", ko: "4. 관점 전환 — 손실은 가중치 위의 지형이다", en: "4. The reframe — loss is a landscape over the weights" },
  {
    type: "p",
    s: [
      { ko: "먼저 한 가지 — 데이터가 여러 개면, 전체 손실은 예제별 손실의 평균입니다.", en: "One thing first — with many examples, the total loss is the average of the per-example losses." },
      { ko: "이제 데이터셋을 고정해 봅시다.", en: "Now fix the dataset." },
      { ko: "입력도 정답도 상수가 되면, 예측을 움직이는 건 가중치 W뿐입니다.", en: "With inputs and answers frozen, the only thing moving the predictions is the weights W." },
      { ko: "그 순간 손실은 <strong>가중치의 함수</strong>, <code>loss(W)</code>가 됩니다.", en: "In that instant the loss becomes <strong>a function of the weights</strong>: <code>loss(W)</code>." },
      { ko: "말로만 들으면 안 잡히니, 세상에서 제일 작은 모델로 직접 찍어 봅시다.", en: "That's hard to grasp in words, so let's plot it ourselves with the world's smallest model." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "데이터는 한 점, <code>x = 2</code>에 정답 6입니다.", en: "One data point: <code>x = 2</code>, answer 6." },
      { ko: "모델은 곱셈 하나, <code>예측 = w · x</code>입니다.", en: "The model is a single multiplication: <code>prediction = w · x</code>." },
      { ko: "w를 바꿔가며 제곱오차를 계산해 봅니다.", en: "We try different values of w and compute the squared error." },
    ],
  },
  {
    type: "code",
    code: [
      "model: prediction = w * x        data: x = 2, answer = 6",
      "",
      "  w    prediction   error    loss = error^2",
      "  1        2         -4          16",
      "  2        4         -2           4",
      "  3        6          0           0    <- valley floor",
      "  4        8         +2           4",
    ].join("\n"),
  },
  {
    type: "p",
    s: [
      { ko: "방금 <code>loss(w)</code> 곡선의 점 네 개를 손으로 찍었습니다.", en: "We just plotted four points of the <code>loss(w)</code> curve by hand." },
      { ko: "w = 3에서 바닥에 닿고, 양옆으로 올라가는 포물선입니다.", en: "It touches bottom at w = 3 and rises on both sides — a parabola." },
      { ko: "가중치가 하나면 이렇게 곡선입니다.", en: "With one weight, it's a curve like this." },
      { ko: "둘이면 언덕과 골짜기가 있는 곡면입니다.", en: "With two, a surface with hills and valleys." },
      { ko: "수백만 개면? 같은 아이디어입니다 — 그릴 수 없을 뿐.", en: "Millions? Same idea — just undrawable." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "가능한 모든 W가 이 지형 위에 자기 자리와 높이를 갖습니다.", en: "Every possible W has its own spot and height on this landscape." },
      { ko: "높이가 곧 그 W의 틀린 정도입니다.", en: "The height is how wrong that W is." },
      { ko: "학습이란 이 지형에서 낮은 곳을 찾는 일입니다.", en: "Learning is finding a low point in this landscape." },
      { ko: "이 그림 하나가 시리즈 전체의 무대입니다.", en: "This one picture is the stage for the entire series." },
    ],
  },

  {
    type: "callout",
    tone: "tip",
    ko: "<strong>GPT 사전학습이 정확히 이겁니다.</strong> 과제는 다음 토큰 예측이고, 손실은 각 위치에서 실제 다음 토큰에 준 확률의 <code>−log p</code>를 방대한 텍스트 전체에 대해 평균한 값 — cross-entropy입니다. 그 값이 곧 <code>loss(W)</code>이고, 논문과 트윗에 나오는 사전학습 loss curve는 거의 전부 이 숫자입니다. 곡선이 내려가는 건 점 하나가 이 지형을 따라 내려간 기록입니다. 손실이 낮다는 건 모델이 실제 텍스트를 그만큼 덜 놀라워한다는 뜻입니다.",
    en: "<strong>GPT pre-training is exactly this.</strong> The task is next-token prediction, and the loss is the <code>−log p</code> of the probability given to the actual next token at each position, averaged over enormous amounts of text — cross-entropy. That value is <code>loss(W)</code>, and nearly every pre-training loss curve in papers and tweets is this number. The curve going down is a recording of a point descending this landscape. Lower loss means the model finds real text that much less surprising.",
  },

  {
    type: "p",
    s: [
      { ko: "손으로 만져보면 더 빨리 잡힙니다.", en: "It clicks faster if you touch it." },
      { ko: "<a href=\"/playground/loss/\">실험실</a>에서 예측 슬라이더를 끌면 제곱오차가 포물선을 그립니다.", en: "In the <a href=\"/playground/loss/\">playground</a>, drag the prediction slider and watch squared error trace a parabola." },
      { ko: "확률 모드로 바꾸고 p를 0으로 밀어 보세요 — <code>−log p</code>가 치솟습니다.", en: "Flip to probability mode and push p toward 0 — <code>−log p</code> shoots up." },
      { ko: "슬라이더는 예측을 직접 움직이지만, 실제 모델에서 예측을 움직이는 손잡이는 W뿐입니다.", en: "The slider moves the prediction directly — but in a real model, the only knob that moves the prediction is W." },
      { ko: "같은 포물선이고, 가로축의 이름만 다릅니다.", en: "Same parabola, different label on the axis." },
    ],
  },

  { type: "h2", ko: "다음 편 — 어느 쪽이 내리막인가", en: "Next up — which way is downhill?" },
  {
    type: "p",
    s: [
      { ko: "이제 어떤 W든 점수를 매길 수 있습니다.", en: "We can now score any W." },
      { ko: "하지만 가중치는 연속값이라 후보는 말 그대로 무한합니다 — 전부 시도할 수는 없습니다.", en: "But weights are continuous, so the candidates are literally infinite — we can't try them all." },
      { ko: "지금 서 있는 자리의 높이는 잴 수 있습니다.", en: "We can measure the height where we stand." },
      { ko: "그런데 수백만 개의 방향 중 어느 쪽이 내리막인지, 어떻게 알까요?", en: "But out of millions of directions, how do we know which way is down?" },
      { ko: "그 질문의 답이 <strong>gradient descent</strong>입니다.", en: "The answer to that question is <strong>gradient descent</strong>." },
      { ko: "다음 편에서 걷습니다.", en: "We take the walk in the next part." },
    ],
  },
];
