import type { BiBlock } from "./aiParadox";

export const blocks: BiBlock[] = [
  {
    type: "callout",
    tone: "tldr",
    ko: "<strong>결론부터.</strong> 의미를 <strong>좌표</strong>로 바꾸면, 의미를 비교하는 일이 <strong>곱하고 더하는 한 번의 계산</strong>이 됩니다. 그 계산이 바로 <code>내적(dot product)</code>입니다. 두 벡터가 같은 방향을 가리킬수록 큰 값, 직각이면 0, 반대면 음수. 그래서 내적은 <strong>정렬 점수</strong>, 곧 닮음 점수입니다. 이 한 아이디어가 임베딩과 어텐션을 모두 굴립니다.",
    en: "<strong>The short version.</strong> Turn meaning into <strong>coordinates</strong>, and comparing meaning becomes a single <strong>multiply-and-add</strong>. That operation is the <code>dot product</code>. The more two vectors point the same way, the bigger it is; perpendicular gives 0; opposite gives negative. So the dot product is an <strong>alignment score</strong> — a similarity score. This one idea powers both embeddings and attention.",
  },

  {
    type: "p",
    s: [
      { ko: "이 글은 시리즈의 <strong>0편</strong>입니다.", en: "This is <strong>part 0</strong> of the series." },
      { ko: "LLM을 떠받치는 선형대수의 맨 아래 바닥을 깝니다.", en: "It lays the linear-algebra floor under everything in the LLM series." },
      { ko: "필요한 건 <strong>산수</strong>와 <code>(x, y)</code> 좌표 감각뿐입니다.", en: "All you need is <strong>arithmetic</strong> and a feel for <code>(x, y)</code> coordinates." },
      { ko: "행렬은 아직 안 나옵니다. 그건 1편입니다.", en: "No matrices yet — that's part 1." },
    ],
  },

  { type: "h2", ko: "왜 하필 숫자인가", en: "Why numbers at all?" },
  {
    type: "p",
    s: [
      { ko: "컴퓨터도 수학도, 결국 <strong>숫자만</strong> 비교하고 더할 수 있습니다.", en: "Computers and math can only ever <strong>compare and combine numbers</strong>." },
      { ko: "'사과'와 '바나나'가 얼마나 닮았는지, 글자 자체로는 계산할 수 없습니다.", en: "You can't compute how similar \"apple\" and \"banana\" are from the letters themselves." },
      { ko: "그래서 첫 단계는 항상 같습니다.", en: "So the first step is always the same." },
      { ko: "<strong>의미를 숫자 공간 안의 한 자리에 놓는 것</strong>입니다.", en: "<strong>Place the meaning at a spot in a number space.</strong>" },
      { ko: "자리를 잡고 나면, 나머지는 전부 산수입니다.", en: "Once it has a spot, the rest is just arithmetic." },
    ],
  },

  { type: "h2", ko: "벡터 — 숫자의 리스트이자, 공간 속 화살표", en: "A vector — a list of numbers, and an arrow in space" },
  {
    type: "p",
    s: [
      { ko: "<strong>벡터는 숫자의 리스트</strong>입니다. 그게 전부입니다.", en: "<strong>A vector is a list of numbers.</strong> That's all it is." },
      { ko: "예를 들어 과일을 '단맛'과 '크기' 두 축으로 적어봅시다.", en: "Say we describe fruit on two axes: \"sweetness\" and \"size\"." },
      { ko: "딸기 = <code>[6, 2]</code>, 수박 = <code>[7, 9]</code>, 레몬 = <code>[1, 3]</code>.", en: "Strawberry = <code>[6, 2]</code>, watermelon = <code>[7, 9]</code>, lemon = <code>[1, 3]</code>." },
      { ko: "이 두 숫자는 곧 평면 위의 <strong>좌표</strong>입니다.", en: "Those two numbers are just <strong>coordinates</strong> on a plane." },
      { ko: "딸기는 원점에서 오른쪽으로 6, 위로 2 간 <strong>한 점</strong>이자, 원점에서 그 점까지 뻗은 <strong>화살표</strong>입니다.", en: "Strawberry is the <strong>point</strong> 6 right and 2 up from the origin — and the <strong>arrow</strong> pointing from the origin to it." },
      { ko: "2차원으로 잡은 건 순전히 <strong>그림으로 그릴 수 있어서</strong>입니다. 실제 임베딩은 수백~수천 차원이지만, 원리는 똑같습니다.", en: "We keep it 2D purely so it's <strong>drawable</strong>. Real embeddings have hundreds or thousands of dimensions, but the idea is identical." },
    ],
  },

  { type: "h2", ko: "같은 벡터, 두 가지 읽는 법", en: "One vector, two ways to read it" },
  {
    type: "p",
    s: [
      { ko: "벡터 <code>[6, 2]</code>은 두 얼굴을 동시에 가집니다.", en: "The vector <code>[6, 2]</code> wears two faces at once." },
      { ko: "<strong>기하학으로 읽으면</strong>, 특정 방향과 길이를 가진 화살표(또는 점)입니다.", en: "<strong>Read geometrically</strong>, it's an arrow — a point — with a direction and a length." },
      { ko: "<strong>특징(feature)으로 읽으면</strong>, 각 좌표가 하나의 속성입니다. 6은 단맛, 2는 크기.", en: "<strong>Read as features</strong>, each coordinate is one attribute: 6 is sweetness, 2 is size." },
      { ko: "핵심은 이겁니다. <strong>둘은 서로 다른 두 물건이 아니라, 같은 하나를 두 각도에서 본 것</strong>입니다.", en: "Here's the key: <strong>these aren't two things — they're one object seen from two angles</strong>." },
      { ko: "좌표를 바꾸면 화살표가 움직이고, 화살표를 움직이면 특징 값이 바뀝니다.", en: "Change a coordinate and the arrow moves; move the arrow and the feature values change." },
    ],
  },

  { type: "h2", ko: "내적 — 먼저 계산, 그다음 의미", en: "The dot product — the calculation first, then the meaning" },
  {
    type: "p",
    s: [
      { ko: "<strong>내적은 짝이 맞는 좌표끼리 곱해서 전부 더한 것</strong>입니다.", en: "<strong>The dot product multiplies matching coordinates and sums them.</strong>" },
      { ko: "<code>a = [2, 1]</code>, <code>b = [3, 1]</code>이면 <code>a·b = 2×3 + 1×1 = 7</code>.", en: "For <code>a = [2, 1]</code>, <code>b = [3, 1]</code>: <code>a·b = 2×3 + 1×1 = 7</code>." },
      { ko: "곱하고, 더한다. 그게 다입니다.", en: "Multiply, then add. That's the whole recipe." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "이제 이 숫자가 <strong>무엇을 뜻하는지</strong>가 진짜 이야기입니다.", en: "Now for the real story: <strong>what that number means</strong>." },
      { ko: "내적에는 또 하나의 공식이 있습니다. <code>a·b = |a| |b| cos θ</code>.", en: "The dot product has a second formula: <code>a·b = |a| |b| cos θ</code>." },
      { ko: "여기서 <code>|a|</code>는 화살표의 길이입니다. 피타고라스로 구합니다 — <code>|[2, 1]| = √(2² + 1²) = √5 ≈ 2.24</code>.", en: "Here <code>|a|</code> is the arrow's length, straight from Pythagoras: <code>|[2, 1]| = √(2² + 1²) = √5 ≈ 2.24</code>." },
      { ko: "<code>θ</code>(세타)는 두 화살표 <strong>사이의 각도</strong>입니다.", en: "And <code>θ</code> (theta) is the <strong>angle between</strong> the two arrows." },
      { ko: "<code>cos θ</code>는 두 방향이 얼마나 겹치는지를 <code>-1</code>부터 <code>1</code> 사이 하나의 숫자로 눌러 담은 값입니다. 각도만 알면 됩니다.", en: "The <code>cos θ</code> term squeezes \"how much the two directions overlap\" into one number between <code>-1</code> and <code>1</code>. All it needs is the angle." },
      { ko: "두 화살표가 <strong>같은 방향</strong>이면 <code>θ = 0</code>, <code>cos θ = 1</code>.", en: "Point the <strong>same way</strong> and <code>θ = 0</code>, <code>cos θ = 1</code>." },
      { ko: "<strong>직각</strong>이면 <code>θ = 90°</code>, <code>cos θ = 0</code> — 내적은 <strong>정확히 0</strong>.", en: "<strong>Perpendicular</strong> means <code>θ = 90°</code>, <code>cos θ = 0</code> — the dot product is <strong>exactly 0</strong>." },
      { ko: "<strong>반대 방향</strong>이면 <code>θ = 180°</code>, <code>cos θ = -1</code> — 내적은 <strong>음수</strong>.", en: "Point <strong>opposite ways</strong> and <code>θ = 180°</code>, <code>cos θ = -1</code> — the dot product goes <strong>negative</strong>." },
      { ko: "단, 주의. 길이가 정해진 두 벡터라면 <code>cos θ = 1</code>일 때 내적이 가장 큽니다. 길이가 길어지면 각도와 상관없이 값 자체는 더 커질 수 있습니다.", en: "One caution: for two vectors <em>of fixed length</em>, <code>cos θ = 1</code> makes the dot product as large as it gets. Stretch the arrows longer and the raw value can climb regardless of angle." },
    ],
  },

  { type: "h2", ko: "그래서 내적은 정렬 점수다", en: "So the dot product is an alignment score" },
  {
    type: "p",
    s: [
      { ko: "이게 이 글 전체의 급소입니다.", en: "This is the payload of the whole post." },
      { ko: "<strong>내적 하나가 두 벡터가 얼마나 같은 쪽을 가리키는지 알려줍니다.</strong>", en: "<strong>A single dot product tells you how much two vectors point the same way.</strong>" },
      { ko: "크면 정렬됐고(닮았고), 0이면 무관하고, 음수면 상반됩니다.", en: "Big means aligned (alike), zero means unrelated, negative means opposed." },
      { ko: "의미를 좌표로 놓는 순간, '닮았다'는 판단이 곱셈과 덧셈 한 번으로 떨어집니다.", en: "The moment meaning becomes coordinates, judging \"alike\" collapses into one multiply-and-add." },
    ],
  },

  { type: "h2", ko: "코사인 유사도 — 길이를 나눠 방향만 본다", en: "Cosine similarity — divide out length, keep direction" },
  {
    type: "p",
    s: [
      { ko: "정렬 점수를 순수하게 쓰려면 한 가지를 더 다듬어야 합니다.", en: "To use that alignment score cleanly, we refine it one step further." },
      { ko: "긴 화살표는 방향이 그저 그래도 내적을 부풀립니다. <code>|a| |b|</code>가 크기 때문입니다.", en: "A long arrow inflates the dot product even when the direction is only so-so, because <code>|a| |b|</code> is large." },
      { ko: "순수하게 <strong>방향</strong>만 비교하고 싶으면, 길이를 나눠버리면 됩니다.", en: "To compare pure <strong>direction</strong>, just divide the length back out." },
      { ko: "그게 <strong>코사인 유사도</strong>입니다. <code>cos θ = (a·b) / (|a| |b|)</code>.", en: "That's <strong>cosine similarity</strong>: <code>cos θ = (a·b) / (|a| |b|)</code>." },
      { ko: "길이가 <strong>0이 아닌</strong> 두 벡터라면, 값은 항상 <code>[-1, 1]</code> 사이입니다. 1은 같은 방향, 0은 직각, -1은 반대.", en: "For two vectors of <strong>nonzero</strong> length, the value always lands in <code>[-1, 1]</code>: 1 is same direction, 0 is perpendicular, -1 is opposite." },
      { ko: "그래서 임베딩은 보통 <strong>방향</strong>으로, 즉 코사인으로 비교합니다. 길이는 잠시 옆으로 치웁니다.", en: "That's why embeddings are usually <strong>compared by direction</strong> — by cosine — setting length aside." },
    ],
  },

  {
    type: "code",
    code: [
      "같은 방향 (정렬됨, 닮음이 큼)",
      "  a = [2, 1]   b = [3, 1]",
      "  a·b = 2*3 + 1*1 = 6 + 1 = 7      -> 큰 양수",
      "",
      "직각 (무관)",
      "  a = [2, 0]   b = [0, 5]",
      "  a·b = 2*0 + 0*5 = 0 + 0 = 0      -> 정확히 0",
      "",
      "반대 방향 (상반)     b = -1 * a, 즉 완전히 반대",
      "  a = [2, 1]   b = [-2, -1]",
      "  a·b = 2*-2 + 1*-1 = -4 + -1 = -5 -> 음수",
    ].join("\n"),
  },

  {
    type: "callout",
    tone: "tip",
    ko: "<strong>앞으로 이어질 곳.</strong> 트랜스포머 시리즈 <strong>0편</strong>의 임베딩은 닮은 의미를 가까운 <strong>방향</strong>에 놓습니다 — 그래야 내적이 커지니까요. <strong>1편</strong>의 어텐션에서 '쿼리 i가 키 j에 얼마나 맞는가'라는 <strong>매치 점수</strong>는 문자 그대로 내적 <code>q·k</code>입니다(여기선 길이까지 그대로 반영되는 <em>원본</em> 내적입니다). 방금 배운 그 연산 그대로입니다.",
    en: "<strong>Where this goes next.</strong> Embeddings in Transformer-series <strong>part 0</strong> place similar meanings in nearby <strong>directions</strong> — precisely so the dot product runs high. And attention in <strong>part 1</strong> scores \"how well does query i match key j\" as a literal dot product <code>q·k</code> (here it's the <em>raw</em> dot product, magnitude and all). It's the exact operation you just learned.",
  },

  { type: "h2", ko: "직접 움직여 보세요", en: "Go move it yourself" },
  {
    type: "p",
    s: [
      { ko: "말로 읽는 것보다 손으로 끌어보는 게 빠릅니다.", en: "Dragging beats reading about it." },
      { ko: "<a href=\"/playground/vectors/\">벡터 플레이그라운드</a>에서 두 화살표를 직접 끌어보세요.", en: "In the <a href=\"/playground/vectors/\">vector playground</a>, drag the two arrows around." },
      { ko: "각도와 내적이 실시간으로 바뀌고, 한 벡터가 다른 벡터에 드리우는 <strong>사영(projection)</strong>도 함께 보입니다.", en: "The angle and dot product update live, and you'll see the <strong>projection</strong> of one vector onto the other too." },
      { ko: "같은 방향으로 겹치면 값이 커지고, 직각으로 돌리면 0에 붙는 걸 눈으로 확인하세요.", en: "Watch the value swell as they line up, and snap toward 0 as you turn them square." },
    ],
  },

  { type: "h2", ko: "1편으로 가는 다리 — 한 번이 아니라 한꺼번에", en: "The bridge to part 1 — not one at a time, but all at once" },
  {
    type: "p",
    s: [
      { ko: "벡터 하나 대 벡터 하나의 내적은 좋습니다. 그런데 부족합니다.", en: "One vector against one vector is nice. It's also not enough." },
      { ko: "실제 레이어는 <strong>여러 벡터를 여러 벡터에 대해 한꺼번에</strong> 비교합니다.", en: "A real layer compares <strong>many vectors against many, all at once</strong>." },
      { ko: "그 무더기 계산을 한 덩어리로 묶는 도구가 바로 <strong>행렬(matrix)</strong>입니다.", en: "The tool that bundles that whole batch into one object is exactly a <strong>matrix</strong>." },
      { ko: "다음 편에서, 내적을 잔뜩 쌓아 행렬로 만듭니다.", en: "Next part, we stack dot products by the fistful and call it a matrix." },
    ],
  },
];
