import type { BiBlock } from "./aiParadox";

export const blocks: BiBlock[] = [
  {
    type: "callout",
    tone: "tldr",
    ko: "<strong>결론부터.</strong> 2편의 트랜스포머 블록을 <strong>인코더로만</strong> N층 쌓으면 BERT입니다(base 12층 약 110M, large 24층 약 340M). 각 토큰이 왼쪽·오른쪽 문맥을 <strong>동시에</strong> 봅니다(양방향). 이게 가능한 건 사전학습 과제가 '다음 토큰 예측'이 아니라 <strong>빈칸 채우기</strong>(MLM)라서입니다. 빈칸을 맞히는 일이라 오른쪽을 봐도 정답 누출이 아닙니다. 그래서 BERT는 생성이 아니라 <strong>이해</strong>(분류·개체명 인식·검색)에 씁니다.",
    en: "<strong>The short version.</strong> Stack the transformer block from part 2 <strong>encoder-only</strong>, N layers deep, and you get BERT (base: 12 layers, ~110M; large: 24 layers, ~340M). Each token sees its left and right context <strong>at the same time</strong> — bidirectional. That works because the pretraining task isn't next-token prediction but <strong>fill-in-the-blank</strong> (MLM). Since you're guessing a blanked-out token, seeing the right side isn't leaking the answer. So BERT is for <strong>understanding</strong> (classification, NER, retrieval), not generation.",
  },

  {
    type: "p",
    s: [
      { ko: "2편에서 트랜스포머 블록 하나를 뜯어봤습니다.", en: "In part 2 we took apart a single transformer block." },
      { ko: "셀프어텐션으로 토큰끼리 정보를 섞고, FFN으로 다듬고, 잔차·정규화로 깊게 쌓는 한 층이었습니다.", en: "It was one layer: mix tokens with self-attention, refine with an FFN, stack deep with residuals and normalization." },
      { ko: "그 블록을 <strong>인코더로만</strong> 12층·24층 쌓은 것이 <strong>BERT</strong>입니다(Devlin et al. 2018).", en: "Stack that block <strong>encoder-only</strong>, 12 or 24 layers deep, and you get <strong>BERT</strong> (Devlin et al. 2018)." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "인코더로 쌓으면 각 토큰이 왼쪽·오른쪽 문맥을 모두 보고 자기 표현을 만듭니다.", en: "Stacked as an encoder, each token builds its representation from both its left and its right context." },
      { ko: "이걸 <strong>깊은 양방향</strong>(deeply bidirectional)이라고 부릅니다.", en: "This is called <strong>deeply bidirectional</strong>." },
      { ko: "'깊은'이 붙는 이유가 있습니다.", en: "The \"deeply\" is there for a reason." },
      { ko: "왼쪽→오른쪽 모델과 오른쪽→왼쪽 모델을 따로 학습해 끝에서 얕게 이어붙이는 방식(ELMo류)이 아니라, <strong>매 층에서 좌우를 동시에</strong> 어텐션하기 때문입니다.", en: "It's not two separately trained models — a left-to-right one and a right-to-left one — shallowly concatenated at the end (the ELMo style); it's left and right attended to <strong>together, at every layer</strong>." },
    ],
  },

  { type: "hr" },

  { type: "h2", ko: "1. 왜 양방향은 커닝이 아닌가", en: "1. Why bidirectional isn't cheating" },
  {
    type: "p",
    s: [
      { ko: "같은 트랜스포머 블록인데 GPT는 왼쪽만 보고 BERT는 양쪽을 봅니다.", en: "Same transformer block, yet GPT sees only the left and BERT sees both sides." },
      { ko: "차이는 부품이 아니라 <strong>사전학습 과제</strong>에서 나옵니다.", en: "The difference isn't in the parts — it's in the <strong>pretraining task</strong>." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "GPT의 과제는 <strong>다음 토큰 예측</strong>입니다.", en: "GPT's task is <strong>next-token prediction</strong>." },
      { ko: "각 위치에서 바로 오른쪽 토큰이 정답이라, 오른쪽을 미리 보면 정답을 베끼는 커닝이 됩니다.", en: "At each position the very next token to the right is the answer, so peeking right is copying the answer — cheating." },
      { ko: "그래서 <strong>causal 마스크</strong>로 미래 토큰을 가려, 각 토큰이 이전 토큰만 보게 합니다.", en: "So a <strong>causal mask</strong> hides the future tokens, letting each token see only the ones before it." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "BERT의 과제는 <strong>빈칸 채우기</strong>입니다.", en: "BERT's task is <strong>fill-in-the-blank</strong>." },
      { ko: "미리 고른 위치의 원래 토큰을 문맥으로 맞히는 일이라, 오른쪽을 봐도 정답 누출이 아닙니다.", en: "You guess the original token at a pre-selected position from context, so seeing the right side doesn't leak the answer." },
      { ko: "그래서 마스크 없이 좌우를 다 봅니다.", en: "That's why it reads both sides, unmasked." },
      { ko: "이 과제 차이가 인코더와 디코더를 가릅니다.", en: "This difference in task is what splits encoders from decoders." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "여기서 자연스러운 반문이 하나 뜹니다.", en: "A natural objection comes up here." },
      { ko: "'그럼 GPT도 다음 토큰을 가리고 오른쪽을 보면 되지 않나?'", en: "\"Then couldn't GPT also blank out the next token and look right?\"" },
      { ko: "근본 차이는 <strong>추론할 때 오른쪽이 존재하느냐</strong>입니다.", en: "The deeper difference is <strong>whether a right side even exists at inference time</strong>." },
      { ko: "생성은 왼쪽에서 오른쪽으로 만들어가므로, 뽑는 그 순간 오른쪽은 아직 없습니다.", en: "Generation builds left to right, so at the moment you produce a token there is no right side yet." },
      { ko: "BERT는 완성된 문장을 통째로 받아 빈칸만 메우므로, 오른쪽이 이미 거기 있습니다.", en: "BERT receives a complete sentence all at once and just fills the blanks, so the right side is already there." },
    ],
  },
  {
    type: "code",
    code:
      "문장:  the  cat  [MASK]  on  the  mat\n" +
      "\n" +
      "BERT (인코더, 양방향)\n" +
      "  the cat ──▶ [MASK] ◀── on the mat     좌우 둘 다 흡수\n" +
      "              (빈칸이라 오른쪽 봐도 커닝 아님)\n" +
      "\n" +
      "GPT (디코더, causal)\n" +
      "  the cat on the ──▶ (다음?)             왼쪽만 보고 다음을 뽑음\n" +
      "                     추론 순간 오른쪽은 아직 없음",
  },
  {
    type: "callout",
    tone: "warn",
    ko: "두 '마스크'는 서로 다른 층위입니다. <strong>MLM 마스크는 입력 토큰을 [MASK]로 치환</strong>하는 것이고, <strong>causal 마스크는 어텐션 점수에서 미래 위치를 −∞로 가리는</strong> 것입니다. 같은 단어를 쓰지만 작동하는 곳이 다릅니다(입력 vs 어텐션 행렬).",
    en: "The two \"masks\" live at different levels. The <strong>MLM mask replaces an input token with [MASK]</strong>; the <strong>causal mask sets future positions to −∞ in the attention scores</strong>. Same word, different place of action (the input vs. the attention matrix).",
  },

  { type: "hr" },

  { type: "h2", ko: "2. MLM — 15%를 가리고 맞힌다", en: "2. MLM — mask 15%, then guess it" },
  {
    type: "p",
    s: [
      { ko: "<strong>MLM</strong>(마스크 언어 모델)이 BERT의 주 사전학습 목표입니다.", en: "<strong>MLM</strong> (masked language modeling) is BERT's main pretraining objective." },
      { ko: "입력 토큰의 <strong>15%</strong>를 뽑아 그 자리의 원래 토큰을 맞히게 합니다.", en: "It picks <strong>15%</strong> of the input tokens and makes the model guess the original token at each spot." },
      { ko: "맞히는 일은 인코더 출력 위에 얹은 별도의 <strong>MLM 예측 헤드</strong>에서 일어납니다.", en: "The guessing happens in a separate <strong>MLM prediction head</strong> on top of the encoder output." },
      { ko: "그 위치의 최종 은닉 상태를 어휘 크기로 사영해 소프트맥스로 어떤 단어인지 고릅니다.", en: "It projects that position's final hidden state to the vocabulary size and picks the word with a softmax." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "그런데 뽑은 15%를 전부 [MASK]로 바꾸지는 않습니다.", en: "But it doesn't turn all of that 15% into [MASK]." },
      { ko: "셋으로 나눕니다.", en: "It splits them three ways." },
    ],
  },
  {
    type: "code",
    code:
      "입력 토큰 중 15%를 선택 — 그 15%를 다시 세 갈래로:\n" +
      "  ┌─ 80%  →  [MASK] 로 치환\n" +
      "  ├─ 10%  →  엉뚱한 랜덤 토큰으로 치환\n" +
      "  └─ 10%  →  원래 토큰 그대로 둠\n" +
      "\n" +
      "* 어느 경우든 정답 라벨은 언제나 '원래 토큰'",
  },
  {
    type: "p",
    s: [
      { ko: "섞는 이유는 <strong>학습과 실전의 입력을 덜 어긋나게</strong> 하려는 것입니다.", en: "The mixing is there to <strong>reduce the mismatch between training and real use</strong>." },
      { ko: "파인튜닝이나 추론 때 실제 입력에는 [MASK]가 등장하지 않습니다.", en: "At fine-tuning or inference time, real inputs never contain a [MASK]." },
      { ko: "학습이 [MASK] 토큰 자체에만 의존하지 않도록, 일부는 랜덤 토큰으로, 일부는 원본 그대로 섞습니다.", en: "So that training doesn't lean on the [MASK] token itself, some spots get a random token and some are left untouched." },
      { ko: "그 결과 모델은 모든 위치에서 문맥 기반 표현을 유지하게 됩니다.", en: "The result is that the model keeps a context-based representation at every position." },
    ],
  },
  {
    type: "callout",
    tone: "tip",
    ko: "원조 BERT엔 MLM 말고 <strong>NSP</strong>(다음 문장 예측: 문장 B가 A 다음 문장인지 이진 분류)도 있었습니다. 문장 사이 관계를 배우려던 보조 목표였습니다. 나중에 효과가 작다고 밝혀졌고, RoBERTa(Liu et al. 2019)는 NSP를 빼고 <strong>동적 마스킹</strong>과 더 많은 데이터로 성능을 끌어올렸습니다.",
    en: "The original BERT had a second objective besides MLM: <strong>NSP</strong> (next-sentence prediction — a binary classification of whether sentence B follows sentence A). It was an auxiliary goal for learning inter-sentence relationships. It later proved to have little effect, and RoBERTa (Liu et al. 2019) dropped NSP and pushed performance up with <strong>dynamic masking</strong> and more data.",
  },

  { type: "hr" },

  { type: "h2", ko: "3. [CLS] — 문장 하나를 벡터 하나로", en: "3. [CLS] — one sentence into one vector" },
  {
    type: "p",
    s: [
      { ko: "토큰을 다 양방향으로 읽고 나면, 문장 전체를 대표하는 값이 하나 필요합니다.", en: "Once every token has been read bidirectionally, you need a single value that stands for the whole sentence." },
      { ko: "분류를 하려면 '이 문장 = 벡터 하나'가 있어야 하기 때문입니다.", en: "To classify anything, you need \"this sentence = one vector.\"" },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "그 자리가 <strong>[CLS]</strong>입니다.", en: "That slot is <strong>[CLS]</strong>." },
      { ko: "문장 맨 앞에 붙이는 특수 토큰이고, 인코더를 통과한 뒤 그 <strong>최종 은닉 상태를 문장 대표 벡터</strong>로 씁니다.", en: "It's a special token prepended to the sentence, and after the encoder its <strong>final hidden state serves as the sentence's representative vector</strong>." },
      { ko: "[CLS]도 양방향이라 문장 전체를 다 보고 나온 요약입니다.", en: "[CLS] is bidirectional too, so it's a summary that has seen the entire sentence." },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "왜 하필 [CLS]일까요.", en: "Why [CLS] specifically?" },
      { ko: "[CLS]는 특정 단어가 아니라 늘 같은 자리에 있는 빈 슬롯입니다.", en: "[CLS] isn't a real word — it's an empty slot that always sits in the same place." },
      { ko: "그래서 특정 단어 뜻에 치우치지 않고, 문장 전체를 담는 그릇으로 학습됩니다.", en: "So it isn't biased toward any one word's meaning; it gets trained as a container for the whole sentence." },
      { ko: "문장이 둘이면 <strong>[SEP]</strong>로 세그먼트를 구분합니다.", en: "When there are two sentences, <strong>[SEP]</strong> marks the segment boundary." },
    ],
  },
  {
    type: "code",
    code:
      "[CLS]  the  cat  sat  on  the  mat  [SEP]\n" +
      "  │\n" +
      "  └─▶ 인코더 N층 통과\n" +
      "        └─▶ [CLS]의 최종 벡터 = 문장 대표\n" +
      "              └─▶ 태스크 헤드 → 긍정 / 부정 …",
  },

  { type: "hr" },

  { type: "h2", ko: "4. 파인튜닝 — 이해 과제에 갈아 끼운다", en: "4. Fine-tuning — swap it onto an understanding task" },
  {
    type: "p",
    s: [
      { ko: "사전학습이 끝난 인코더는 그 자체로 쓰지 않습니다.", en: "The pretrained encoder isn't used as-is." },
      { ko: "사전학습에 쓰던 <strong>MLM 예측 헤드는 떼고</strong>, 그 자리에 <strong>작은 태스크 헤드를 갈아 끼워</strong> 전체를 미세조정합니다.", en: "You <strong>remove the MLM prediction head</strong> used in pretraining and <strong>swap in a small task head</strong>, then fine-tune the whole thing." },
      { ko: "사전학습은 빈칸으로 언어 일반을 배우는 단계, 파인튜닝은 그 표현을 다른 과제로 옮기는 단계입니다.", en: "Pretraining learns language in general via the blanks; fine-tuning carries that representation over to a different task." },
    ],
  },
  {
    type: "list",
    items: [
      { ko: "<strong>텍스트 분류</strong>: [CLS] 벡터 위에 분류기 한 층", en: "<strong>Text classification</strong>: one classifier layer on the [CLS] vector" },
      { ko: "<strong>개체명 인식(NER)</strong>: 토큰마다 라벨을 다는 헤드", en: "<strong>Named-entity recognition (NER)</strong>: a head that tags each token" },
      { ko: "<strong>추출형 QA</strong>: 지문에서 정답 구간의 시작·끝 위치를 고르는 헤드", en: "<strong>Extractive QA</strong>: a head that picks the start and end of the answer span in the passage" },
      { ko: "<strong>문장 임베딩·검색</strong>: 문장 벡터로 유사도 계산(더 나은 문장 임베딩은 Sentence-BERT)", en: "<strong>Sentence embeddings / retrieval</strong>: similarity from a sentence vector (Sentence-BERT gives better sentence embeddings)" },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "인코더는 입력을 <strong>한 번에 통째로</strong> 처리합니다.", en: "The encoder processes the input <strong>all at once</strong>." },
      { ko: "생성처럼 한 토큰씩 순차로 뽑지 않고 병렬로 읽어서, 분류 같은 이해 과제에서 처리량 이점이 있습니다.", en: "It reads in parallel rather than emitting one token at a time like generation, which gives a throughput advantage on understanding tasks such as classification." },
    ],
  },

  { type: "h2", ko: "5. 그런데 BERT는 왜 생성을 못 하나", en: "5. So why can't BERT generate?" },
  {
    type: "p",
    s: [
      { ko: "BERT는 생성을 하지 않습니다.", en: "BERT doesn't generate." },
      { ko: "'안 한다'가 아니라 구조상 '못 한다'에 가깝고, 이유는 둘입니다.", en: "It's less \"chooses not to\" than \"structurally can't,\" and there are two reasons." },
    ],
  },
  {
    type: "list",
    items: [
      { ko: "<strong>양방향이라 '아직 안 나온 오른쪽'이라는 개념이 없다.</strong> 생성은 오른쪽이 없는 상태에서 다음을 뽑아 붙이는 일인데, BERT는 오른쪽을 이미 다 보도록 만들어졌습니다.", en: "<strong>Being bidirectional, it has no notion of a \"right side that hasn't appeared yet.\"</strong> Generation appends the next token when nothing is on the right, but BERT is built to already see the whole right side." },
      { ko: "<strong>빈칸 15%만 맞히도록 배워서 순차 생성을 해본 적이 없다.</strong> MLM은 고른 자리만 예측할 뿐, '매 위치에서 다음 토큰'을 뽑는 능력을 기른 적이 없습니다.", en: "<strong>Trained to guess only the 15% of blanks, it has never done sequential generation.</strong> MLM only predicts the chosen positions; it never learns to emit \"the next token at every position.\"" },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "그래서 BERT는 읽고 이해할 뿐, 문장을 만들어내지 않습니다.", en: "So BERT reads and understands; it does not produce sentences." },
    ],
  },

  { type: "hr" },

  {
    type: "callout",
    tone: "tip",
    ko: "인코더로 쌓으면 양방향으로 읽는 BERT, 디코더로 쌓으면 왼쪽만 읽으며 다음 토큰을 뽑는 GPT입니다. 4편에서 바로 그 <strong>causal 마스크</strong> 쪽을 뜯어, 왼쪽만 보고 어떻게 문장을 생성하는지 봅니다.",
    en: "Stack encoders and you get BERT, reading bidirectionally; stack decoders and you get GPT, reading only leftward while emitting the next token. Part 4 takes apart that <strong>causal mask</strong> side — how reading only the left generates a sentence.",
  },
  {
    type: "p",
    s: [
      { ko: "[MASK]를 직접 씌우고 양방향 문맥으로 빈칸을 맞히는 과정, 그리고 GPT의 단방향과의 대비는 눈으로 보는 게 빠릅니다.", en: "Masking a token yourself and watching the blank get filled from both sides — and contrasting it with GPT's one direction — is faster to see than to read." },
      { ko: "<a href=\"/playground/bert/\">직접 만져보기 →</a>", en: "<a href=\"/playground/bert/\">Try it yourself →</a>" },
    ],
  },
  {
    type: "p",
    s: [
      { ko: "2편의 트랜스포머 블록이 헷갈리면 거기부터 보세요.", en: "If the transformer block from part 2 is fuzzy, start there." },
      { ko: "<a href=\"/blog/transformer-block/\">트랜스포머 블록 — 무엇을 붙여 LLM이 되나 →</a>", en: "<a href=\"/blog/transformer-block/\">The transformer block — what you bolt on to get an LLM →</a>" },
    ],
  },
  { type: "hr" },
  {
    type: "sources",
    html: "<h3>출처 / Sources</h3><ul><li>Devlin et al. (2018), \"BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding\" — <a href=\"https://arxiv.org/abs/1810.04805\">arxiv.org/abs/1810.04805</a> (인코더 온리, 깊은 양방향, MLM 15%→80/10/10, NSP, [CLS]/[SEP], base 12층 ~110M · large 24층 ~340M).</li><li>Liu et al. (2019), \"RoBERTa: A Robustly Optimized BERT Pretraining Approach\" — <a href=\"https://arxiv.org/abs/1907.11692\">arxiv.org/abs/1907.11692</a> (NSP 제거, 동적 마스킹, 더 많은 데이터).</li></ul>",
  },
];