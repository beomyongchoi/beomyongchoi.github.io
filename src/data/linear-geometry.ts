import type { BiBlock } from "./aiParadox";

export const blocks: BiBlock[] = [
  {
    type: "callout",
    tone: "tldr",
    ko: "<strong>결론부터.</strong> 행렬은 평면 전체를 옮기는 <strong>변환</strong>입니다. 그 변환은 단 두 개의 단위 화살표 <code>î=(1,0)</code>와 <code>ĵ=(0,1)</code>를 <strong>어디로 보내는지</strong>로 완전히 결정됩니다. 그 두 도착지가 바로 행렬의 <strong>두 열</strong>입니다. 변환이 <strong>선형</strong>이라 격자는 곧고 고르게 유지되고, 그래서 모든 벡터가 자동으로 따라옵니다. 회전·확대·전단·투영이 전부 이 한 가지입니다.",
    en: "<strong>The short version.</strong> A matrix is a <strong>transformation</strong> that moves the whole plane. It's pinned down entirely by <strong>where it sends</strong> the two unit arrows <code>î=(1,0)</code> and <code>ĵ=(0,1)</code>. Those two landing spots are literally the matrix's <strong>two columns</strong>. Because the map is <strong>linear</strong>, the grid stays straight and evenly spaced, so every other vector follows automatically. Rotation, scaling, shear, projection are all just this.",
  },

  {
    type: "p",
    s: [
      { ko: "<a href=\"/blog/matrix-transform\"><strong>1편</strong></a>에서 행렬은 <strong>벡터를 받아 새 벡터를 돌려주는 기계</strong>였습니다.", en: "In <a href=\"/blog/matrix-transform\"><strong>part 1</strong></a>, a matrix was a <strong>machine that takes a vector in and hands a new one back</strong>." },
      { ko: "우리는 그걸 <strong>변환</strong>이라고 불렀습니다.", en: "We called that a <strong>transformation</strong>." },
      { ko: "그런데 계산만 봤을 뿐, 그 단어의 뜻은 아직 안 봤습니다.", en: "But we only watched the arithmetic — we never saw what the word means." },
      { ko: "이번엔 행렬을 벡터 하나가 아니라 <strong>평면 전체</strong>에 적용해 봅니다.", en: "This time we apply the matrix not to one vector but to the <strong>whole plane</strong>." },
      { ko: "그러면 '변환'이 문자 그대로 눈에 보입니다.", en: "Then \"transformation\" becomes something you literally see." },
    ],
  },

  { type: "h2", ko: "행렬은 공간을 옮긴다", en: "A matrix moves space" },
  {
    type: "p",
    s: [
      { ko: "<code>(x, y)</code> 평면에 격자를 깔았다고 합시다.", en: "Picture the <code>(x, y)</code> plane with its grid drawn on it." },
      { ko: "이제 행렬을 적용하면, 평면의 <strong>모든 점</strong>이 새 자리로 미끄러집니다.", en: "Apply a matrix, and <strong>every point</strong> of the plane slides to a new spot." },
      { ko: "곧던 격자선이 기울고, 사각형 칸이 평행사변형으로 변합니다.", en: "The straight grid lines tilt, and the square cells shear into parallelograms." },
      { ko: "점 하나를 옮기는 게 아니라, <strong>공간 자체를 변형</strong>하는 겁니다.", en: "It's not moving one point — it's <strong>deforming space itself</strong>." },
      { ko: "그럼 이 거대한 변형을 어떻게 붙잡을까요? 숫자 네 개면 충분합니다.", en: "So how do we pin down this huge deformation? Four numbers are enough." },
    ],
  },

  { type: "h2", ko: "핵심 트릭 — 두 화살표만 쫓아라", en: "The key trick — just follow two arrows" },
  {
    type: "p",
    s: [
      { ko: "단위 화살표 두 개를 정합니다: <code>î=(1,0)</code>은 오른쪽 한 칸, <code>ĵ=(0,1)</code>은 위 한 칸.", en: "Fix two unit arrows: <code>î=(1,0)</code> is one step right, <code>ĵ=(0,1)</code> is one step up." },
      { ko: "주장은 이렇습니다: <strong>행렬의 두 열이 바로 <code>î</code>와 <code>ĵ</code>가 도착하는 자리</strong>입니다.", en: "The claim: <strong>the matrix's two columns are exactly where <code>î</code> and <code>ĵ</code> land</strong>." },
      { ko: "1편의 규칙으로 확인해 봅시다: 출력 성분 = 행 · 입력.", en: "Let's check it with the rule from part 1: each output component = row · input." },
      { ko: "<code>W = [[a, b], [c, d]]</code>에 <code>î=(1,0)</code>을 넣으면, 첫 성분 <code>a·1 + b·0 = a</code>, 둘째 성분 <code>c·1 + d·0 = c</code>.", en: "Feed <code>î=(1,0)</code> into <code>W = [[a, b], [c, d]]</code>: first component <code>a·1 + b·0 = a</code>, second <code>c·1 + d·0 = c</code>." },
      { ko: "그래서 <code>W·î = (a, c)</code> — 정확히 <strong>첫 번째 열</strong>입니다.", en: "So <code>W·î = (a, c)</code> — exactly the <strong>first column</strong>." },
      { ko: "같은 식으로 <code>W·ĵ = (b, d)</code>, <strong>두 번째 열</strong>이죠.", en: "The same way, <code>W·ĵ = (b, d)</code>, the <strong>second column</strong>." },
      { ko: "행이 아니라 <strong>열</strong>입니다 — 여기서 순서를 헷갈리면 그림이 통째로 틀어집니다.", en: "Columns, not rows — mix that up and the whole picture goes wrong." },
      { ko: "곧 실제 숫자로 <code>î</code>가 화살표째 이동하는 걸 봅니다.", en: "In a moment we'll watch that arrow physically relocate with real numbers." },
    ],
  },

  { type: "h2", ko: "왜 두 열이면 충분한가 — 선형성", en: "Why two columns are enough — linearity" },
  {
    type: "p",
    s: [
      { ko: "이제 왜 이 두 도착지가 <strong>모든 것</strong>을 결정하는지 봅시다.", en: "Now see why those two landing spots decide <strong>everything</strong>." },
      { ko: "어떤 벡터든 <code>(x, y) = x·î + y·ĵ</code>로 쪼갤 수 있습니다.", en: "Any vector splits as <code>(x, y) = x·î + y·ĵ</code>." },
      { ko: "<code>î</code>를 <code>x</code>번, <code>ĵ</code>를 <code>y</code>번 밟은 것뿐이죠.", en: "It's just <code>x</code> steps of <code>î</code> and <code>y</code> steps of <code>ĵ</code>." },
      { ko: "변환이 <strong>선형</strong>이면 이 조합을 그대로 유지합니다: <code>(x, y)</code>는 <code>x·(새 î) + y·(새 ĵ)</code>로 갑니다.", en: "A <strong>linear</strong> map preserves that combination: <code>(x, y)</code> goes to <code>x·(new î) + y·(new ĵ)</code>." },
      { ko: "그러니 두 열의 도착지만 알면, 나머지 모든 점의 도착지는 자동으로 따라 나옵니다.", en: "So once you know where the two columns land, every other point's destination follows for free." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "이걸 그림으로 말하면 그게 곧 <strong>'선형'의 정의</strong>입니다.", en: "Say this in pictures and you get the very <strong>definition of \"linear\"</strong>." },
      { ko: "격자선은 <strong>곧게</strong> 유지됩니다 — 절대 휘지 않습니다.", en: "Grid lines stay <strong>straight</strong> — they never curve." },
      { ko: "평행하던 선은 <strong>계속 평행</strong>하고, 간격은 <strong>여전히 고릅니다</strong>.", en: "Parallel lines stay <strong>parallel</strong>, and spacing stays <strong>even</strong>." },
      { ko: "그리고 <strong>원점은 제자리</strong>에 못 박혀 있습니다.", en: "And the <strong>origin stays put</strong>." },
      { ko: "이 네 조건을 지키는 변형, 그게 선형변환입니다.", en: "A deformation that keeps those four conditions — that's a linear map." },
    ],
  },

  { type: "h2", ko: "손으로 한 번 — 전단 + 확대", en: "By hand — a shear plus a stretch" },
  {
    type: "p",
    s: [
      { ko: "구체적인 행렬 하나로 끝까지 해봅시다: <code>W = [[2, 1], [0, 1]]</code>.", en: "Let's run one concrete matrix all the way: <code>W = [[2, 1], [0, 1]]</code>." },
      { ko: "첫 열은 <code>(2, 0)</code> — 그러니 <code>î</code>는 <code>(2, 0)</code>으로 가서 오른쪽으로 두 배 늘어납니다.", en: "First column is <code>(2, 0)</code> — so <code>î</code> lands at <code>(2, 0)</code>, stretched out to twice the length." },
      { ko: "둘째 열은 <code>(1, 1)</code> — 그러니 <code>ĵ</code>는 위로 서면서 오른쪽으로 밀려 <code>(1, 1)</code>로 갑니다.", en: "Second column is <code>(1, 1)</code> — so <code>ĵ</code> stays up but slides right, landing at <code>(1, 1)</code>." },
      { ko: "이제 다른 점 <code>(1, 1)</code>은 어디로 갈까요?", en: "Now where does another point, <code>(1, 1)</code>, go?" },
      { ko: "선형성으로: <code>(1, 1) = 1·î + 1·ĵ</code> → <code>(2, 0) + (1, 1) = (3, 1)</code>.", en: "By linearity: <code>(1, 1) = 1·î + 1·ĵ</code> → <code>(2, 0) + (1, 1) = (3, 1)</code>." },
      { ko: "두 열을 더한 것뿐입니다 — 1편의 규칙으로 직접 곱해도 <code>(3, 1)</code>이 나옵니다.", en: "It's just the two columns added — and multiplying it out with the part-1 rule gives <code>(3, 1)</code> too." },
    ],
  },
  {
    type: "code",
    code: [
      "W = [ 2  1 ]     basis vectors land on the columns",
      "    [ 0  1 ]",
      "",
      "  i-hat = (1,0)  ->  col 0  =  (2, 0)",
      "  j-hat = (0,1)  ->  col 1  =  (1, 1)",
      "",
      "  any point is x*(new i) + y*(new j):",
      "    (1,1) = 1*(2,0) + 1*(1,1)  =  (3, 1)",
      "",
      "  cross-check with the row . input rule:",
      "    row0 . (1,1) = 2*1 + 1*1 = 3",
      "    row1 . (1,1) = 0*1 + 1*1 = 1     ->  (3, 1)  OK",
      "",
      "  before                 after  (grid stays straight)",
      "     ^ y                     ^ y",
      "     |  j=(0,1)              /  j'=(1,1)",
      "     | /                    /",
      "     |/___ i=(1,0)__> x    +_________ i'=(2,0)___> x",
      "   origin fixed           origin fixed",
    ].join("\n"),
  },

  { type: "h2", ko: "지도 모음 — 열만 읽으면 정체가 보인다", en: "A gallery of maps — read the columns" },
  {
    type: "p",
    s: [
      { ko: "이제 흔한 변환들은 <strong>두 열만 읽어도</strong> 정체가 드러납니다.", en: "Now the common maps give themselves away the moment you <strong>read the two columns</strong>." },
    ],
  },
  {
    type: "list",
    items: [
      { ko: "<strong>확대(Scaling)</strong> — 대각 행렬 <code>[[2, 0], [0, 3]]</code>. <code>î</code>는 가로로 2배, <code>ĵ</code>는 세로로 3배. 격자가 직사각형으로 커집니다.", en: "<strong>Scaling</strong> — a diagonal matrix <code>[[2, 0], [0, 3]]</code>. <code>î</code> stretches 2× along x, <code>ĵ</code> 3× along y. The grid grows into rectangles." },
      { ko: "<strong>회전(Rotation)</strong> — 두 열이 그냥 <strong>돌아간 단위 화살표</strong>입니다. <code>[[cosθ, -sinθ], [sinθ, cosθ]]</code>에서 첫 열이 회전한 <code>î</code>, 둘째 열이 회전한 <code>ĵ</code>. 길이는 그대로, 각도만 바뀝니다.", en: "<strong>Rotation</strong> — the two columns are just the <strong>rotated unit arrows</strong>. In <code>[[cosθ, -sinθ], [sinθ, cosθ]]</code> the first column is the rotated <code>î</code>, the second the rotated <code>ĵ</code>. Lengths stay, only the angle turns." },
      { ko: "<strong>전단(Shear)</strong> — 순수 전단은 <code>[[1, 1], [0, 1]]</code>. <code>î</code>는 가만있고 <code>ĵ</code>만 옆으로 미끄러져 격자가 평행사변형으로 기웁니다. 방금 예제도 여기에 확대가 섞인 닮은 꼴이죠.", en: "<strong>Shear</strong> — a pure shear is <code>[[1, 1], [0, 1]]</code>. <code>î</code> stays put while <code>ĵ</code> slides sideways, tilting the grid into parallelograms. Our worked example was this same slide with a stretch mixed in." },
      { ko: "<strong>투영(Projection)</strong> — 두 열이 평면을 <strong>직선 하나로 눌러 버립니다</strong>. <code>[[1, 0], [0, 0]]</code>이면 넓이가 0으로 붕괴하고, 정보가 사라집니다. <strong>되돌릴 수 없습니다.</strong>", en: "<strong>Projection</strong> — the two columns <strong>squash the plane onto a single line</strong>. With <code>[[1, 0], [0, 0]]</code>, area collapses to zero, information is lost, and it's <strong>not reversible</strong>." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "투영은 특히 눈여겨 두세요.", en: "Keep an eye on projection in particular." },
      { ko: "확대·회전·전단은 되돌릴 수 있지만, 직선으로 눌러버린 투영은 못 되돌립니다.", en: "Scaling, rotation, and shear can be undone; a projection that flattens onto a line cannot." },
      { ko: "그러니 <strong>모든 행렬이 역이 있는 건 아닙니다</strong> — 넓이를 0으로 만드는 순간 정보가 날아갑니다.", en: "So <strong>not every matrix is invertible</strong> — the moment area goes to zero, information is gone." },
    ],
  },

  {
    type: "callout",
    tone: "tip",
    ko: "<strong>LLM 훅.</strong> 트랜스포머 안의 학습된 가중치 행렬이 전부 이 선형변환입니다. 어텐션의 <code>Q = X·W_Q</code>, <code>K = X·W_K</code>, <code>V = X·W_V</code>, 출력 투영, FFN의 가중치 — 하나하나가 <strong>벡터 공간을 다시 빚어</strong>, 모델이 중요하게 여기는 방향을 축에 정렬하거나 서로 <strong>내적(0편)으로 비교하기 쉽게</strong> 놓습니다. 어텐션의 각 헤드는 토큰을 더 낮은 차원의 <strong>부분공간으로 투영</strong>합니다. 여기서 '투영'은 차원을 줄이는 선형사상을 뜻하고, 갤러리의 넓이-0 투영처럼 정보를 통째로 날리는 건 아닙니다. 실제로는 수백~수천 차원이라 그림으로 그릴 순 없지만, 연산은 똑같습니다 — <strong>기저를 어딘가로 보낸다</strong>.",
    en: "<strong>The LLM hook.</strong> The learned weight matrices in a transformer are all these linear maps. Attention's <code>Q = X·W_Q</code>, <code>K = X·W_K</code>, <code>V = X·W_V</code>, the output projection, the FFN's weights — each <strong>reshapes the vector space</strong> so the directions the model cares about line up with axes or become easy to <strong>compare by dot product (part 0)</strong>. Each attention head <strong>projects tokens into a lower-dimensional subspace</strong>. Here \"projection\" means a dimension-reducing linear map, not the gallery's area-to-zero projection that throws information away. The real ones live in hundreds or thousands of dimensions, too many to draw — but the operation is identical: <strong>send the basis somewhere</strong>.",
  },

  { type: "h2", ko: "직접 만져보기", en: "Play with it" },
  {
    type: "p",
    s: [
      { ko: "이걸 <a href=\"/playground/linear-map/\">/playground/linear-map/</a>에서 직접 휘어 보세요.", en: "Bend it yourself at <a href=\"/playground/linear-map/\">/playground/linear-map/</a>." },
      { ko: "슬라이더를 끌거나 프리셋을 골라 보세요.", en: "Drag the sliders or pick a preset." },
      { ko: "격자가 돌고, 늘어나고, 기울고, 직선으로 붕괴하는 걸 지켜보세요.", en: "Watch the grid rotate, stretch, shear, and collapse onto a line." },
      { ko: "<code>î</code>와 <code>ĵ</code>가 정확히 행렬의 두 열로 이동하는 게 보일 겁니다.", en: "You'll see <code>î</code> and <code>ĵ</code> move to exactly the matrix's two columns." },
    ],
  },

  { type: "h2", ko: "다음 편 — 선형의 한계, 그리고 곡선", en: "Next — the limit of linear, and curves" },
  {
    type: "p",
    s: [
      { ko: "지금까지의 모든 변환은 격자선을 <strong>곧게</strong> 유지했습니다.", en: "Every map so far kept the grid lines <strong>straight</strong>." },
      { ko: "그게 선형의 힘이자, 동시에 <strong>한계</strong>입니다.", en: "That's the strength of linear — and also its <strong>limit</strong>." },
      { ko: "선형변환을 두 번 쌓아도 결과는 여전히 선형변환입니다. 세상은 계속 평평하죠.", en: "Stack two linear maps and you still get a linear map — the world stays flat." },
      { ko: "직선 하나로는 원 안과 밖을 가를 수 없습니다. 선형이 못 하는 게 바로 이런 겁니다.", en: "No straight line separates the inside of a circle from the outside — that's the kind of thing linear can't do." },
      { ko: "공간을 <strong>곡선으로 휘어</strong> 어려운 패턴을 진짜로 학습하려면, <strong>비선형</strong> 단계가 필요합니다.", en: "To <strong>bend space into curves</strong> and actually learn hard patterns, you need a <strong>nonlinear</strong> step." },
      { ko: "선형 + 비선형, 그게 신경망입니다. <a href=\"/blog/nonlinear-network\"><strong>3편</strong></a>에서 만납니다.", en: "Linear plus nonlinear — that's a neural network. We meet it in <a href=\"/blog/nonlinear-network\"><strong>part 3</strong></a>." },
    ],
  },
];
