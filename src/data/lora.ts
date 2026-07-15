import type { BiBlock } from "./aiParadox";

export const blocks: BiBlock[] = [
  {
    type: "p",
    s: [
      {
        ko: "최근 LLM의 파라미터 효율적 파인튜닝(PEFT)이 중요한 화두로 떠오르면서, 다양한 기법 중 LoRA(Low-Rank Adaptation)에 대해 깊이 살펴볼 기회가 있었습니다.",
        en: "Parameter-efficient fine-tuning (PEFT) has become a big deal for LLMs, and recently I got the chance to dig into LoRA (Low-Rank Adaptation) in particular.",
      },
      {
        ko: "LoRA는 파인튜닝의 높은 비용 문제를 해결하는 매우 실용적이면서도 독창적인 접근법을 제시합니다.",
        en: "LoRA takes a genuinely clever, practical swing at the cost problem of fine-tuning.",
      },
    ],
  },
  {
    type: "p",
    s: [
      {
        ko: "이 글에서는 LoRA의 핵심 아이디어부터 동작 원리, 그리고 실용적인 장단점까지 제가 이해한 내용을 바탕으로 정리해보고자 합니다.",
        en: "Here's my write-up of how I understand it — from the core idea, to how it works, to where it helps and where it doesn't.",
      },
    ],
  },
  {
    type: "h2",
    ko: "1. 문제의 시작: 전체 파인튜닝(Full Fine-tuning)의 비용",
    en: "1. Where it starts: the cost of full fine-tuning",
  },
  {
    type: "p",
    s: [
      {
        ko: "LLM을 특정 도메인이나 과제에 맞게 파인튜닝하는 가장 직관적인 방법은 '전체 파인튜닝'입니다. 이는 사전 학습된 모델(Pre-trained Model)의 모든 가중치(<code>W</code>)를 새로운 데이터에 맞게 업데이트하여, <code>W' = W + ΔW</code> 라는 새로운 모델을 만드는 과정입니다.",
        en: "The most obvious way to adapt an LLM to a domain or task is <em>full fine-tuning</em>: you take a pre-trained model, update all of its weights (<code>W</code>) on your new data, and end up with <code>W' = W + ΔW</code>.",
      },
    ],
  },
  {
    type: "p",
    s: [
      {
        ko: "하지만 이 방식은 수천억 개에 달하는 파라미터 전체를 학습시켜야 하므로 막대한 GPU 메모리와 시간을 요구합니다.",
        en: "The problem is that you're training every single one of those hundreds of billions of parameters — which eats enormous GPU memory and time.",
      },
      {
        ko: "또한, 새로운 과제 하나마다 원본에 버금가는 크기의 모델 전체를 새로 저장해야 하는 명백한 비효율이 발생합니다.",
        en: "And for every new task, you have to store a full copy of the model, roughly as big as the original. That's a lot of waste.",
      },
    ],
  },
  {
    type: "h2",
    ko: "2. LoRA의 핵심 가설: \"변화량(ΔW)은 Low-Rank 특성을 띤다\"",
    en: "2. The core hypothesis: \"ΔW is low-rank\"",
  },
  {
    type: "p",
    s: [
      {
        ko: "LoRA의 저자들은 여기서 중요한 가설을 제시합니다.",
        en: "This is where the LoRA authors make their key bet.",
      },
    ],
  },
  {
    type: "quote",
    ko: "<strong>한국어 번역 및 해설:</strong> \"우리의 가설은, 모델을 (새로운 과제에) 적응시키는 동안 발생하는 가중치의 변화량은 낮은 <strong>'내재적 계급(intrinsic rank)'</strong>을 가질 것이라는 점이며, 이는 우리가 제안한 방법으로 이어짐.\"",
    en: "<strong><a href=\"https://arxiv.org/pdf/2106.09685\">From the paper (Abstract):</a></strong> \"We hypothesize that the change in weights during model adaptation has a low 'intrinsic rank', leading to our proposed method.\"",
  },
  {
    type: "p",
    s: [
      {
        ko: "여기서 'Rank가 낮다'는 것은, 행렬이 담고 있는 정보의 복잡도가 높지 않다는 의미입니다.",
        en: "In plain terms: the <em>change</em> in weights you need to adapt a model to a new task has a low <strong>intrinsic rank</strong>. \"Low rank\" means the matrix doesn't actually carry that much informational complexity.",
      },
      {
        ko: "즉, 거대한 <code>ΔW</code> 행렬이 실제로는 <strong>두 개의 훨씬 작고 차원이 낮은 행렬 <code>A</code>와 <code>B</code>의 곱(<code>ΔW ≈ B * A</code>)으로 근사될 수 있다</strong>는 것입니다.",
        en: "So the huge <code>ΔW</code> matrix can be <strong>approximated by the product of two much smaller, lower-dimensional matrices <code>A</code> and <code>B</code> (<code>ΔW ≈ B * A</code>)</strong>.",
      },
      {
        ko: "모델을 특정 과제에 맞게 조정하는 데 필요한 정보는, 생각보다 복잡하지 않으며 훨씬 단순한 형태로 압축될 수 있다는 아이디어입니다.",
        en: "The insight is that what a model needs in order to specialize for a task is less complex than it looks, and can be squeezed into a much simpler form.",
      },
    ],
  },
  {
    type: "h2",
    ko: "3. LoRA의 아키텍처: 두 개의 경로를 통한 학습",
    en: "3. The architecture: learning through two paths",
  },
  {
    type: "p",
    s: [
      {
        ko: "이 가설을 바탕으로, LoRA는 기존 가중치 <code>W</code>는 그대로 둔 채(frozen), <code>ΔW</code>를 모사하는 작은 행렬 <code>A</code>와 <code>B</code>만 학습시킵니다.",
        en: "Building on that hypothesis, LoRA keeps the original weights <code>W</code> frozen and only trains the small matrices <code>A</code> and <code>B</code> that mimic <code>ΔW</code>.",
      },
    ],
  },
  { type: "figure", src: "/assets/lora.png", alt: "LoRA 아키텍처 다이어그램" },
  {
    type: "p",
    s: [
      {
        ko: "위 그림처럼 LoRA의 학습은 두 개의 경로로 나뉩니다.",
        en: "As the diagram shows, a LoRA forward pass splits into two paths:",
      },
    ],
  },
  {
    type: "list",
    items: [
      {
        ko: "<strong>기존 경로</strong>: 입력 <code>x</code>가 원래의 거대한 <code>W</code>를 통과합니다. (<code>h = Wx</code>)",
        en: "<strong>The original path</strong>: input <code>x</code> goes through the big, frozen <code>W</code>. (<code>h = Wx</code>)",
      },
      {
        ko: "<strong>LoRA 경로</strong>: 동일한 입력 <code>x</code>가 저차원 행렬 <code>A</code>와 <code>B</code>를 차례로 통과합니다. (<code>Δh = BAx</code>)",
        en: "<strong>The LoRA path</strong>: the same input <code>x</code> goes through the low-rank matrices <code>A</code> and <code>B</code> in sequence. (<code>Δh = BAx</code>)",
      },
    ],
  },
  {
    type: "p",
    s: [
      {
        ko: "최종 출력은 이 두 경로의 결과를 합산한 <code>h + Δh</code>가 됩니다.",
        en: "The final output is the sum of both paths, <code>h + Δh</code>.",
      },
      {
        ko: "이는 <strong>원본 모델의 풍부한 표현력은 그대로 활용하면서, 새로운 과제에 필요한 최소한의 '보정값'만 효율적으로 학습하여 더해주는</strong> 구조입니다.",
        en: "So you <strong>keep all the rich expressiveness of the original model, and only learn the minimal \"correction\" the new task needs, then add it on top</strong>.",
      },
    ],
  },
  {
    type: "p",
    s: [
      {
        ko: "이러한 설계 덕분에 학습 대상 파라미터가 극적으로 줄어듭니다.",
        en: "Because of this design, the number of trainable parameters drops dramatically.",
      },
      {
        ko: "예를 들어 4096x4096 행렬(약 1,677만 파라미터)을 튜닝할 때, LoRA(rank=8)를 적용하면 <code>(4096*8) + (8*4096)</code>인 약 6만 5천 개의 파라미터만 학습하면 되므로, <strong>99% 이상의 파라미터 절감 효과</strong>를 얻을 수 있습니다.",
        en: "Say you're tuning a 4096×4096 matrix (~16.77M parameters). With LoRA at rank 8, you only train <code>(4096*8) + (8*4096)</code> ≈ 65K parameters — a <strong>99%+ reduction</strong>.",
      },
    ],
  },
  {
    type: "h2",
    ko: "4. 직관적인 이해: 포토샵 플러그인 비유",
    en: "4. An intuitive analogy: Photoshop plugins",
  },
  {
    type: "p",
    s: [
      {
        ko: "이 과정을 '포토샵'에 비유하면 더 쉽게 이해할 수 있습니다.",
        en: "This gets easier if you think of it in terms of Photoshop.",
      },
    ],
  },
  {
    type: "list",
    items: [
      {
        ko: "<strong>Pre-trained Model → 포토샵 원본 프로그램</strong>: <code>klue/bert-base</code>와 같은 거대 언어 모델은, 수많은 기능이 담긴 포토샵 프로그램과 같습니다. 그 자체로 이미지 처리(언어 이해)에 대한 엄청난 잠재력을 갖추고 있습니다.",
        en: "<strong>Pre-trained model → the Photoshop application itself</strong>: A large language model like <code>klue/bert-base</code> is like Photoshop: packed with capability, and hugely powerful for image processing (language understanding) out of the box.",
      },
      {
        ko: "<strong>Full Fine-tuning → 포토샵 전체 재설치</strong>: '인물 사진 보정' 기능을 추가하기 위해, 포토샵의 전체 소스 코드를 수정하고 수십 GB짜리 프로그램을 통째로 다시 설치하는 것과 같습니다. 매우 비효율적이고 저장 공간도 두 배로 차지합니다.",
        en: "<strong>Full fine-tuning → reinstalling all of Photoshop</strong>: To add a \"portrait retouching\" feature, you rewrite Photoshop's entire source and reinstall the whole tens-of-GB program. Wildly inefficient, and it doubles your storage.",
      },
      {
        ko: "<strong>LoRA → 포토샵 플러그인(Plugin)</strong>: 포토샵 원본은 전혀 건드리지 않고, '인물 사진 보정' 기능만 담은 몇 MB짜리 가벼운 플러그인(LoRA 어댑터)을 만듭니다. 사용자는 필요할 때마다 이 플러그인을 활성화하여 사용하고, 다른 기능이 필요하면 다른 플러그인으로 갈아 끼울 수 있습니다.",
        en: "<strong>LoRA → a Photoshop plugin</strong>: You leave the original Photoshop completely untouched and build a lightweight few-MB plugin (the LoRA adapter) that just does \"portrait retouching.\" You enable it when you need it, and swap in a different plugin when you need something else.",
      },
    ],
  },
  {
    type: "h2",
    ko: "5. 실용적 관점에서의 LoRA 장점과 단점",
    en: "5. LoRA's pros and cons, practically speaking",
  },
  {
    type: "p",
    s: [
      {
        ko: "<strong>장점:</strong>",
        en: "<strong>Pros:</strong>",
      },
    ],
  },
  {
    type: "list",
    items: [
      {
        ko: "<strong>효율적인 학습</strong>: 적은 GPU 메모리와 시간으로 파인튜닝이 가능합니다.",
        en: "<strong>Efficient training</strong>: fine-tune with far less GPU memory and time.",
      },
      {
        ko: "<strong>효율적인 저장</strong>: 과제별로 몇 MB 크기의 LoRA 어댑터만 저장하면 되므로 관리가 용이합니다.",
        en: "<strong>Efficient storage</strong>: you only save a few-MB LoRA adapter per task, which is easy to manage.",
      },
      {
        ko: "<strong>빠른 과제 전환</strong>: 기본 모델 하나를 공유하며 필요에 따라 LoRA 어댑터만 교체(plug-and-play)할 수 있습니다.",
        en: "<strong>Fast task switching</strong>: share one base model and swap LoRA adapters as needed — plug and play.",
      },
      {
        ko: "<strong>추론 지연 없음</strong>: 학습 후 어댑터를 원본 가중치에 병합(<code>W' = W + BA</code>)하면, 추론 시에는 추가 계산이 전혀 없어 성능 저하가 없습니다.",
        en: "<strong>No inference latency</strong>: after training, merge the adapter back into the original weights (<code>W' = W + BA</code>), and inference has zero extra computation, so no performance hit.",
      },
    ],
  },
  {
    type: "p",
    s: [
      {
        ko: "<strong>단점 및 고려사항:</strong>",
        en: "<strong>Cons and caveats:</strong>",
      },
    ],
  },
  {
    type: "list",
    items: [
      {
        ko: "<strong>성능의 한계</strong>: 만약 과제가 매우 복잡하여 가중치의 'High-Rank' 변화가 필요한 경우, LoRA의 성능이 전체 파인튜닝에 비해 다소 낮을 수 있습니다.",
        en: "<strong>A performance ceiling</strong>: if a task is complex enough that it genuinely needs \"high-rank\" weight changes, LoRA can fall a bit short of full fine-tuning.",
      },
      {
        ko: "<strong>하이퍼파라미터</strong>: 최적의 성능을 위해 <code>r</code> (rank), <code>lora_alpha</code> 등 추가적인 하이퍼파라미터 튜닝이 필요합니다.",
        en: "<strong>Hyperparameters</strong>: to get the best results, you have to tune extra knobs like <code>r</code> (rank) and <code>lora_alpha</code>.",
      },
    ],
  },
  {
    type: "callout",
    tone: "tldr",
    ko: "결론적으로 LoRA의 단점은 \"사용하면 안 되는 이유\"라기보다는, \"LoRA를 더 잘 사용하기 위해 이해하고 조절해야 할 부분\"에 가깝습니다.",
    en: "So LoRA's downsides aren't really \"reasons not to use it\" — they're more \"things to understand and adjust so you can use it well.\"",
  },
  {
    type: "h2",
    ko: "6. 다른 PEFT 기법들과의 비교",
    en: "6. How it compares to other PEFT methods",
  },
  {
    type: "p",
    s: [
      {
        ko: "LoRA 외에도 다양한 PEFT 기법들이 존재하며, 각기 다른 철학을 가집니다.",
        en: "LoRA isn't the only PEFT method, and each has its own philosophy.",
      },
    ],
  },
  {
    type: "list",
    items: [
      {
        ko: "<strong>어댑터(Adapter)</strong>: 모델 레이어 '사이'에 새로운 신경망 모듈을 '직렬'로 삽입하여 학습합니다. LoRA의 병렬 구조와 달리 추론 시 약간의 지연이 발생할 수 있습니다.",
        en: "<strong>Adapters</strong>: insert new neural modules <em>in series</em> between model layers and train those. Unlike LoRA's parallel structure, this can add a little inference latency.",
      },
      {
        ko: "<strong>프롬프트 튜닝(Prompt Tuning)</strong>: 모델 가중치는 전혀 수정하지 않고, 입력 프롬프트의 일부를 구성하는 '가상 토큰' 벡터만 학습합니다.",
        en: "<strong>Prompt Tuning</strong>: leaves the model weights entirely untouched and only learns \"virtual token\" vectors that become part of the input prompt.",
      },
      {
        ko: "<strong>(IA)³</strong>: 가중치가 아닌, 모델 내부의 활성화(Activation) 값을 조절하는 스케일링 팩터를 학습하여 정보의 흐름을 제어합니다.",
        en: "<strong>(IA)³</strong>: instead of weights, it learns scaling factors that modulate the model's internal <em>activations</em>, controlling the flow of information.",
      },
    ],
  },
  {
    type: "quote",
    ko: "<strong>'학습 가능한 가상 토큰'이란?</strong> 모델의 진짜 입력은 단어가 아닌 '임베딩 벡터'라는 점에 착안한 아이디어입니다. 즉, 단어를 통해 고정된 벡터를 찾는 대신, 과제 수행에 가장 최적화된 <strong>벡터 자체를 직접 학습</strong>하는 것입니다. 이 벡터들은 어휘 사전에 없는 '가상'의 토큰에 해당하며, 모델의 다른 모든 가중치는 고정된 채 오직 이 '가상 토큰'의 벡터값만 학습 과정에서 업데이트됩니다. 모델에게 특정 과제를 푸는 방법을 알려주는 '마법의 주문'을 벡터 공간에서 직접 찾는 것과 같습니다.",
    en: "<strong>What's a \"learnable virtual token\"?</strong> The idea starts from the fact that a model's real input isn't words but <em>embedding vectors</em>. So instead of looking up a fixed vector via a word, you <strong>directly learn the vector that's most optimal for the task</strong>. These vectors correspond to \"virtual\" tokens that don't exist in the vocabulary; every other weight in the model stays frozen, and only these virtual-token vectors get updated during training. It's like searching directly in vector space for the \"magic incantation\" that tells the model how to solve a specific task.",
  },
  {
    type: "h2",
    ko: "맺음말",
    en: "Closing thoughts",
  },
  {
    type: "p",
    s: [
      {
        ko: "LoRA는 파인튜닝의 효율성과 실용성을 크게 높인 인상적인 기법입니다.",
        en: "LoRA is an impressive method that makes fine-tuning far more efficient and practical.",
      },
      {
        ko: "모든 시나리오에서 최고의 성능을 보장하는 만능 해결책은 아닐지라도, 대부분의 경우 자원의 제약을 극복하고 원하는 모델을 만들 수 있는 강력한 도구가 되어줍니다.",
        en: "It's not a silver bullet that guarantees the best performance in every scenario — but in most cases it's a powerful tool for working around resource constraints and still building the model you want.",
      },
    ],
  },
  {
    type: "p",
    s: [
      {
        ko: "물론 LoRA의 단점과 다른 PEFT 기법들의 존재도 명확히 인지하고, 해결하려는 과제의 특성에 맞는 최적의 방법을 선택하는 것이 중요할 것입니다.",
        en: "Of course, it's important to be clear-eyed about LoRA's limitations and about the other PEFT methods out there, and to pick the approach that fits the task at hand.",
      },
      {
        ko: "저 또한 다음 단계로는 LoRA의 여러 변형이나 다른 기법들과의 실제 성능을 비교 분석하는 작업을 진행해볼 계획입니다.",
        en: "As a next step, I'm planning to actually benchmark some of LoRA's variants and other techniques against each other.",
      },
    ],
  },
];
