import type { BiBlock } from "./aiParadox";

// Every number here is checked by scripts/lab-autograd.check.mjs (and the step trace by public/lab/autograd.js).
export const blocks: BiBlock[] = [
  {
    type: "callout",
    tone: "tldr",
    ko: "<strong>결론부터.</strong> 역전파는 손실에 대한 <strong>책임을 출력에서 입력 쪽으로 거꾸로 나눠 주는</strong> 계산입니다. 규칙은 두 개뿐입니다. 사슬을 따라가면 <strong>곱하고</strong>, 길이 갈라지면 <strong>더합니다</strong>. 이렇게 하면 앞으로 한 번, 뒤로 한 번만 훑어서 모든 가중치의 기울기를 한꺼번에 얻습니다.",
    en: "<strong>The short version.</strong> Backprop <strong>hands out blame for the loss, from the output back toward the inputs</strong>. There are only two rules: along a chain, <strong>multiply</strong>; where paths split, <strong>add</strong>. Do that, and one forward pass plus one backward sweep gives you the slope of every weight at once.",
  },

  {
    type: "p",
    s: [
      { ko: "<a href=\"/blog/gradient-descent/\">1편</a>에서 기울기는 밀어서 쟀습니다.", en: "In <a href=\"/blog/gradient-descent/\">part 1</a> we measured the slope by nudging." },
      { ko: "가중치를 0.01 올리고 손실이 얼마나 변하는지 봤죠.", en: "Raise a weight by 0.01 and watch how much the loss moves." },
      { ko: "가중치가 하나면 충분합니다.", en: "With one weight, that's fine." },
      { ko: "수백만 개면 걸음 하나에 모델을 수백만 번 돌려야 합니다.", en: "With millions, one step means running the model millions of times." },
      { ko: "이번 편은 그걸 앞으로 한 번, 뒤로 한 번으로 줄이는 방법입니다.", en: "This part is how to shrink that to one pass forward and one pass back." },
    ],
  },

  {
    type: "callout",
    tone: "tip",
    ko: "그래프 위에서 값이 앞으로, 기울기가 거꾸로 흐르는 걸 직접 눌러 보세요. <a href=\"/playground/backprop/\">역전파 실험실 →</a>",
    en: "Click through values flowing forward and gradients flowing back on the graph. <a href=\"/playground/backprop/\">Backprop lab →</a>",
  },

  { type: "hr" },

  { type: "h2", ko: "1. 가중치를 두 개로 늘려 보자", en: "1. Add a second weight" },
  {
    type: "p",
    s: [
      { ko: "1편의 예제를 그대로 씁니다. 입력 x = 2, 정답은 6입니다.", en: "Same example as part 1: input x = 2, answer 6." },
      { ko: "이번엔 가중치 두 개를 사슬로 잇습니다.", en: "This time we chain two weights." },
    ],
  },
  {
    type: "code",
    code: "h = w1 × x          # 첫 번째 층\ny = w2 × h          # 두 번째 층\nL = (y − 6)²        # 손실\n\n$ forward  w1=1  w2=2\n  h = 1 × 2 = 2\n  y = 2 × 2 = 4\n  L = (4 − 6)² = 4",
  },
  {
    type: "p",
    s: [
      { ko: "w1은 손실에 직접 닿지 않습니다.", en: "w1 never touches the loss directly." },
      { ko: "h를 바꾸고, h가 y를 바꾸고, y가 손실을 바꿉니다.", en: "It changes h, h changes y, and y changes the loss." },
      { ko: "그럼 w1의 책임은 어떻게 잴까요?", en: "So how do we measure w1's share of the blame?" },
    ],
  },

  { type: "h2", ko: "2. 사슬을 따라가면 곱한다", en: "2. Along a chain, multiply" },
  {
    type: "p",
    s: [
      { ko: "톱니바퀴 세 개가 맞물려 있다고 생각해 보세요.", en: "Picture three meshed gears." },
      { ko: "첫 바퀴를 1만큼 돌리면 둘째가 2배, 둘째가 1만큼 돌면 셋째가 3배 돈다고 합시다.", en: "Turn the first by 1 and the second turns 2×; turn the second by 1 and the third turns 3×." },
      { ko: "그러면 첫 바퀴 1에 셋째는 2 × 3 = 6만큼 돕니다.", en: "Then 1 turn of the first spins the third 2 × 3 = 6." },
      { ko: "이게 <strong>연쇄 법칙(chain rule)</strong>의 전부입니다. 경로 위의 국소 기울기를 곱합니다.", en: "That's all the <strong>chain rule</strong> is: multiply the local slopes along the path." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "각 칸의 국소 기울기는 쉽습니다.", en: "Each link's local slope is easy." },
      { ko: "<code>(y − 6)²</code>은 y가 1 오르면 <code>2(y − 6)</code>만큼, <code>w2 × h</code>는 h가 1 오르면 w2만큼 변합니다.", en: "<code>(y − 6)²</code> moves by <code>2(y − 6)</code> per unit of y; <code>w2 × h</code> moves by w2 per unit of h." },
      { ko: "손실에서 시작해 뒤로 곱해 나갑니다.", en: "Start at the loss and multiply your way back." },
    ],
  },
  {
    type: "code",
    code: "$ backward                         # ∂L/∂(node), 손실에서 거꾸로\n  ∂L/∂L  = 1\n  ∂L/∂y  = 2(y − 6)        = 2 × (4 − 6) = −4\n  ∂L/∂w2 = ∂L/∂y × h       = −4 × 2      = −8\n  ∂L/∂h  = ∂L/∂y × w2      = −4 × 2      = −8\n  ∂L/∂w1 = ∂L/∂h × x       = −8 × 2      = −16",
  },
  {
    type: "p",
    s: [
      { ko: "정말 맞는지 1편 방식으로 밀어서 확인해 봅니다.", en: "Let's check with part 1's nudge." },
      { ko: "w2를 2.01로 올리면 손실은 3.9204입니다. 기울기 ≈ −0.0796 / 0.01 ≈ −8.", en: "Raise w2 to 2.01 and the loss is 3.9204: slope ≈ −0.0796 / 0.01 ≈ −8." },
      { ko: "1편에서 본 바로 그 3.9204입니다.", en: "The very same 3.9204 from part 1." },
      { ko: "w1을 1.01로 올리면 3.8416, 기울기 ≈ −15.84로 −16에 붙습니다.", en: "Raise w1 to 1.01 and it's 3.8416, slope ≈ −15.84 — right next to −16." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "w1의 기울기가 w2의 두 배입니다.", en: "w1's slope is twice w2's." },
      { ko: "w1은 x = 2를 거쳐 한 번 더 증폭되기 때문입니다.", en: "That's because w1 gets amplified once more through x = 2." },
    ],
  },

  { type: "h2", ko: "3. 길이 갈라지면 더한다", en: "3. Where paths split, add" },
  {
    type: "p",
    s: [
      { ko: "한 값이 두 군데 쓰이면 어떨까요?", en: "What if one value is used in two places?" },
      { ko: "<code>f = a × b + a</code>에서 a는 곱셈에도, 덧셈에도 들어갑니다.", en: "In <code>f = a × b + a</code>, a feeds both the product and the sum." },
      { ko: "a가 1 오르면 곱셈 쪽으로 b만큼, 덧셈 쪽으로 1만큼 f가 오릅니다.", en: "Raise a by 1 and f rises by b through the product and by 1 through the sum." },
      { ko: "두 길의 책임을 <strong>더하면</strong> 됩니다. a = 3, b = 2면 ∂f/∂a = 2 + 1 = 3입니다.", en: "<strong>Add</strong> the blame from both paths: at a = 3, b = 2, ∂f/∂a = 2 + 1 = 3." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "신경망에서는 이런 갈림길이 흔합니다.", en: "Neural nets are full of these forks." },
      { ko: "뉴런 하나의 출력이 다음 층의 뉴런 여러 개로 퍼지니까요.", en: "One neuron's output fans out to many neurons in the next layer." },
      { ko: "그래서 코드에서는 기울기를 덮어쓰지 않고 <code>+=</code>로 쌓습니다.", en: "That's why the code accumulates gradients with <code>+=</code> instead of overwriting." },
    ],
  },

  { type: "h2", ko: "4. 왜 이게 싼가 — 중간 결과를 다시 쓴다", en: "4. Why it's cheap — reuse the middle" },
  {
    type: "p",
    s: [
      { ko: "아까 표를 다시 보세요.", en: "Look at the table again." },
      { ko: "∂L/∂h = −8을 한 번 구해 두면, h 아래쪽 가중치는 전부 그걸 곱해서 끝냅니다.", en: "Compute ∂L/∂h = −8 once, and every weight below h just multiplies by it." },
      { ko: "뒤에서 앞으로 한 번 훑으면서 각 칸을 딱 한 번씩만 계산합니다.", en: "One sweep from back to front computes each link exactly once." },
      { ko: "가중치가 백만 개여도 한 번 훑으면 백만 개 기울기가 다 나옵니다.", en: "A million weights still come out of a single sweep." },
    ],
  },
  {
    type: "code",
    code: "$ cost per training step              # N = number of weights\n  nudge each weight     N + 1 forward passes\n  backprop              1 forward + 1 backward",
  },
  {
    type: "p",
    s: [
      { ko: "아이디어 자체는 오래됐습니다.", en: "The idea is old." },
      { ko: "Rumelhart·Hinton·Williams가 1986년 Nature 논문으로 신경망 학습에 쓰는 법을 널리 알렸습니다.", en: "Rumelhart, Hinton, and Williams popularized it for training neural nets in a 1986 Nature paper." },
    ],
  },

  { type: "h2", ko: "5. 한 걸음 내려가 보기", en: "5. Take a step downhill" },
  {
    type: "p",
    s: [
      { ko: "이제 1편의 한 줄 <code>w ← w − lr × 기울기</code>를 두 가중치에 동시에 씁니다.", en: "Now apply part 1's one-liner <code>w ← w − lr × slope</code> to both weights at once." },
      { ko: "lr = 0.01로 걸으면 이렇게 됩니다.", en: "Walking with lr = 0.01:" },
    ],
  },
  {
    type: "code",
    code: "$ train --lr 0.01\n  step 0   w1=1.0000  w2=2.0000   L=4.0000\n  step 1   w1=1.1600  w2=2.0800   L=1.3792\n  step 2   w1=1.2577  w2=2.1345   L=0.3980\n  step 3   w1=1.3116  w2=2.1662   L=0.1009\n  step 10  w1=1.3643  w2=2.1984   L=0.0000   # y = w2·w1·2 ≈ 6",
  },
  {
    type: "p",
    s: [
      { ko: "걸음마다 기울기가 큰 w1이 더 많이 움직입니다.", en: "Each step, w1 — the one with the bigger slope — moves more." },
      { ko: "답은 w1 × w2 = 3이기만 하면 되니 정답이 하나가 아닙니다.", en: "Any pair with w1 × w2 = 3 works, so there's no single right answer." },
      { ko: "어디서 출발했느냐에 따라 도착점이 달라집니다.", en: "Where you land depends on where you started." },
    ],
  },

  { type: "h2", ko: "6. 실무에서는 — 한 줄이다", en: "6. In practice — it's one line" },
  {
    type: "p",
    s: [
      { ko: "PyTorch 같은 프레임워크는 순방향 계산을 하면서 그래프를 기록해 둡니다.", en: "Frameworks like PyTorch record the graph as you run the forward pass." },
      { ko: "<code>loss.backward()</code> 한 줄이 위 표를 그대로 실행합니다.", en: "One line, <code>loss.backward()</code>, runs exactly the table above." },
      { ko: "이 글의 실험실도 같은 일을 하는 50여 줄짜리 JavaScript로 돌아갑니다. Karpathy의 micrograd와 같은 구조입니다.", en: "This post's lab runs on about 50 lines of JavaScript doing the same — the same shape as Karpathy's micrograd." },
    ],
  },
  {
    type: "callout",
    tone: "warn",
    ko: "기울기는 쌓입니다. 프레임워크에서 걸음마다 기울기를 0으로 비우지 않으면(<code>optimizer.zero_grad()</code>) 이전 걸음의 기울기가 더해져 엉뚱한 방향으로 갑니다. 3번의 <code>+=</code>가 바로 그 이유입니다.",
    en: "Gradients accumulate. If you don't zero them each step in a framework (<code>optimizer.zero_grad()</code>), the last step's gradients get added in and you head the wrong way. That's the <code>+=</code> from section 3.",
  },

  { type: "h2", ko: "다음 편 — 진짜로 학습시켜 보기", en: "Next up — training for real" },
  {
    type: "p",
    s: [
      { ko: "손실, 경사하강, 역전파가 다 모였습니다.", en: "Loss, gradient descent, backprop — all the pieces are here." },
      { ko: "마지막 편에서는 이 셋으로 작은 신경망을 브라우저에서 실제로 학습시킵니다.", en: "In the final part we use all three to actually train a small network in the browser." },
      { ko: "선형대수 시리즈의 고리 데이터를 경계가 휘어 감싸는 순간을 지켜봅니다.", en: "We'll watch its boundary bend around the ring data from the linear-algebra series." },
    ],
  },

  { type: "hr" },
  {
    type: "sources",
    html: "<h3>출처 · Sources</h3><ul><li>Rumelhart, Hinton &amp; Williams, <a href=\"https://doi.org/10.1038/323533a0\">Learning representations by back-propagating errors</a>, Nature 323, 533–536 (1986)</li><li>Andrej Karpathy, <a href=\"https://github.com/karpathy/micrograd\">micrograd</a> — a tiny scalar-valued autograd engine</li></ul>",
  },
];
