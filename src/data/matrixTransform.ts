import type { BiBlock } from "./aiParadox";

export const blocks: BiBlock[] = [
  {
    type: "callout",
    tone: "tldr",
    ko: "<strong>결론부터.</strong> <strong>행렬</strong>은 벡터를 쌓아 올린 표일 뿐입니다. 벡터에 행렬을 곱하는 일은 <strong>내적을 한 번에 여러 개 돌리는 것</strong>입니다 — 출력의 각 값이 행 하나와 입력 벡터의 내적입니다. 신경망 한 층이 하는 일, 어텐션이 <code>Q = X·W</code>로 토큰을 투영하는 일이 정확히 이 한 연산입니다. 그래서 행렬곱에 맞춰 만든 GPU가 LLM을 가능하게 합니다.",
    en: "<strong>The short version.</strong> A <strong>matrix</strong> is just a table of stacked vectors. Multiplying a vector by it is <strong>running many dot products at once</strong> — each output value is one row dotted with the input vector. A neural layer, and attention's <code>Q = X·W</code>, are exactly this one operation. That's why GPUs, built for matrix multiplies, make LLMs feasible.",
  },

  {
    type: "p",
    s: [
      { ko: "<a href=\"/blog/vectors-why\"><strong>0편</strong></a>에서 우리는 <strong>내적</strong>을 손에 넣었습니다.", en: "In <a href=\"/blog/vectors-why\"><strong>part 0</strong></a> we picked up the <strong>dot product</strong>." },
      { ko: "두 벡터의 맞물린 좌표를 곱해서 더하면, 그게 <strong>정렬 점수</strong>였죠.", en: "Multiply matching coordinates and sum — that was an <strong>alignment score</strong>." },
      { ko: "내적 하나는 <strong>한 쌍</strong>을 채점합니다.", en: "One dot product scores <strong>one pair</strong>." },
      { ko: "그런데 진짜 모델은 한 쌍이 아니라 한 번에 <strong>수천 쌍</strong>을 비교합니다.", en: "But a real model doesn't compare one pair — it compares <strong>thousands at once</strong>." },
      { ko: "토큰 하나가 아니라 문장 전체를, 뉴런 하나가 아니라 한 층 전체를요.", en: "Not one token but a whole sentence; not one neuron but a whole layer." },
      { ko: "그러려면 내적을 <strong>묶어서</strong> 돌려야 합니다. 그 묶음이 바로 <strong>행렬곱</strong>입니다.", en: "So we need to run dot products <strong>in a batch</strong>. That batch <em>is</em> a <strong>matrix multiply</strong>." },
    ],
  },

  { type: "h2", ko: "행렬 — 벡터를 쌓은 표", en: "A matrix — a table of stacked vectors" },
  {
    type: "p",
    s: [
      { ko: "<strong>행렬은 숫자를 격자로 늘어놓은 표</strong>입니다. 신비할 것 없습니다.", en: "<strong>A matrix is a table of numbers laid out in a grid.</strong> Nothing mystical." },
      { ko: "아래 그림이 2행 2열짜리 행렬입니다. 앞으로 <code>[[2, 0], [1, 3]]</code>처럼 적을 텐데, 바깥 대괄호가 행을 감쌉니다.", en: "Below is a 2-by-2 matrix. We'll write it as <code>[[2, 0], [1, 3]]</code> — the outer brackets hold the rows." },
    ],
  },
  {
    type: "code",
    code: [
      "        col0  col1",
      "      ┌            ┐",
      "row 0 │  2     0   │   ->  vector (2, 0)",
      "row 1 │  1     3   │   ->  vector (1, 3)",
      "      └            ┘",
    ].join("\n"),
  },
  {
    type: "p",
    s: [
      { ko: "가로로 읽으면, <strong>행(row)</strong>이 벡터입니다: <code>[2, 0]</code>과 <code>[1, 3]</code>.", en: "Read across, and each <strong>row</strong> is a vector: <code>[2, 0]</code> and <code>[1, 3]</code>." },
      { ko: "그러니까 행렬은 벡터를 위아래로 쌓아 놓은 것뿐입니다.", en: "So a matrix is just vectors stacked top to bottom." },
      { ko: "0편에서 벡터를 좌표로도 화살표로도 읽었던 것과 같습니다 — 같은 숫자, 다른 시선이죠.", en: "It's like reading a vector as coordinates or as an arrow back in part 0 — same numbers, a different lens." },
    ],
  },

  { type: "h2", ko: "행렬 × 벡터 — 내적을 한 묶음으로", en: "Matrix × vector — a bundle of dot products" },
  {
    type: "p",
    s: [
      { ko: "첫 행 <code>[2, 0]</code>만 떼어 봅시다.", en: "Take just the first row, <code>[2, 0]</code>." },
      { ko: "격자에서 뽑아내면, 이건 0편의 그 평범한 벡터입니다.", en: "Pull it off the grid — now it's an ordinary vector, exactly like part 0." },
      { ko: "입력 <code>[1, 2]</code>와 내적하면: <code>2·1 + 0·2 = 2</code>. 이게 출력의 첫 번째 숫자입니다.", en: "Dot it with the input <code>[1, 2]</code>: <code>2·1 + 0·2 = 2</code>. That's your first output number." },
      { ko: "둘째 행 <code>[1, 3]</code>도 똑같이 뽑아 내적합니다.", en: "Now pull the second row <code>[1, 3]</code> and dot it the same way." },
      { ko: "그게 규칙의 전부입니다: <strong>출력의 각 성분은 행 하나와 입력 벡터의 내적</strong>입니다.", en: "That's the whole rule: <strong>each output component is one row dotted with the input vector</strong>." },
      { ko: "그래서 '행렬을 적용한다'는 말은 문자 그대로 <strong>내적 여러 개를 한 번에 돌린다</strong>는 뜻입니다.", en: "So \"apply a matrix\" literally means <strong>run several dot products at once</strong>." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "숫자로 끝까지 해봅시다.", en: "Let's work it all the way through with numbers." },
      { ko: "<code>W = [[2, 0], [1, 3]]</code>에 입력 <code>x = [1, 2]</code>를 곱합니다.", en: "Take <code>W = [[2, 0], [1, 3]]</code> and multiply the input <code>x = [1, 2]</code>." },
      { ko: "첫 성분: 첫 행 <code>[2, 0]</code> · <code>x</code> = <code>2·1 + 0·2 = 2</code>.", en: "First component: row <code>[2, 0]</code> · <code>x</code> = <code>2·1 + 0·2 = 2</code>." },
      { ko: "둘째 성분: 둘째 행 <code>[1, 3]</code> · <code>x</code> = <code>1·1 + 3·2 = 7</code>.", en: "Second component: row <code>[1, 3]</code> · <code>x</code> = <code>1·1 + 3·2 = 7</code>." },
      { ko: "그래서 <code>W·x = [2, 7]</code>. 내적 두 번 돌린 것, 그게 전부입니다.", en: "So <code>W·x = [2, 7]</code>. Two dot products run — that's the whole thing." },
    ],
  },
  {
    type: "code",
    code: [
      "matrix x vector   (each output = one row . input vector)",
      "",
      "        W            x",
      "     [ 2  0 ]     [ 1 ]",
      "     [ 1  3 ]  x  [ 2 ]  =   ?",
      "",
      "  row 0 . x :   2*1 + 0*2  =  2 + 0  =  2",
      "  row 1 . x :   1*1 + 3*2  =  1 + 6  =  7",
      "",
      "  W x = [ 2, 7 ]",
      "",
      "  add a 2nd input column? run the same dot products on it:",
      "",
      "     [ 2  0 ]     [ 1  0 ]      [ 2   0 ]",
      "     [ 1  3 ]  x  [ 2  1 ]  =   [ 7   3 ]",
    ].join("\n"),
  },
  {
    type: "p",
    s: [
      { ko: "위 그림 마지막 줄이 힌트입니다.", en: "The last line of the diagram above is the hint." },
      { ko: "입력을 옆에 하나 더 붙이면, 같은 내적을 그 열에도 한 번 더 돌릴 뿐입니다.", en: "Add a second input beside the first, and you just run the same dot products on that column too." },
      { ko: "이렇게 여러 입력을 한 번에 처리하는 게 곧 <strong>행렬 × 행렬</strong>입니다.", en: "Handling several inputs at once like this is exactly <strong>matrix × matrix</strong>." },
    ],
  },

  { type: "h2", ko: "다시 보기 — 행렬은 벡터를 바꾸는 기계다", en: "Reframe — a matrix is a machine that transforms a vector" },
  {
    type: "p",
    s: [
      { ko: "방금 무슨 일이 일어났는지 한 발 물러서서 봅시다.", en: "Step back and look at what just happened." },
      { ko: "벡터 <code>[1, 2]</code>가 들어가서, 다른 벡터 <code>[2, 7]</code>가 나왔습니다.", en: "The vector <code>[1, 2]</code> went in, and a different vector <code>[2, 7]</code> came out." },
      { ko: "행렬은 <strong>벡터를 받아 새 벡터를 돌려주는 기계</strong>입니다.", en: "A matrix is a <strong>machine that takes a vector in and hands a new one back</strong>." },
      { ko: "다른 말로, 행렬은 하나의 <strong>변환(transformation)</strong>입니다.", en: "In other words, a matrix is a <strong>transformation</strong>." },
      { ko: "지금은 계산으로만 봤지만, 이 '변환'의 뜻은 <strong>2편</strong>에서 눈으로 보게 됩니다 — 지금은 이름만 챙겨 둡시다.", en: "For now we've only seen the arithmetic — we'll <em>see</em> what \"transformation\" means in <strong>part 2</strong>. For now, just keep the word." },
    ],
  },

  { type: "h2", ko: "행렬 × 행렬 — 열마다 반복할 뿐", en: "Matrix × matrix — just repeat it per column" },
  {
    type: "p",
    s: [
      { ko: "행렬끼리의 곱도 새로울 게 없습니다.", en: "Multiplying two matrices is nothing new." },
      { ko: "오른쪽 행렬을 이번엔 <strong>세로로</strong> 읽어 열을 벡터로 봅니다: 첫 열 <code>[1, 2]</code>, 둘째 열 <code>[0, 1]</code>.", en: "Read the right matrix <strong>down the columns</strong> now, each a vector: first column <code>[1, 2]</code>, second column <code>[0, 1]</code>." },
      { ko: "그리고 <strong>열 하나하나에 방금 한 '행렬 × 벡터'를 반복</strong>합니다.", en: "Then <strong>repeat that same \"matrix × vector\" for each column</strong>." },
      { ko: "첫 열로 한 번, 둘째 열로 또 한 번. 나온 결과 벡터를 나란히 세우면 그게 곱입니다.", en: "Once on the first column, again on the second. Stand the result vectors side by side — that's the product." },
      { ko: "그래서 결과의 <code>(i, j)</code> 자리는 <strong>왼쪽의 i번째 행 · 오른쪽의 j번째 열</strong>의 내적입니다.", en: "So entry <code>(i, j)</code> of the result is <strong>row i of the left dotted with column j of the right</strong>." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "칸 이름은 <strong>(행, 열) 순</strong>이고, 여기선 <strong>0부터</strong> 셉니다 — 좌표 <code>(x, y)</code>와 순서가 반대이니 주의하세요.", en: "Cells are named <strong>(row, column)</strong> — row first, counting from <strong>0</strong> — the opposite order from <code>(x, y)</code> coordinates, so watch out." },
      { ko: "한 칸만 손으로 채워 봅시다.", en: "Let's fill one cell by hand." },
      { ko: "<code>[[2, 0], [1, 3]]</code>에 <code>[[1, 0], [2, 1]]</code>를 곱할 때, <code>(1, 0)</code> 칸 = 행1 <code>[1, 3]</code> · 열0 <code>[1, 2]</code> = <code>1·1 + 3·2 = 7</code>.", en: "Multiplying <code>[[2, 0], [1, 3]]</code> by <code>[[1, 0], [2, 1]]</code>, cell <code>(1, 0)</code> = row 1 <code>[1, 3]</code> · column 0 <code>[1, 2]</code> = <code>1·1 + 3·2 = 7</code>." },
      { ko: "나머지 칸도 각자의 행·열로 똑같이 채우면 끝입니다.", en: "Fill every other cell the same way with its own row · column, and you're done." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "규칙은 하나만 더 있습니다.", en: "There's just one more rule." },
      { ko: "내적은 두 벡터를 하나씩 짝지어 곱하고 더합니다. 짝이 맞아야 하죠.", en: "A dot product pairs numbers up one-for-one and adds — the partners have to match up." },
      { ko: "그러니 왼쪽 행의 길이와 오른쪽 열의 길이가 <strong>같아야</strong> 합니다. 3개짜리 행이 2개짜리 열을 만나면 짝 없는 숫자가 남아 계산이 안 됩니다.", en: "So the left row and the right column must be the <strong>same length</strong>. A 3-long row meeting a 2-long column leaves a number with no partner, and the multiply-add runs off the end." },
      { ko: "그게 전부입니다: <strong>왼쪽의 열 개수 = 오른쪽의 행 개수</strong>.", en: "That's the whole shape rule: <strong>the left's column count = the right's row count</strong>." },
    ],
  },

  { type: "h2", ko: "왜 이 묶음이 중요한가 — GPU", en: "Why this batching matters — GPUs" },
  {
    type: "p",
    s: [
      { ko: "여기서 LLM의 실전 이야기가 시작됩니다.", en: "Here's where the practical LLM story begins." },
      { ko: "신경망 한 층은 학습된 행렬 <code>W</code> 하나로 입력 벡터를 출력 벡터로 바꿉니다 — 정확히 방금 본 <code>W·x</code>입니다.", en: "A neural layer turns an input vector into an output vector with one learned matrix <code>W</code> — exactly the <code>W·x</code> you just saw." },
      { ko: "토큰이 천 개면, 벡터 천 개를 <strong>같은 행렬 <code>W</code></strong>에 한 번에 통과시킵니다.", en: "With a thousand tokens, you push a thousand vectors through <strong>the same matrix <code>W</code></strong> in one go." },
      { ko: "이걸 for 문으로 하나씩 돌려도 답은 똑같습니다 — 행렬곱이 계산을 바꾸는 게 아닙니다.", en: "You could loop it one by one and get the identical result — matmul doesn't change the math." },
      { ko: "핵심은 이겁니다: 칸마다의 내적은 서로 <strong>독립</strong>입니다. 칸 <code>(0, 0)</code>은 칸 <code>(1, 0)</code>의 답을 기다리지 않습니다.", en: "Here's the key: every cell's dot product is <strong>independent</strong>. Cell <code>(0, 0)</code> never waits on cell <code>(1, 0)</code>." },
      { ko: "순서 없는 곱셈-덧셈 수천 개 — GPU는 바로 이런 독립적인 산수를 동시에 처리하도록 만들어진 하드웨어입니다.", en: "Thousands of multiply-adds with no ordering between them — a GPU is hardware built to run exactly this independent arithmetic all at once." },
    ],
  },

  {
    type: "callout",
    tone: "tip",
    ko: "<strong>LLM 훅.</strong> 트랜스포머 시리즈 <strong>1편</strong>의 어텐션에서, 토큰 벡터를 쌓은 <code>X</code>는 학습된 행렬을 통과해 <code>Q = X·W_Q</code>, <code>K = X·W_K</code>, <code>V = X·W_V</code>가 됩니다 — <strong>모든 토큰을 한 행렬로 투영</strong>하는, 방금 배운 그 연산입니다. 그리고 어텐션 점수는 <code>Q·Kᵀ</code>, 즉 칸 <code>(i, j)</code>가 <strong>쿼리 i · 키 j</strong>인 <strong>내적의 격자</strong>입니다 — 이 글에서 말한 '내적의 묶음' 바로 그것입니다.",
    en: "<strong>The LLM hook.</strong> In attention (Transformer series <strong>part 1</strong>), the stack of token vectors <code>X</code> is pushed through learned matrices into <code>Q = X·W_Q</code>, <code>K = X·W_K</code>, <code>V = X·W_V</code> — <strong>projecting every token through a matrix</strong>, the operation you just learned. And the attention scores are <code>Q·Kᵀ</code>: a <strong>grid of dot products</strong> where cell <code>(i, j)</code> is <strong>query i · key j</strong> — exactly the \"batch of dot products\" from this post.",
  },

  { type: "h2", ko: "직접 만져보기", en: "Play with it" },
  {
    type: "p",
    s: [
      { ko: "이 모든 걸 <a href=\"/playground/matmul/\">/playground/matmul/</a>에서 손으로 확인할 수 있습니다.", en: "You can feel all of this by hand at <a href=\"/playground/matmul/\">/playground/matmul/</a>." },
      { ko: "행 하나와 열 하나를 골라 강조해 보세요.", en: "Highlight one row and one column." },
      { ko: "그 둘의 내적이 <strong>출력 칸 하나</strong>로 채워지는 걸 지켜보세요.", en: "Watch their dot product fill in as a <strong>single output cell</strong>." },
      { ko: "칸을 하나씩 채우다 보면, 행렬곱이 결국 내적의 반복이라는 게 눈에 들어옵니다.", en: "Fill the cells one at a time, and you'll see a matrix multiply is just dot products repeated." },
    ],
  },

  { type: "h2", ko: "다음 편 — 변환을 눈으로 보기", en: "Next — seeing the transformation" },
  {
    type: "p",
    s: [
      { ko: "우리는 행렬을 계속 <strong>변환</strong>이라고 불렀습니다.", en: "We kept calling a matrix a <strong>transformation</strong>." },
      { ko: "<a href=\"/blog/linear-geometry\"><strong>2편</strong></a>에서는 그걸 실제로 <strong>봅니다</strong>.", en: "In <a href=\"/blog/linear-geometry\"><strong>part 2</strong></a> we actually <strong>see</strong> it." },
      { ko: "행렬 하나가 공간 자체를 어떻게 <strong>기울이고, 돌리고, 늘리는지</strong> 지켜봅니다.", en: "We watch one matrix <strong>bend, rotate, and stretch</strong> space itself." },
      { ko: "숫자로 익힌 이 연산이, 거기서 기하학이 됩니다.", en: "The operation you learned with numbers becomes geometry there." },
    ],
  },
];
