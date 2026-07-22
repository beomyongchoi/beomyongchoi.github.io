import type { BiBlock } from "./aiParadox";

export const blocks: BiBlock[] = [
  {
    type: "callout",
    tone: "tldr",
    ko: "<strong>결론부터.</strong> 선형변환은 아무리 쌓아도 <strong>여전히 하나의 선형변환</strong>입니다 — <code>W2(W1 x) = (W2·W1) x</code>. 그래서 100층을 쌓아도 그을 수 있는 경계는 <strong>직선 하나</strong>뿐이죠. 여기에 선형변환들 <strong>사이</strong>로 꺾임 하나만 끼우면 — <code>ReLU(z)=max(0,z)</code> — 쌓인 층들이 비로소 공간을 <strong>곡선으로 접습니다</strong>. 이 <strong>Linear → 비선형 → Linear</strong> 샌드위치가 바로 신경망이고, 트랜스포머의 <strong>FFN</strong>이 정확히 이것입니다.",
    en: "<strong>The short version.</strong> Stack linear maps however you like and you still get <strong>one linear map</strong> — <code>W2(W1 x) = (W2·W1) x</code>. So even 100 layers can only draw <strong>one straight boundary</strong>. Slip a single kink <strong>between</strong> the linear maps — <code>ReLU(z)=max(0,z)</code> — and the stacked layers can finally <strong>fold space into curves</strong>. That <strong>Linear → nonlinear → Linear</strong> sandwich <em>is</em> a neural network, and it's exactly the transformer's <strong>FFN</strong>.",
  },

  {
    type: "p",
    s: [
      { ko: "<a href=\"/blog/linear-geometry\"><strong>2편</strong></a>에서 선형변환은 격자선을 늘 <strong>곧게, 평행하게, 균일한 간격으로</strong> 남겼습니다.", en: "In <a href=\"/blog/linear-geometry\"><strong>part 2</strong></a>, a linear map always kept the grid lines <strong>straight, parallel, and evenly spaced</strong>." },
      { ko: "돌리고, 늘이고, 기울이고, 직선으로 붕괴시킬 순 있었죠.", en: "It could rotate, stretch, shear, even collapse onto a line." },
      { ko: "하지만 <strong>휘게</strong>는 못 했습니다. 곧은 선은 끝까지 곧았습니다.", en: "But it could never <strong>curve</strong> anything — a straight line stayed straight." },
      { ko: "그래서 질문 하나가 남습니다: 선형이 <strong>못 하는</strong> 게 정확히 뭘까요?", en: "So one question is left: what exactly <strong>can't</strong> linear do?" },
    ],
  },

  { type: "h2", ko: "깊이만으로는 아무것도 못 산다", en: "Depth alone buys you nothing" },
  {
    type: "p",
    s: [
      { ko: "먼저 \"층을 더 쌓으면 되지 않나?\"라는 반문부터 끝냅시다.", en: "First let's kill the obvious rebuttal — \"just stack more layers.\"" },
      { ko: "층 하나가 <code>x → W1 x</code>라면, 두 층은 <code>x → W2(W1 x)</code>입니다.", en: "If one layer is <code>x → W1 x</code>, two layers are <code>x → W2(W1 x)</code>." },
      { ko: "그런데 <strong>1편</strong>에서 봤듯 선형변환을 잇는 건 <strong>행렬을 곱하는 것</strong>이고, 행렬곱은 결합법칙이 성립합니다.", en: "But as <strong>part 1</strong> showed, composing linear maps is just <strong>multiplying their matrices</strong> — and matrix multiplication is associative." },
      { ko: "그래서 <code>W2(W1 x) = (W2·W1) x</code>. 두 행렬을 미리 곱해 두면 <code>W2·W1</code>은 그냥 <strong>또 하나의 행렬</strong>입니다 — 그걸 <code>W</code>라 부릅시다.", en: "So <code>W2(W1 x) = (W2·W1) x</code>. Multiply the two ahead of time and <code>W2·W1</code> is simply <strong>another matrix</strong> — call it <code>W</code>." },
      { ko: "즉 두 선형층은 <strong>단 하나의 선형층</strong> <code>x → W x</code>와 완전히 같습니다.", en: "So two linear layers are identical to a <strong>single linear layer</strong> <code>x → W x</code>." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "여기가 핵심입니다.", en: "This is the crux." },
      { ko: "선형층을 100개 쌓아도, 그것들은 하나의 행렬 <code>W = W100 ··· W2·W1</code>로 접힙니다.", en: "Stack 100 linear layers and they all fold into one matrix <code>W = W100 ··· W2·W1</code>." },
      { ko: "즉 <strong>비선형이 없으면 100층 = 1층</strong>입니다.", en: "That is: <strong>with no nonlinearity, 100 layers = 1 layer</strong>." },
      { ko: "깊이가 사 오는 게 아무것도 없습니다. 표현력은 딱 직선 하나에 묶여 있습니다.", en: "Depth buys nothing. The expressive power stays pinned to a single straight line." },
    ],
  },

  { type: "h2", ko: "벽 — 직선으로 못 가르는 점들", en: "The wall — points no line can split" },
  {
    type: "p",
    s: [
      { ko: "그 '직선 하나'가 왜 문제인지 고전 예시로 봅시다: <strong>XOR</strong>.", en: "Why is \"one straight line\" a problem? The classic example: <strong>XOR</strong>." },
      { ko: "네 점을 놓습니다. <code>(0,0)</code>과 <code>(1,1)</code>은 클래스 A, <code>(0,1)</code>과 <code>(1,0)</code>은 클래스 B.", en: "Place four points: <code>(0,0)</code> and <code>(1,1)</code> are class A, <code>(0,1)</code> and <code>(1,0)</code> are class B." },
      { ko: "A는 한 대각선, B는 반대 대각선에 서로 엇갈려 앉아 있습니다.", en: "A sits on one diagonal, B on the other — the two classes are interleaved." },
      { ko: "이제 <strong>직선 하나</strong>로 A만 한쪽, B만 다른 쪽에 몰아 보세요. 안 됩니다.", en: "Now try to put every A on one side of a <strong>single straight line</strong> and every B on the other. You can't." },
      { ko: "어떤 각도로 그어도 한쪽엔 A와 B가 섞입니다. XOR은 <strong>선형 분리 불가능</strong>합니다.", en: "At any angle, one side ends up with both A and B. XOR is <strong>not linearly separable</strong>." },
    ],
  },
  {
    type: "code",
    code: [
      "XOR: no single straight line separates A from B",
      "",
      "   y",
      "   1 |  B .............. A",
      "     |  (0,1)      (1,1)",
      "     |      \\        /",
      "     |       any line you draw",
      "     |      /        \\",
      "   0 |  A .............. B",
      "     |  (0,0)      (1,0)",
      "     +----------------------- x",
      "        0              1",
      "",
      "  A = {(0,0),(1,1)}   B = {(0,1),(1,0)}",
      "  diagonal classes -> one line always splits one pair wrong",
    ].join("\n"),
  },
  {
    type: "p",
    s: [
      { ko: "2편의 '원 안과 밖' 예시도 똑같은 벽입니다.", en: "The \"inside vs. outside of a circle\" from part 2 is the same wall." },
      { ko: "안쪽 뭉치를 바깥쪽 고리가 둘러싼 배치라면, 직선 하나로는 절대 안과 밖을 못 가릅니다.", en: "A blob wrapped by a ring of the other class — no single straight line ever separates inside from outside." },
      { ko: "선형 분류기는 여기서 완전히 막힙니다. 필요한 건 <strong>휘어진</strong> 경계입니다.", en: "A linear classifier is completely stuck here. What you need is a <strong>curved</strong> boundary." },
    ],
  },
  {
    type: "code",
    code: [
      "Ring: a blob of A inside a ring of B",
      "",
      "        B B B B",
      "      B         B",
      "     B   A A A   B",
      "     B   A A A   B        no straight line puts",
      "     B   A A A   B        every A inside, every B out",
      "      B         B",
      "        B B B B",
      "",
      "  inside vs outside needs a CURVE, not a line",
    ].join("\n"),
  },

  { type: "h2", ko: "한 스푼의 비선형 — ReLU의 꺾임", en: "One spoon of nonlinear — the ReLU kink" },
  {
    type: "p",
    s: [
      { ko: "해법은 놀랄 만큼 단순합니다: 두 선형층 <strong>사이</strong>에 비선형 함수를 하나 끼웁니다.", en: "The fix is startlingly simple: slip a nonlinear function <strong>between</strong> two linear layers." },
      { ko: "그 부품이 <strong>활성화 함수(activation)</strong>이고, 가장 그리기 쉬운 게 <strong>ReLU</strong>입니다: <code>ReLU(z)=max(0,z)</code>.", en: "That part is an <strong>activation function</strong>, and the easiest one to picture is <strong>ReLU</strong>: <code>ReLU(z)=max(0,z)</code>." },
      { ko: "양수는 그대로 두고, 음수는 0으로 눌러 버립니다.", en: "Keep positives as they are; clamp negatives to zero." },
      { ko: "그게 전부입니다 — 원점에서 한 번 <strong>꺾이는</strong> 선.", en: "That's the whole thing — a line with a single <strong>kink</strong> at the origin." },
      { ko: "행렬처럼 벡터를 통째로 섞지 않고, <strong>좌표 하나하나에 따로</strong> 적용됩니다.", en: "Unlike a matrix, it doesn't mix the vector together; it hits <strong>each coordinate on its own</strong>." },
      { ko: "GELU나 tanh 같은 다른 활성함수도 있지만, 그림으로는 ReLU가 제일 깨끗합니다.", en: "Other activations exist — GELU, tanh — but ReLU is the cleanest to draw." },
    ],
  },
  {
    type: "code",
    code: [
      "ReLU(z) = max(0, z)   -- kill negatives, keep positives",
      "",
      "   z    | -2  -1   0   1   2",
      "  ------+--------------------",
      "  ReLU  |  0   0   0   1   2",
      "",
      "  shape:                    /",
      "                           /",
      "         _________________/______   flat for z<0,",
      "                          0         kink at 0, rising for z>0",
    ].join("\n"),
  },

  { type: "h2", ko: "왜 꺾임 하나로 충분한가", en: "Why one kink is enough" },
  {
    type: "p",
    s: [
      { ko: "두 선형변환 사이에 ReLU를 끼우면 붕괴 논리가 깨집니다.", en: "Put ReLU between two linear maps and the collapse argument breaks." },
      { ko: "더 이상 <code>W2·W1</code>로 합쳐지지 않아요 — 중간에 곧게 펴지지 않는 꺾임이 끼어 있으니까요.", en: "You can no longer fold it into <code>W2·W1</code> — a non-straightenable kink now sits in the middle." },
      { ko: "직관은 <strong>종이 접기</strong>입니다.", en: "The intuition is <strong>folding paper</strong>." },
      { ko: "선형변환이 평면을 늘리고 기울여 놓으면, ReLU가 0을 기준으로 그 평면을 한 번 <strong>접습니다</strong> — 꺾임(crease) 하나가 생기죠.", en: "A linear map stretches and tilts the plane; ReLU then <strong>folds</strong> it once along zero — that adds one crease." },
      { ko: "접힌 평면을 다음 선형변환이 또 늘리고, ReLU가 또 접고 — 접을 때마다 꺾임이 하나씩 늘어납니다.", en: "The next linear map stretches the folded plane, ReLU folds again — each fold adds one more crease." },
      { ko: "그렇게 <strong>여러 조각의 직선(piecewise-linear)</strong>이 이어지면, 조각난 선들이 곡선을 <strong>흉내</strong> 냅니다.", en: "Chain enough of these creases into a <strong>piecewise-linear</strong> boundary, and the segments <strong>mimic</strong> a curve." },
      { ko: "그 곡선이 XOR도, 고리 안팎도 이제 <strong>가릅니다</strong>. 이런 유닛을 충분히 쓰면 사실상 어떤 연속 경계든 근사할 수 있다고 알려져 있습니다.", en: "That faked curve now <strong>separates</strong> XOR and the ring's inside from its outside. With enough such units, you can approximate essentially any continuous boundary." },
    ],
  },
  {
    type: "code",
    code: [
      "(a) stacked linear collapses -- still ONE straight boundary",
      "",
      "   x --[ W1 ]--[ W2 ]-->     ==     x --[ W2 W1 ]-->",
      "                                       (one matrix)",
      "   boundary:  --------------------  (a single line)",
      "",
      "(b) linear -> ReLU -> linear -- a bent, piecewise boundary",
      "",
      "   x --[ W1 ]--[ ReLU ]--[ W2 ]-->",
      "                                    ______",
      "   boundary:      ______          /       (creases -> pieces",
      "                        \\________/          -> a curve)",
    ].join("\n"),
  },

  { type: "h2", ko: "신경망 한 층의 레시피", en: "The recipe for one neural layer" },
  {
    type: "p",
    s: [
      { ko: "이제 '신경망 층'이라는 말이 정확히 무엇인지 적을 수 있습니다.", en: "Now we can write down exactly what a \"neural layer\" is." },
      { ko: "<strong>1단계 — 선형:</strong> 입력에 행렬을 곱하고 편향을 더합니다: <code>W·x + b</code>.", en: "<strong>Step 1 — linear:</strong> multiply by a matrix and add a bias: <code>W·x + b</code>." },
      { ko: "<code>W·x</code>는 <strong>1편</strong>의 그 연산 그대로입니다 — <strong>내적을 한 묶음</strong>으로 돌린 것.", en: "<code>W·x</code> is exactly <strong>part 1</strong>'s operation — a <strong>batch of dot products</strong>." },
      { ko: "더하는 <code>b</code>(bias)는 결과를 통째로 <strong>옮기는 오프셋</strong>일 뿐입니다(affine).", en: "The added <code>b</code> (bias) is just an <strong>offset that shifts</strong> the whole result (an affine step)." },
      { ko: "<strong>2단계 — 비선형:</strong> 그 결과에 활성화를 적용합니다: <code>ReLU(W·x + b)</code>.", en: "<strong>Step 2 — nonlinear:</strong> apply the activation: <code>ReLU(W·x + b)</code>." },
      { ko: "층 하나 = <strong>선형 다음 비선형</strong>. 이 샌드위치를 쌓은 게 신경망입니다.", en: "One layer = <strong>linear, then nonlinear</strong>. Stack this sandwich and you have a neural network." },
    ],
  },
  {
    type: "list",
    items: [
      { ko: "<strong>신경망 = 이 샌드위치를 반복</strong> — <code>x → ReLU(W1 x + b1) → ReLU(W2 · ... + b2) → ...</code>.", en: "<strong>A network = this sandwich repeated</strong> — <code>x → ReLU(W1 x + b1) → ReLU(W2 · ... + b2) → ...</code>." },
      { ko: "선형은 <strong>공간을 옮기고</strong>, 비선형은 <strong>접어서 휩니다</strong>. 둘이 번갈아 반복될 때 비로소 깊이가 힘을 얻습니다.", en: "Linear <strong>moves space</strong>; nonlinear <strong>folds and bends</strong> it. Alternating the two is what finally makes depth powerful." },
      { ko: "<code>W</code>와 <code>b</code>는 학습으로 정해집니다 — 여기선 값이 이미 정해졌다 보고, 그 값이 무엇을 <strong>할 수 있는지</strong>에 집중합니다.", en: "The <code>W</code>s and <code>b</code>s are learned — here we take them as given and focus on what those values <strong>can express</strong>." },
    ],
  },

  {
    type: "callout",
    tone: "tip",
    ko: "<strong>LLM으로 환산하면.</strong> 트랜스포머의 <strong>FFN(feed-forward network)</strong>이 정확히 <strong>Linear → 비선형 → Linear</strong>를, 모든 토큰에 <strong>독립적으로</strong> 적용한 것입니다 (트랜스포머 시리즈 <a href=\"/blog/transformer-block\"><strong>2편</strong></a>). 원조 트랜스포머의 FFN은 가운데 비선형으로 <strong>ReLU</strong>를 썼고, 요즘 LLM은 대개 <strong>GELU</strong>를 쓰지만 뼈대는 같습니다 — 선형 두 개 사이에 비선형 하나. 역할 분담이 깔끔하죠: <strong>어텐션은 토큰들 사이로 정보를 섞고, FFN은 비선형 덕분에 토큰 하나하나의 벡터를 다시 빚습니다.</strong> 모델 파라미터의 상당수가 바로 이 FFN에 들어 있고, 학습된 지식의 큰 몫도 여기 사는 것으로 보입니다. 같은 Linear+비선형 레시피가, 거대한 규모로.",
    en: "<strong>Cashing out to the LLM.</strong> A transformer's <strong>feed-forward network (FFN)</strong> is exactly <strong>Linear → nonlinear → Linear</strong>, applied to every token <strong>independently</strong> (Transformer series <a href=\"/blog/transformer-block\"><strong>part 2</strong></a>). The original transformer's FFN used <strong>ReLU</strong> as the nonlinearity in the middle; most modern LLMs use <strong>GELU</strong>, but the skeleton is the same — one nonlinearity between two linear maps. The division of labor is clean: <strong>attention mixes information across tokens; the FFN, thanks to its nonlinearity, reshapes each token's vector on its own.</strong> A large share of a model's parameters live in these FFN layers, and much of its learned knowledge appears to live there too. The same Linear+nonlinear recipe, at enormous scale.",
  },

  { type: "h2", ko: "직접 만져보기", en: "Play with it" },
  {
    type: "p",
    s: [
      { ko: "이 모든 걸 <a href=\"/playground/neural-layer/\">/playground/neural-layer/</a>에서 손으로 확인하세요.", en: "Feel all of this by hand at <a href=\"/playground/neural-layer/\">/playground/neural-layer/</a>." },
      { ko: "먼저 <strong>선형만</strong> 켜 두면, 분류기는 직선 하나에 갇혀 엇갈린 두 무리를 못 가릅니다.", en: "Leave it <strong>linear-only</strong> first: the classifier is stuck as one straight line and fails to separate the two interleaved clusters." },
      { ko: "이제 <strong>ReLU를 켜</strong> 은닉층을 하나 살려 보세요.", en: "Now <strong>flip ReLU on</strong> and bring a hidden layer to life." },
      { ko: "경계가 꺾이며 휘어, 두 무리를 실제로 갈라내는 걸 지켜보세요.", en: "Watch the boundary kink and bend until it actually separates the two groups." },
    ],
  },

  { type: "h2", ko: "피날레 — 하나로 이어진 길", en: "Finale — the through-line" },
  {
    type: "p",
    s: [
      { ko: "여기서 이 시리즈가 닫힙니다. 걸어온 길을 한 호흡으로 되짚어 봅시다.", en: "Here the series closes. Let's retrace the path in one breath." },
      { ko: "<a href=\"/blog/vectors-why\"><strong>0편</strong></a>: 벡터는 좌표이자 화살표, 내적은 <strong>정렬 점수</strong>였습니다.", en: "<a href=\"/blog/vectors-why\"><strong>Part 0</strong></a>: a vector is coordinates and an arrow; the dot product is an <strong>alignment score</strong>." },
      { ko: "<a href=\"/blog/matrix-transform\"><strong>1편</strong></a>: 행렬은 벡터를 쌓은 표, 행렬×벡터는 <strong>내적을 한 묶음</strong>으로 돌린 하나의 변환.", en: "<a href=\"/blog/matrix-transform\"><strong>Part 1</strong></a>: a matrix is stacked vectors; matrix×vector is <strong>a batch of dot products</strong> — one transformation." },
      { ko: "<a href=\"/blog/linear-geometry\"><strong>2편</strong></a>: 그 변환은 공간을 통째로 옮기지만, 격자선은 끝까지 <strong>평평하게</strong> 남았습니다.", en: "<a href=\"/blog/linear-geometry\"><strong>Part 2</strong></a>: that transformation moves all of space, but the grid lines stayed <strong>flat</strong> throughout." },
      { ko: "<strong>3편</strong>: 선형변환 사이에 비선형 꺾임 하나를 끼우니, 공간이 <strong>휘어</strong> 마침내 신경망이 되었습니다.", en: "<strong>Part 3</strong>: one nonlinear kink between the linear maps <strong>bends</strong> space, and at last it becomes a network." },
      { ko: "벡터 → 내적 → 행렬 → 선형변환 → 비선형 → 신경망. 이게 LLM이 서 있는 <strong>선형대수의 바닥</strong>입니다.", en: "Vector → dot product → matrix → linear map → nonlinearity → network. That's the <strong>linear-algebra floor</strong> an LLM stands on." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "여기까지가 바닥 다지기였습니다. 이제 그 위에 진짜 LLM을 올릴 차례입니다.", en: "That was the floor being laid. Now it's time to build the actual LLM on top of it." },
      { ko: "<a href=\"/blog/tokens-embeddings\"><strong>트랜스포머 시리즈</strong></a>는 이 바닥 위에서 시작합니다 — 글자를 벡터로 바꾸는 <a href=\"/blog/tokens-embeddings\"><strong>토큰·임베딩</strong></a>부터, 토큰끼리 내적으로 궁합을 재는 <a href=\"/blog/attention-why\"><strong>어텐션</strong></a>, 그리고 방금 배운 FFN까지 쌓아 GPT로 갑니다.", en: "The <a href=\"/blog/tokens-embeddings\"><strong>Transformer series</strong></a> starts right here — from <a href=\"/blog/tokens-embeddings\"><strong>tokens and embeddings</strong></a>, where text becomes vectors, to <a href=\"/blog/attention-why\"><strong>attention</strong></a>, where tokens score their match by dot product, and the very FFN you just learned — stacked all the way up to GPT." },
      { ko: "지금 손에 쥔 도구 — 내적, 행렬, 선형변환, 비선형 — 그대로 들고 넘어가면 됩니다.", en: "Carry the tools you now hold — dot product, matrix, linear map, nonlinearity — straight across." },
    ],
  },
];
