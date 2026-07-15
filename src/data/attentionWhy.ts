import type { BiBlock } from "./aiParadox";

export const blocks: BiBlock[] = [
  {
    type: "p",
    s: [
      { ko: "<strong>어텐션은 궁합 계산입니다.</strong>", en: "<strong>Attention is a compatibility calculation.</strong>" },
      { ko: "단어마다 \"내가 찾는 것\"(Query)과 \"내가 내놓는 것\"(Key)을 만들고, 둘의 방향이 맞으면 그 단어의 의미(Value)를 끌어옵니다.", en: "Every word produces \"what I'm looking for\" (Query) and \"what I offer\" (Key), and when the two point the same way, it pulls in that word's meaning (Value)." },
      { ko: "\"The cat didn't eat because <strong>it</strong> was full\"에서 it이 cat을 가리키는 이유가 바로 이 궁합 점수에서 나옵니다.", en: "In \"The cat didn't eat because <strong>it</strong> was full,\" the reason it refers to cat comes straight from this compatibility score." }
    ]
  },
  {
    type: "p",
    s: [
      { ko: "우리는 이 문장을 문법책 없이 문맥으로 풉니다.", en: "We resolve this sentence from context, no grammar book required." },
      { ko: "모델도 똑같이 합니다.", en: "The model does exactly the same thing." },
      { ko: "다만 \"문맥\"이 벡터 내적으로 바뀔 뿐입니다.", en: "The only difference is that \"context\" becomes a vector dot product." }
    ]
  },
  {
    type: "p",
    s: [
      { ko: "검색 엔진을 떠올리면 쉽습니다.", en: "Think of a search engine and it clicks." },
      { ko: "검색창에 친 말이 <strong>Query</strong>, 문서 제목이 <strong>Key</strong>, 문서 본문이 <strong>Value</strong>입니다.", en: "What you type in the search box is the <strong>Query</strong>, a document's title is the <strong>Key</strong>, and its body is the <strong>Value</strong>." },
      { ko: "제목이 검색어와 맞는 문서일수록 위로 올라오고, 우리는 그 문서의 본문을 읽습니다.", en: "The better a title matches your query, the higher the document ranks, and then you read its body." },
      { ko: "어텐션도 이 구조 그대로입니다.", en: "Attention has exactly this structure." }
    ]
  },
  {
    type: "callout",
    tone: "tldr",
    ko: "어텐션은 세 단계가 전부입니다. 점수(내적)로 \"누가 얼마나 맞는가\", softmax로 \"그걸 합 1의 비율로\", 가중합으로 \"그 비율만큼 의미를 섞기\". 나머지는 이 한 줄을 안정적으로 굴리는 장치입니다.",
    en: "Attention is just three steps. A score (dot product) for \"who matches how well,\" softmax to turn that into ratios summing to one, and a weighted sum to \"blend in meaning by those ratios.\" Everything else is machinery to run this one line reliably."
  },
  {
    type: "callout",
    tone: "tip",
    ko: "눈으로 보면서 읽으면 훨씬 빠릅니다. Q·K로 점수가 나오는 장면부터 열어보세요 — <a href=\"/playground/transformer/#scene-2\">직접 만져보기 →</a>",
    en: "It's far faster to read with your eyes on it. Start with the scene where Q·K produces the scores — <a href=\"/playground/transformer/#scene-2\">try it yourself →</a>"
  },
  {
    type: "h2",
    ko: "1. 단어마다 Q·K·V 세 벡터가 생긴다",
    en: "1. Every word spawns three vectors: Q, K, and V"
  },
  {
    type: "p",
    s: [
      { ko: "토큰 임베딩 하나에 학습된 투영 행렬 세 개를 곱해 세 벡터로 갈라집니다.", en: "A single token embedding is multiplied by three learned projection matrices, splitting it into three vectors." }
    ]
  },
  {
    type: "list",
    items: [
      { ko: "<strong>Query</strong>: 내가 지금 찾는 것 (it의 Q = \"내가 가리키는 명사는?\")", en: "<strong>Query</strong>: what I'm looking for right now (it's Q = \"which noun do I refer to?\")" },
      { ko: "<strong>Key</strong>: 남에게 내놓는 검색용 간판 (cat의 K = \"나는 배부를 수 있는 단수 동물\")", en: "<strong>Key</strong>: the searchable signboard I show others (cat's K = \"I'm a singular animal that can be full\")" },
      { ko: "<strong>Value</strong>: 실제로 넘겨줄 의미 (cat의 V = cat이라는 뜻 덩어리)", en: "<strong>Value</strong>: the meaning I actually hand over (cat's V = the chunk of meaning that is cat)" }
    ]
  },
  {
    type: "p",
    s: [
      { ko: "Q와 K는 \"누구를 볼지\" 고르는 데 쓰고, V는 \"실제로 흡수할 내용\"입니다.", en: "Q and K are used to choose \"whom to look at,\" while V is \"the content you actually absorb.\"" },
      { ko: "역할이 분리돼 있다는 게 핵심입니다.", en: "Keeping those roles separate is the whole point." }
    ]
  },
  {
    type: "p",
    s: [
      { ko: "같은 단어라도 문장에서 역할이 다르면 다른 벡터가 됩니다.", en: "The same word becomes a different vector when its role in the sentence changes." },
      { ko: "세 행렬은 규칙으로 짜 넣은 게 아니라 학습으로 정해집니다.", en: "Those three matrices aren't hand-coded rules; they're set by training." }
    ]
  },
  {
    type: "h2",
    ko: "2. 점수 = Qi·Kj, 방향이 비슷할수록 크다",
    en: "2. The score = Qi·Kj, and closer directions mean bigger scores"
  },
  {
    type: "p",
    s: [
      { ko: "it이 각 단어를 볼 점수는 두 벡터의 <strong>내적</strong>입니다.", en: "The score for how much it attends to each word is the <strong>dot product</strong> of two vectors." }
    ]
  },
  {
    type: "code",
    code: "score(i, j) = Qᵢ · Kⱼ"
  },
  {
    type: "p",
    s: [
      { ko: "내적은 방향이 얼마나 겹치는지 재는 자입니다.", en: "The dot product is a ruler for how much two directions overlap." },
      { ko: "각도가 좁을수록 값이 큽니다.", en: "The narrower the angle, the larger the value." },
      { ko: "it의 Query와 cat의 Key가 같은 쪽을 가리키면 점수가 높고, because나 was와는 어긋나 낮습니다.", en: "When it's Query and cat's Key point the same way the score is high, while it's low against because or was, where they don't line up." },
      { ko: "\"궁합 점수\"라는 말이 여기서 나옵니다.", en: "That's where the phrase \"compatibility score\" comes from." }
    ]
  },
  {
    type: "h2",
    ko: "3. softmax로 합이 1인 가중치를 만든다",
    en: "3. softmax turns scores into weights that sum to one"
  },
  {
    type: "p",
    s: [
      { ko: "점수는 그냥 실수라 크기가 제각각입니다.", en: "The scores are just raw numbers, so their magnitudes are all over the place." },
      { ko: "<strong>softmax</strong>로 전부 0~1 사이, 합이 1인 <strong>attention weight</strong>로 바꿉니다.", en: "<strong>softmax</strong> converts them all into <strong>attention weights</strong> between 0 and 1 that sum to one." }
    ]
  },
  {
    type: "code",
    code: "wᵢⱼ = softmax(scoreᵢ / τ)ⱼ"
  },
  {
    type: "p",
    s: [
      { ko: "그래서 it이 여러 단어에 나눠 주목하되 총량은 100%로 고정됩니다.", en: "So it can split its attention across several words while the total stays fixed at 100%." },
      { ko: "여기서 <strong>τ(temperature)</strong>가 분포의 뾰족함을 정합니다.", en: "Here <strong>τ (temperature)</strong> sets how sharp the distribution is." },
      { ko: "τ가 작으면 1등 단어 하나로 확 쏠리고, 크면 여러 단어에 평평하게 퍼집니다.", en: "A small τ snaps everything onto the single top word, while a large one spreads it flatly across many." },
      { ko: "한 곳만 볼지, 두루 볼지의 다이얼입니다.", en: "It's the dial between focusing on one spot and looking broadly." }
    ]
  },
  {
    type: "callout",
    tone: "tip",
    ko: "인터랙티브에서 <strong>τ 슬라이더</strong>를 0.3까지 내려 보세요. it의 가중치가 cat 하나로 뾰족하게 쏠리는 게 보입니다. <a href=\"/playground/transformer/#scene-3\">τ 밀어보기 →</a>",
    en: "In the interactive, drag the <strong>τ slider</strong> down to 0.3. You'll watch it's weight snap sharply onto cat alone. <a href=\"/playground/transformer/#scene-3\">push τ →</a>"
  },
  {
    type: "h2",
    ko: "4. 새 표현 = 가중합, 의미를 흡수한다",
    en: "4. The new representation = a weighted sum that absorbs meaning"
  },
  {
    type: "p",
    s: [
      { ko: "마지막은 간단합니다.", en: "The last step is simple." },
      { ko: "가중치대로 Value를 섞습니다.", en: "You mix the Values according to the weights." }
    ]
  },
  {
    type: "code",
    code: "it′ = Σⱼ wᵢⱼ · Vⱼ"
  },
  {
    type: "p",
    s: [
      { ko: "it이 cat에 80% 쏠렸다면, it의 새 표현은 cat의 Value로 80% 물듭니다.", en: "If it puts 80% of its weight on cat, it's new representation is dyed 80% with cat's Value." },
      { ko: "<strong>대명사가 가리키는 대상의 \"색\"을 흡수하는 순간</strong>입니다.", en: "This is <strong>the moment a pronoun absorbs the \"color\" of what it refers to</strong>." },
      { ko: "self-attention이 \"it은 cat\"이라는 정보를 표현에 새겨 넣는 방식이 바로 이것입니다.", en: "This is precisely how self-attention writes the information \"it is cat\" into the representation." }
    ]
  },
  {
    type: "callout",
    tone: "tip",
    ko: "it′ 알약이 cat의 색으로 물드는 걸 보세요 — <a href=\"/playground/transformer/#scene-4\">흡수 장면 열기 →</a>",
    en: "Watch the it′ pill take on cat's color — <a href=\"/playground/transformer/#scene-4\">open the absorption scene →</a>"
  },
  {
    type: "h2",
    ko: "5. 왜 학습이 이런 Q·K를 만드나",
    en: "5. Why training produces Q·K like this"
  },
  {
    type: "p",
    s: [
      { ko: "투영 행렬은 처음엔 랜덤입니다.", en: "The projection matrices start out random." },
      { ko: "그런데 \"it 다음을 잘 풀려면 cat을 봐야 한다\"는 신호가 역전파로 흘러갑니다.", en: "But the signal \"to handle what follows it, you need to look at cat\" flows back through backpropagation." }
    ]
  },
  {
    type: "p",
    s: [
      { ko: "그 결과 <strong>it의 Query와 cat의 Key가 같은 방향으로 정렬</strong>됩니다.", en: "As a result, <strong>it's Query and cat's Key align in the same direction</strong>." },
      { ko: "궁합이 맞아야 손실이 줄기 때문입니다.", en: "That's because a good match is what lowers the loss." },
      { ko: "Q·K는 규칙으로 짜 넣은 게 아니라, 손실을 줄이다 얻은 정렬입니다.", en: "Q·K isn't a hand-coded rule; it's the alignment you get from driving down the loss." }
    ]
  },
  {
    type: "h2",
    ko: "6. 멀티헤드 = 궁합을 여러 벌 동시에",
    en: "6. Multi-head = many compatibility passes at once"
  },
  {
    type: "p",
    s: [
      { ko: "이 궁합 계산을 한 벌만 돌리지 않습니다.", en: "You don't run this compatibility calculation just once." },
      { ko: "<strong>멀티헤드</strong>는 Q·K·V 투영을 여러 세트 두고 병렬로 돌립니다.", en: "<strong>Multi-head</strong> keeps several sets of Q·K·V projections and runs them in parallel." }
    ]
  },
  {
    type: "p",
    s: [
      { ko: "헤드마다 다른 관계를 맡습니다.", en: "Each head takes on a different relationship." },
      { ko: "어떤 헤드는 공참조(it→cat), 어떤 헤드는 바로 앞 단어, 어떤 헤드는 문장의 주어를 봅니다.", en: "One head handles coreference (it→cat), another the immediately preceding word, another the sentence's subject." },
      { ko: "관계마다 담당을 나눠 갖는 셈입니다.", en: "In effect, the relationships are divided up among specialists." }
    ]
  },
  {
    type: "p",
    s: [
      { ko: "self-attention은 결국 이겁니다.", en: "In the end, this is what self-attention is." },
      { ko: "시퀀스 어디에 있든 관련 문맥을 <strong>학습된 궁합으로 가중해 모으는 일</strong>.", en: "<strong>Gathering the relevant context, weighted by learned compatibility</strong>, no matter where it sits in the sequence." }
    ]
  },
  {
    type: "callout",
    tone: "tip",
    ko: "헤드를 켜고 끄며 관계마다 선이 어떻게 달라지는지 비교해 보세요 — <a href=\"/playground/transformer/#scene-5\">멀티헤드 보기 →</a>",
    en: "Toggle heads on and off and compare how the lines shift per relationship — <a href=\"/playground/transformer/#scene-5\">see multi-head →</a>"
  },
  {
    type: "h2",
    ko: "직접 만져보기",
    en: "Try it yourself"
  },
  {
    type: "p",
    s: [
      { ko: "말로 다섯 번 읽는 것보다 한 번 만지는 게 빠릅니다.", en: "One hands-on pass beats reading the words five times over." },
      { ko: "<a href=\"/playground/transformer/\">직접 만져보기 →</a>", en: "<a href=\"/playground/transformer/\">try it yourself →</a>" }
    ]
  },
  {
    type: "list",
    items: [
      { ko: "왼쪽 <strong>it</strong>에 마우스를 올리면 <strong>cat</strong>으로 굵은 선이 갑니다. 궁합이 만든 attention입니다.", en: "Hover over <strong>it</strong> on the left and a thick line runs to <strong>cat</strong>. That's the attention that compatibility built." },
      { ko: "<strong>① 점수 Q·Kᵀ</strong>에서 cat 막대가 왜 제일 긴지 확인하세요.", en: "In <strong>① scores Q·Kᵀ</strong>, see why the cat bar is the longest." },
      { ko: "<strong>② softmax의 τ 슬라이더</strong>를 좌우로 밀면 분포가 뾰족해지고 평평해집니다.", en: "Slide the <strong>τ slider in ② softmax</strong> left and right and the distribution sharpens and flattens." },
      { ko: "<strong>③ 가중합 Σ wᵢ·Vᵢ</strong>에서 it′ 알약이 cat의 색으로 물듭니다.", en: "In <strong>③ weighted sum Σ wᵢ·Vᵢ</strong>, the it′ pill takes on cat's color." },
      { ko: "상단 헤드 버튼을 켜고 끄면 헤드마다 어떤 선을 그리는지 비교됩니다.", en: "Toggle the head buttons at the top to compare which lines each head draws." }
    ]
  },
  {
    type: "p",
    s: [
      { ko: "이 세 장면이 어텐션의 \"왜\" 전부입니다.", en: "These three scenes are the entire \"why\" of attention." }
    ]
  },
  {
    type: "callout",
    tone: "warn",
    ko: "인터랙티브의 숫자는 실제 학습된 모델 가중치가 아니라, it→cat 같은 관계를 보여주려고 손으로 배치한 시연용 값입니다. 숫자 자체는 예시지만, Q·K → softmax(τ) → 가중합으로 흐르는 <strong>구조는 실제 트랜스포머와 동일</strong>합니다.",
    en: "The numbers in the interactive aren't real trained model weights; they're hand-placed demo values chosen to surface relationships like it→cat. The numbers themselves are illustrative, but the <strong>structure — Q·K → softmax(τ) → weighted sum — is identical to a real transformer</strong>."
  }
];
