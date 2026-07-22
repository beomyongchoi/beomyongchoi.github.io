import type { BiBlock } from "./aiParadox";

export const blocks: BiBlock[] = [
  {
    type: "p",
    s: [
      { ko: "<strong>어텐션은 순서를 모릅니다.</strong>", en: "<strong>Attention has no sense of order.</strong>" },
      { ko: "1편에서 어텐션이 Q·K 궁합으로 문맥을 모은다고 했습니다.", en: "In part 1 we saw attention gather context through the Q·K match." },
      { ko: "그 계산에는 빈틈이 하나 있습니다.", en: "That calculation has one gap in it." },
      { ko: "self-attention은 토큰의 위치를 뒤섞어도 각 토큰이 뽑아 오는 결과가 그대로 따라 움직일 뿐, 순서 자체는 셈에 들어가지 않습니다.", en: "Shuffle the token positions and each token's result just moves along with it — the order itself never enters the computation." }
    ]
  },
  {
    type: "p",
    s: [
      { ko: "그래서 어텐션 하나만으로는 언어 모델이 되지 않습니다.", en: "So attention alone doesn't make a language model." },
      { ko: "트랜스포머 블록은 이 빈틈을 하나씩 메우는 조립입니다.", en: "The transformer block is an assembly that closes these gaps one by one." },
      { ko: "이번 편은 각 장치가 <strong>어떤 문제를 푸는지</strong>를 봅니다.", en: "This part looks at <strong>which problem each piece solves</strong>." }
    ]
  },
  {
    type: "callout",
    tone: "tldr",
    ko: "트랜스포머 블록은 두 묶음입니다. [멀티헤드 어텐션 → 잔차 → 정규화] 다음 [FFN → 잔차 → 정규화]. 어텐션은 토큰들 사이 정보를 섞고, FFN은 토큰마다 따로 가공합니다. 잔차·정규화는 이 블록을 깊게 쌓아도 학습되게 붙잡는 장치입니다. 이 블록을 N층 쌓으면 트랜스포머입니다(GPT-3는 96층).",
    en: "A transformer block is two bundles: [multi-head attention → residual → normalization] then [FFN → residual → normalization]. Attention mixes information across tokens; the FFN processes each token on its own. Residuals and normalization are what keep the stack trainable when you go deep. Stack this block N times and you have a transformer (GPT-3 stacks it 96 times)."
  },
  {
    type: "p",
    s: [
      { ko: "1편의 <strong>멀티헤드 어텐션</strong>이 바로 이 블록의 첫 서브층입니다.", en: "The <strong>multi-head attention</strong> from part 1 is exactly this block's first sublayer." },
      { ko: "여러 세트의 Q·K·V를 병렬로 돌려 관계별로 담당을 나눈 그 계산 그대로입니다.", en: "It's the same calculation — several sets of Q·K·V run in parallel, dividing the relationships among specialists." },
      { ko: "여기서는 그 어텐션을 부품 하나로 놓고, 나머지를 어떻게 붙이는지 봅니다.", en: "Here we treat that attention as a single component and look at how the rest bolts on." }
    ]
  },
  {
    type: "h2",
    ko: "1. 위치 인코딩 — 순서 문제",
    en: "1. Positional encoding — the order problem"
  },
  {
    type: "p",
    s: [
      { ko: "self-attention은 <strong>순서에 무관(permutation-equivariant)</strong>합니다.", en: "Self-attention is <strong>order-agnostic (permutation-equivariant)</strong>." },
      { ko: "입력 토큰을 뒤섞으면 출력도 같은 순서로 따라 뒤섞일 뿐, 어느 자리에 있는지는 계산에 들어가지 않습니다.", en: "Shuffle the input tokens and the output just shuffles the same way — where a token sits never factors into the math." },
      { ko: "위치 정보를 따로 주지 않으면 \"the cat\"과 \"cat the\"가 모델에게 같은 입력입니다.", en: "Without injecting position separately, \"the cat\" and \"cat the\" are the same input to the model." }
    ]
  },
  {
    type: "p",
    s: [
      { ko: "그래서 순서 정보를 표현에 새깁니다.", en: "So we write order into the representation." },
      { ko: "원조 트랜스포머는 <strong>sinusoidal 위치 인코딩</strong>을 썼습니다.", en: "The original transformer used <strong>sinusoidal positional encoding</strong>." },
      { ko: "위치마다 다른 주기의 사인·코사인 값을 임베딩에 더해, 몇 번째 토큰인지를 표현에 담습니다.", en: "It adds sine and cosine values of different frequencies per position to the embedding, encoding which token is where." }
    ]
  },
  {
    type: "callout",
    tone: "warn",
    ko: "위치 인코딩은 블록 안이 아니라 블록 더미에 들어가기 <strong>전 입력 임베딩에 한 번</strong> 새깁니다. 96층을 지나며 96번 반복되는 부품이 아닙니다. (뒤에 나올 RoPE는 예외로, 매 층 Q·K에 위치 회전을 적용합니다.)",
    en: "Positional encoding is written <strong>once into the input embedding</strong>, before the token enters the stack — not a component that repeats 96 times through 96 layers. (RoPE, coming up, is the exception: it applies a positional rotation to Q·K at every layer.)"
  },
  {
    type: "p",
    s: [
      { ko: "현대 LLM은 대개 <strong>RoPE</strong>를 씁니다.", en: "Modern LLMs mostly use <strong>RoPE</strong>." },
      { ko: "임베딩에 더하는 대신 Q·K 벡터를 위치만큼 회전시킵니다.", en: "Instead of adding to the embedding, it rotates the Q and K vectors by an amount tied to their position." },
      { ko: "그러면 두 토큰의 어텐션 점수가 둘의 <strong>위치 차이</strong>에 따라 달라져, 상대 위치가 자연스럽게 반영됩니다.", en: "Then two tokens' attention score shifts with the <strong>difference</strong> in their positions, so relative position falls out naturally." },
      { ko: "LLaMA·PaLM이 이 방식입니다.", en: "LLaMA and PaLM take this route." }
    ]
  },
  {
    type: "h2",
    ko: "2. 잔차·정규화 — 깊이의 안정성 문제",
    en: "2. Residuals and normalization — the depth-stability problem"
  },
  {
    type: "p",
    s: [
      { ko: "블록 하나로는 부족해서 <strong>N층을 쌓습니다</strong>(GPT-3는 96층).", en: "One block isn't enough, so we <strong>stack N of them</strong> (96 in GPT-3)." },
      { ko: "그런데 깊게 쌓으면 그래디언트가 아래층까지 내려오는 동안 사라집니다.", en: "But go deep and the gradient fades on its way down to the lower layers." },
      { ko: "그러면 아래층이 학습되지 않습니다.", en: "Then those lower layers never learn." }
    ]
  },
  {
    type: "p",
    s: [
      { ko: "<strong>잔차 연결(residual)</strong>이 이걸 풉니다.", en: "The <strong>residual connection</strong> solves this." },
      { ko: "서브층이 표현을 통째로 다시 만들지 않고, 원본에 더할 <strong>변화량만 계산</strong>합니다.", en: "The sublayer doesn't rebuild the representation from scratch; it only computes the <strong>change to add</strong> to the original." }
    ]
  },
  {
    type: "code",
    code: "x ──┬────────────────────▶  지름길: 원본이 그대로 내려감\n    │\n    └──▶ 서브층 ──▶ 변화량       (x에 더할 몫만 계산)\n\n  합치면   y = x + 변화량        (잔차 덧셈)\n  (post-norm)  블록 출력 = 정규화(y)"
  },
  {
    type: "p",
    s: [
      { ko: "원본 x가 지름길로 그대로 흐르니, 그래디언트도 그 길을 타고 아래까지 도달합니다.", en: "The original x flows straight down the shortcut, and the gradient rides that same path all the way down." },
      { ko: "잔차 덧셈이 성립하려면 서브층의 입력과 출력 <strong>차원이 같아야 합니다</strong>(d_model 유지).", en: "For the addition to work, the sublayer's input and output <strong>must share the same dimension</strong> (d_model is preserved)." },
      { ko: "이 조건 덕분에 블록의 입출력 모양이 같고, 그래서 <strong>블록 위에 블록을 그대로 쌓을 수 있습니다</strong>.", en: "That constraint keeps a block's input and output the same shape, which is exactly what lets you <strong>stack block on block</strong>." }
    ]
  },
  {
    type: "p",
    s: [
      { ko: "<strong>정규화(normalization)</strong>는 서브층에 들어가는 값의 크기를 매 층 일정하게 맞춥니다.", en: "<strong>Normalization</strong> keeps the scale of the values entering each sublayer consistent from layer to layer." },
      { ko: "입력 크기가 층마다 튀면 다음 층이 매번 다른 크기에 적응해야 해서 학습이 흔들립니다.", en: "If that scale swings around, each layer has to keep re-adapting to a new magnitude, and training gets shaky." },
      { ko: "원조가 쓴 <strong>LayerNorm</strong>은 각 벡터에서 평균을 빼고 표준편차로 나눠 정규화한 뒤, 학습되는 스케일·시프트로 다시 조정합니다.", en: "The original's <strong>LayerNorm</strong> subtracts each vector's mean, divides by its standard deviation, then rescales and shifts with learned parameters." }
    ]
  },
  {
    type: "p",
    s: [
      { ko: "정규화를 서브층 <strong>뒤</strong>에 두면 post-norm, <strong>앞</strong>에 두면 pre-norm입니다.", en: "Put normalization <strong>after</strong> the sublayer and it's post-norm; <strong>before</strong> it, and it's pre-norm." },
      { ko: "원조는 post-norm이었습니다.", en: "The original was post-norm." },
      { ko: "그런데 깊은 모델에서는 pre-norm이 더 안정적이라, GPT-3·PaLM·LLaMA가 pre-norm으로 옮겼습니다.", en: "But pre-norm trains more stably at depth, so GPT-3, PaLM, and LLaMA moved to it." }
    ]
  },
  {
    type: "code",
    code: "post-norm :  y = 정규화(x + 서브층(x))       ← 잔차 경로에 정규화가 낌\npre-norm  :  y = x + 서브층(정규화(x))       ← 잔차 경로(x)가 깨끗함"
  },
  {
    type: "p",
    s: [
      { ko: "pre-norm의 핵심은 잔차 덧셈이 정규화 <strong>바깥</strong>에 있다는 점입니다.", en: "The point of pre-norm is that the residual addition sits <strong>outside</strong> the normalization." },
      { ko: "원본 x가 정규화를 거치지 않고 지름길로 흐르니, 그래디언트가 지나는 길이 더 깨끗합니다.", en: "The original x flows down the shortcut without passing through normalization, so the gradient's path stays cleaner." },
      { ko: "대신 pre-norm 스택은 마지막 블록 출력이 정규화되지 않은 채 나오므로, 스택 맨 끝에 <strong>final norm을 하나 더</strong> 둡니다.", en: "The catch: a pre-norm stack's last block emits an un-normalized output, so a <strong>final norm</strong> is added at the very end of the stack." }
    ]
  },
  {
    type: "p",
    s: [
      { ko: "정규화 방식도 <strong>LayerNorm에서 RMSNorm</strong>으로 바뀌었습니다.", en: "The normalization itself also shifted <strong>from LayerNorm to RMSNorm</strong>." },
      { ko: "RMSNorm은 LayerNorm에서 평균 빼는 단계를 생략하고 RMS로만 스케일을 맞추는 경량 버전입니다.", en: "RMSNorm is a lighter version that skips LayerNorm's mean-subtraction and rescales by RMS alone." },
      { ko: "Llama·Mistral·DeepSeek·Qwen이 이걸 씁니다.", en: "Llama, Mistral, DeepSeek, and Qwen use it." }
    ]
  },
  {
    type: "callout",
    tone: "tip",
    ko: "\"pre-norm이 정답\"은 아닙니다. 최근 OLMo2·Gemma3는 post-norm 변형을 다시 들여왔습니다. 구조 선택은 하나로 수렴하지 않았습니다.",
    en: "\"Pre-norm is the answer\" isn't the whole story. Recent OLMo2 and Gemma3 bring back post-norm variants. The design space hasn't converged on one choice."
  },
  {
    type: "h2",
    ko: "3. FFN — 토큰별 처리 문제",
    en: "3. FFN — the per-token processing problem"
  },
  {
    type: "p",
    s: [
      { ko: "어텐션은 <strong>토큰들 사이</strong>를 섞습니다.", en: "Attention mixes <strong>across tokens</strong>." },
      { ko: "누구를 볼지 고르는 일입니다.", en: "It's the job of choosing whom to look at." },
      { ko: "하지만 흡수한 정보를 <strong>각 토큰 안에서 가공하는</strong> 단계는 어텐션에 따로 없습니다.", en: "But attention has no separate step for <strong>processing that absorbed information inside each token</strong>." }
    ]
  },
  {
    type: "p",
    s: [
      { ko: "그 일을 <strong>position-wise FFN</strong>이 맡습니다.", en: "The <strong>position-wise FFN</strong> handles that." },
      { ko: "모든 토큰 위치에 <strong>똑같은 가중치의 MLP를 독립적으로</strong> 적용합니다.", en: "It applies <strong>one MLP with shared weights, independently</strong>, to every token position." },
      { ko: "옆 토큰은 보지 않습니다.", en: "It never looks at neighboring tokens." },
      { ko: "\"position-wise\"란 모든 위치가 같은 MLP를 쓰되 위치마다 따로 통과시킨다는 뜻입니다.", en: "\"Position-wise\" means every position runs through the same MLP, but each one passes through separately." }
    ]
  },
  {
    type: "p",
    s: [
      { ko: "원조 FFN은 <strong>ReLU를 쓰는 2층 MLP</strong>였습니다.", en: "The original FFN was a <strong>two-layer MLP with ReLU</strong>." },
      { ko: "히든 차원을 보통 입력의 4배로 넓혔다가, 다시 d_model로 되돌립니다.", en: "It widens the hidden dimension to typically 4× the input, then projects back down to d_model." },
      { ko: "되돌려야 잔차 덧셈이 성립하기 때문입니다.", en: "It has to come back down for the residual addition to work." }
    ]
  },
  {
    type: "p",
    s: [
      { ko: "역할 분담이 명확합니다.", en: "The division of labor is clear." },
      { ko: "<strong>어텐션은 토큰들 사이를 섞고, FFN은 토큰마다 따로 변환합니다.</strong>", en: "<strong>Attention mixes across tokens; the FFN transforms each token on its own.</strong>" },
      { ko: "이 둘을 번갈아 쌓은 게 트랜스포머입니다.", en: "Alternating the two, stacked, is the transformer." }
    ]
  },
  {
    type: "p",
    s: [
      { ko: "FFN도 현대 LLM에서 바뀌었습니다.", en: "The FFN changed in modern LLMs too." },
      { ko: "ReLU·GELU 같은 단순 활성함수 대신 <strong>SwiGLU</strong>가 2023년 이후 대부분의 LLM에서 표준입니다.", en: "In place of plain activations like ReLU or GELU, <strong>SwiGLU</strong> has been standard in most LLMs since 2023." },
      { ko: "SwiGLU는 활성함수만 바꾼 게 아니라, 한 갈래가 다른 갈래를 여닫는 <strong>게이팅 구조</strong>를 더한 것입니다.", en: "SwiGLU isn't just a swapped activation; it adds a <strong>gating structure</strong> where one branch opens and closes the other." }
    ]
  },
  {
    type: "h2",
    ko: "4. 조립하면 — 블록 하나의 전체 모습",
    en: "4. Assembled — the full shape of one block"
  },
  {
    type: "p",
    s: [
      { ko: "장치들이 각자 문제를 하나씩 풉니다.", en: "Each piece solves one problem." },
      { ko: "위치 인코딩은 순서를, 잔차·정규화는 깊이의 안정성을, FFN은 토큰별 처리를 담당합니다.", en: "Positional encoding covers order, residuals and normalization cover depth stability, the FFN covers per-token processing." },
      { ko: "여기에 1편의 멀티헤드 어텐션을 더하면 블록 하나가 완성됩니다.", en: "Add the multi-head attention from part 1 and a single block is complete." }
    ]
  },
  {
    type: "code",
    code: "입력 임베딩 + 위치 인코딩   (블록에 들어가기 전, 한 번만)\n│\n▼\n┌─────────────────────────────  블록 1개 (도식은 원조 post-norm 기준)\n│  x ──┬───────────────▶  지름길\n│      └─▶ 멀티헤드 어텐션 ──▶ 변화량 + x ──▶ 정규화 = h\n│\n│  h ──┬───────────────▶  지름길\n│      └─▶ FFN ───────────▶ 변화량 + h ──▶ 정규화 = 출력\n└─────────────────────────────\n│\n▼\n다음 블록의 입력    … × N층 반복 …  →  마지막에 final norm"
  },
  {
    type: "p",
    s: [
      { ko: "블록의 입력도 토큰 표현, 출력도 같은 모양의 토큰 표현입니다.", en: "A block's input is a token representation, and its output is a token representation of the same shape." },
      { ko: "한 층을 지날 때마다 표현이 조금씩 갱신됩니다.", en: "Every layer nudges the representation a little further." }
    ]
  },
  {
    type: "callout",
    tone: "tip",
    ko: "토큰이 블록을 통과하며 표현이 어떻게 갱신되는지는 눈으로 보는 게 빠릅니다. 블록을 한 층씩 쌓으며 같은 토큰의 표현이 바뀌는 걸 볼 수 있습니다 — <a href=\"/playground/transformer-block/\">직접 만져보기 →</a>",
    en: "It's faster to watch a token's representation update as it passes through a block. Stack the blocks one layer at a time and see the same token's representation shift — <a href=\"/playground/transformer-block/\">try it yourself →</a>"
  },
  {
    type: "h2",
    ko: "5. 왜 이 조립이 언어 모델을 만드나",
    en: "5. Why this assembly makes a language model"
  },
  {
    type: "p",
    s: [
      { ko: "블록 하나는 표현을 한 번 다듬는 데 그칩니다.", en: "A single block only refines the representation once." },
      { ko: "그런데 같은 블록을 수십 층 쌓으면, 층을 지날수록 표현이 점점 더 정제됩니다.", en: "Stack the same block dozens of layers deep, though, and the representation gets steadily more refined as it climbs." },
      { ko: "얕은 층은 표면적인 패턴을, 깊은 층은 더 추상적인 관계를 잡는다고 널리 알려져 있습니다.", en: "It's well established that shallow layers catch surface patterns while deep layers capture more abstract relationships." }
    ]
  },
  {
    type: "p",
    s: [
      { ko: "그래서 부품을 갈아 끼워도 블록의 뼈대는 같습니다.", en: "That's why the block's skeleton stays the same even as the parts get swapped." },
      { ko: "어텐션으로 섞고, FFN으로 다듬고, 잔차·정규화로 깊게 쌓는다.", en: "Mix with attention, refine with the FFN, stack deep with residuals and normalization." },
      { ko: "요약하면 이 세 가지가 트랜스포머 블록입니다.", en: "In short, those three things are the transformer block." }
    ]
  },
  {
    type: "p",
    s: [
      { ko: "1편의 어텐션이 헷갈리면 거기부터 보세요.", en: "If the attention itself is fuzzy, start there." },
      { ko: "<a href=\"/blog/attention-why/\">어텐션은 궁합 계산이다 →</a>", en: "<a href=\"/blog/attention-why/\">Attention is a compatibility calculation →</a>" }
    ]
  },
  {
    type: "hr"
  },
  {
    type: "sources",
    html: "<h3>출처 / Sources</h3><ul><li>Vaswani et al. (2017), \"Attention Is All You Need\" — <a href=\"https://arxiv.org/abs/1706.03762\">arxiv.org/abs/1706.03762</a> (post-norm, sinusoidal 위치 인코딩, ReLU 2층 FFN).</li><li>pre-norm · RMSNorm · RoPE · SwiGLU는 LLaMA 등 현대 LLM에서 표준으로 널리 문서화되어 있습니다. post-norm 변형을 다시 채택한 예로 OLMo2 · Gemma3가 있습니다.</li></ul>"
  }
];