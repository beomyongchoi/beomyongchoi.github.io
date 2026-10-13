import type { BiBlock } from "./aiParadox";

// Numbers come from /lab/mlp.js with the exact presets in /playground/train/
// (seeded data + init, so every reader reproduces them), measured 2026-10-13.
export const blocks: BiBlock[] = [
  {
    type: "callout",
    tone: "tldr",
    ko: "<strong>결론부터.</strong> 학습은 지금까지 본 세 조각을 한 루프로 돌리는 겁니다. <strong>손실을 재고, 역전파로 기울기를 얻고, 내리막으로 한 걸음.</strong> 이걸 미니배치마다 반복합니다. 작은 신경망(파라미터 105개)이 고리 데이터를 25에포크 만에 100% 가르는 걸 브라우저에서 직접 볼 수 있습니다. 대신 데이터가 적고 모델이 크면 test 손실이 바닥을 찍고 다시 오릅니다. 이게 과적합입니다.",
    en: "<strong>The short version.</strong> Training runs the three pieces we've seen in one loop: <strong>measure the loss, get gradients by backprop, take a step downhill</strong> — once per minibatch. You can watch a tiny network (105 parameters) separate the ring data 100% in 25 epochs, right in your browser. But with little data and a big model, the test loss bottoms out and climbs back up. That's overfitting.",
  },

  {
    type: "p",
    s: [
      { ko: "<a href=\"/blog/loss-function/\">0편</a>에서 틀림을 숫자로 바꿨습니다.", en: "In <a href=\"/blog/loss-function/\">part 0</a> we turned wrongness into a number." },
      { ko: "<a href=\"/blog/gradient-descent/\">1편</a>에서 그 숫자를 내리막으로 굴렸습니다.", en: "In <a href=\"/blog/gradient-descent/\">part 1</a> we rolled that number downhill." },
      { ko: "<a href=\"/blog/backprop/\">2편</a>에서 모든 가중치의 기울기를 한 번에 얻었습니다.", en: "In <a href=\"/blog/backprop/\">part 2</a> we got every weight's slope in one sweep." },
      { ko: "이번엔 셋을 이어 붙여 진짜로 학습시킵니다.", en: "Now we wire the three together and actually train." },
    ],
  },

  {
    type: "callout",
    tone: "tip",
    ko: "▶ 한 번이면 됩니다. 아래 숫자는 전부 이 실험실의 프리셋에서 나왔습니다. <a href=\"/playground/train/\">라이브 학습 실험실 →</a>",
    en: "One click on ▶ is all it takes — every number below comes from this lab's presets. <a href=\"/playground/train/\">Live training lab →</a>",
  },

  { type: "hr" },

  { type: "h2", ko: "1. 학습 루프는 다섯 줄이다", en: "1. The training loop is five lines" },
  {
    type: "code",
    code: "for epoch in range(E):                  # 데이터 전체를 한 바퀴 = 1 에포크\n    for batch in shuffle(train).chunks(B):  # 미니배치로 잘라서\n        L = mean((model(x) - t)**2)     # 0편: 손실\n        L.backward()                    # 2편: 역전파\n        for w in params: w -= lr * w.grad   # 1편: 한 걸음",
  },
  {
    type: "p",
    s: [
      { ko: "실험실도 정확히 이 다섯 줄을 돌립니다.", en: "The lab runs exactly these five lines." },
      { ko: "모델은 2편의 50여 줄짜리 자동미분 위에 얹은 작은 신경망입니다.", en: "The model is a small network on top of part 2's ~50-line autograd." },
      { ko: "입력은 점의 좌표 (x, y) 두 개, 출력은 −1(안쪽)부터 +1(고리)까지의 숫자 하나입니다.", en: "Input: a point's coordinates (x, y). Output: one number from −1 (inside) to +1 (ring)." },
    ],
  },

  { type: "h2", ko: "2. 미니배치와 에포크", en: "2. Minibatches and epochs" },
  {
    type: "list",
    items: [
      { ko: "<strong>미니배치</strong>: 데이터 전체가 아니라 일부(예: 16개)로 손실을 재고 한 걸음 갑니다. 기울기는 조금 시끄럽지만 걸음이 훨씬 잦아집니다.", en: "<strong>Minibatch</strong>: measure the loss on a slice (say 16 points), not all of it, and step. The gradient gets noisier, but you step far more often." },
      { ko: "<strong>에포크</strong>: 데이터를 섞어 미니배치로 잘라 한 바퀴 다 도는 것입니다. 학습 데이터 120개를 16개씩 자르면 1에포크 = 8걸음입니다.", en: "<strong>Epoch</strong>: shuffle, slice into minibatches, and go through all of them once. 120 training points in batches of 16 → 1 epoch = 8 steps." },
      { ko: "<strong>train / test</strong>: 데이터의 절반은 학습에 쓰지 않고 따로 둡니다. 처음 보는 점도 맞히는지 재는 시험지입니다.", en: "<strong>train / test</strong>: half the data is held out from training — an exam of points the model has never seen." },
    ],
  },

  { type: "h2", ko: "3. 지켜보기 — 경계가 고리를 감싼다", en: "3. Watch — the boundary wraps the ring" },
  {
    type: "p",
    s: [
      { ko: "데이터는 <a href=\"/blog/nonlinear-network/\">선형대수 3편</a>과 같은 배치입니다. 안쪽 뭉치를 바깥 고리가 둘러쌉니다.", en: "The data has the same layout as <a href=\"/blog/nonlinear-network/\">linear-algebra part 3</a>: a blob wrapped by a ring." },
      { ko: "은닉층 두 개(뉴런 8-8, 파라미터 105개)로 학습시켰습니다.", en: "I trained two hidden layers (8-8 neurons, 105 parameters)." },
    ],
  },
  {
    type: "code",
    code: "$ train --hidden 8,8 --lr 0.1 --batch 16       # 120 train / 120 test\n  epoch   0   train 1.015  test 1.054   acc  52% /  42%\n  epoch  25   train 0.012  test 0.025   acc 100% / 100%\n  epoch 100   train 0.001  test 0.005   acc 100% / 100%",
  },
  {
    type: "p",
    s: [
      { ko: "처음엔 동전 던지기 수준입니다.", en: "At first it's a coin flip." },
      { ko: "가중치를 무작위로 깔았으니 당연합니다.", en: "Naturally — the weights start random." },
      { ko: "몇 에포크가 지나면 배경의 경계가 둥글게 말리기 시작하고, 25에포크에 처음 보는 test 점까지 100% 맞힙니다.", en: "A few epochs in, the boundary in the background starts curling, and by epoch 25 it gets 100% even on the unseen test points." },
      { ko: "제 노트북 Node에서 1에포크에 4ms 남짓 걸렸습니다.", en: "On my laptop in Node, one epoch took about 4 ms." },
    ],
  },

  { type: "h2", ko: "4. 일부러 망쳐 보기", en: "4. Break it on purpose" },
  {
    type: "p",
    s: [
      { ko: "실패를 직접 보는 게 더 많이 남습니다. 실험실 프리셋 두 개로 일으킬 수 있습니다.", en: "Failures teach more. Two presets in the lab trigger them." },
    ],
  },
  {
    type: "list",
    items: [
      { ko: "<strong>은닉층을 빼면</strong>(파라미터 3개): 경계가 직선 하나뿐입니다. 50에포크 뒤에도 정확도 49% / 43%로 동전 던지기 언저리를 맴돕니다. 선형대수 3편의 결론 그대로입니다.", en: "<strong>Remove the hidden layers</strong> (3 parameters): the boundary is a single straight line. After 50 epochs it's still at 49% / 43% — coin-flip territory, exactly linear-algebra part 3's conclusion." },
      { ko: "<strong>lr을 2.0으로 올리면</strong>: 첫 몇 걸음에 출력이 ±1 끝에 들러붙습니다. tanh가 끝에 붙으면 국소 기울기 1 − tanh²가 0에 가까워 역전파가 더 밀어 주지 못합니다. 모든 점을 한쪽으로 찍은 채 손실 2.000, 정확도 50%로 굳습니다.", en: "<strong>Raise lr to 2.0</strong>: within a few steps the outputs stick at ±1. Once tanh saturates, its local slope 1 − tanh² is near zero, so backprop can't push anymore. It freezes calling every point one class — loss 2.000, accuracy 50%." },
    ],
  },

  { type: "h2", ko: "5. 과적합 — train은 내려가는데 test가 오른다", en: "5. Overfitting — train falls, test rises" },
  {
    type: "p",
    s: [
      { ko: "이번엔 학습 점을 30개로 줄이고 반지름에 노이즈를 섞어 안팎이 살짝 겹치게 했습니다.", en: "Now cut the training set to 30 points and jitter the radii so inside and outside overlap a bit." },
      { ko: "모델은 은닉층 24-24, 파라미터 697개로 키웠습니다. 점 하나에 파라미터 스무 개가 넘습니다.", en: "Grow the model to 24-24 hidden, 697 parameters — over twenty per training point." },
    ],
  },
  {
    type: "code",
    code: "$ train --hidden 24,24 --points 30 --noise 0.6 --lr 0.1 --batch 8\n  epoch    88   train 0.027  test 0.108   acc 100% / 97%   ← test 최저점\n  epoch   250   train 0.002  test 0.159\n  epoch  2000   train 0.000  test 0.200   acc 100% / 90%",
  },
  {
    type: "p",
    s: [
      { ko: "train 손실은 끝까지 0으로 내려갑니다.", en: "The train loss keeps falling to zero." },
      { ko: "test 손실은 88에포크에 0.108로 바닥을 찍고, 2000에포크엔 0.200까지 거의 두 배로 오릅니다.", en: "The test loss bottoms at 0.108 around epoch 88, then nearly doubles to 0.200 by epoch 2000." },
      { ko: "모델이 고리라는 규칙 대신 학습 점 30개의 자리를 외우기 시작한 겁니다.", en: "The model has started memorizing where the 30 points sit instead of learning \"ring.\"" },
      { ko: "실험실 배경을 보면 경계가 데이터가 없는 쪽으로 엉뚱하게 뻗어 있습니다.", en: "In the lab's background you can see the boundary reaching off into regions with no data." },
    ],
  },
  {
    type: "callout",
    tone: "tip",
    ko: "가장 간단한 처방은 <strong>조기 종료(early stopping)</strong>입니다. test(실무에선 따로 떼어 둔 검증 세트) 손실이 가장 낮았던 시점의 가중치를 씁니다. 실험실 곡선의 주황 점이 그 지점입니다. 데이터를 늘리거나 모델을 줄이는 것도 방법입니다.",
    en: "The simplest fix is <strong>early stopping</strong>: keep the weights from when the test loss (in practice, a separate validation set) was lowest. The orange dot on the lab's curve marks it. More data or a smaller model also helps.",
  },

  { type: "h2", ko: "시리즈를 마치며", en: "Wrapping up the series" },
  {
    type: "p",
    s: [
      { ko: "0편부터 여기까지가 GPT를 포함한 모든 신경망 학습의 뼈대입니다.", en: "Parts 0 through 3 are the skeleton of every neural network's training — GPT included." },
      { ko: "GPT는 손실이 다음 토큰의 cross-entropy이고, 파라미터가 105개가 아니라 수십억 개이고, 한 걸음이 Adam 같은 개선판이라는 점만 다릅니다.", en: "For GPT the loss is next-token cross-entropy, the parameters number in the billions instead of 105, and the step is an improved variant like Adam. That's the difference." },
      { ko: "루프는 같습니다. 재고, 거꾸로 나누고, 한 걸음.", en: "The loop is the same: measure, hand blame backward, step." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "실험실에서 lr과 미니배치 크기를 바꿔 가며 경계가 휘는 속도를 비교해 보세요.", en: "In the lab, vary lr and the minibatch size and compare how fast the boundary bends." },
      { ko: "미니배치를 1로 두면 걸음이 가장 잦아집니다. 대신 곡선이 얼마나 시끄러워지는지 직접 확인해 보세요.", en: "A batch of 1 steps most often — see for yourself how much noisier the curve gets." },
    ],
  },

  { type: "hr" },
  {
    type: "sources",
    html: "<h3>출처 · Sources</h3><ul><li>실험 코드: <a href=\"/lab/mlp.js\">/lab/mlp.js</a> · <a href=\"/lab/autograd.js\">/lab/autograd.js</a> (시드 고정, 누구나 같은 숫자 재현)</li><li>Andrej Karpathy, <a href=\"https://github.com/karpathy/micrograd\">micrograd</a></li></ul>",
  },
];
