---
title: "어텐션은 궁합 계산이다 — Q·K가 문맥을 찾는 법"
description: "트랜스포머 self-attention의 핵심을 한 줄로: 어텐션은 Query와 Key의 궁합 점수다. Q·K 내적 → softmax(τ) → 가중합으로 이어지는 계산 흐름을 it→cat 예문과 인터랙티브로 설명합니다."
pubDate: 2026-07-16
lang: ko
translationKey: attention-why
tags: ["트랜스포머", "어텐션", "self-attention", "Query-Key-Value", "딥러닝"]
---

<strong>어텐션은 궁합 계산입니다.</strong> 단어마다 "내가 찾는 것"(Query)과 "내가 내놓는 것"(Key)을 만들고, 둘의 방향이 맞으면 그 단어의 의미(Value)를 끌어옵니다. "The cat didn't eat because <strong>it</strong> was full"에서 it이 cat을 가리키는 이유가 바로 이 궁합 점수에서 나옵니다.

우리는 이 문장을 문법책 없이 문맥으로 풉니다. 모델도 똑같이 합니다. 다만 "문맥"이 벡터 내적으로 바뀔 뿐입니다.

검색 엔진을 떠올리면 쉽습니다. 검색창에 친 말이 <strong>Query</strong>, 문서 제목이 <strong>Key</strong>, 문서 본문이 <strong>Value</strong>입니다. 제목이 검색어와 맞는 문서일수록 위로 올라오고, 우리는 그 문서의 본문을 읽습니다. 어텐션도 이 구조 그대로입니다.

> 📌 어텐션은 세 단계가 전부입니다. 점수(내적)로 "누가 얼마나 맞는가", softmax로 "그걸 합 1의 비율로", 가중합으로 "그 비율만큼 의미를 섞기". 나머지는 이 한 줄을 안정적으로 굴리는 장치입니다.

> 💡 눈으로 보면서 읽으면 훨씬 빠릅니다. Q·K로 점수가 나오는 장면부터 열어보세요 — [직접 만져보기 →](/playground/transformer/#scene-2)

## 1. 단어마다 Q·K·V 세 벡터가 생긴다

토큰 임베딩 하나에 학습된 투영 행렬 세 개를 곱해 세 벡터로 갈라집니다.

- <strong>Query</strong>: 내가 지금 찾는 것 (it의 Q = "내가 가리키는 명사는?")
- <strong>Key</strong>: 남에게 내놓는 검색용 간판 (cat의 K = "나는 배부를 수 있는 단수 동물")
- <strong>Value</strong>: 실제로 넘겨줄 의미 (cat의 V = cat이라는 뜻 덩어리)

Q와 K는 "누구를 볼지" 고르는 데 쓰고, V는 "실제로 흡수할 내용"입니다. 역할이 분리돼 있다는 게 핵심입니다.

같은 단어라도 문장에서 역할이 다르면 다른 벡터가 됩니다. 세 행렬은 규칙으로 짜 넣은 게 아니라 학습으로 정해집니다.

## 2. 점수 = Qi·Kj, 방향이 비슷할수록 크다

it이 각 단어를 볼 점수는 두 벡터의 <strong>내적</strong>입니다.

```
score(i, j) = Qᵢ · Kⱼ
```

내적은 방향이 얼마나 겹치는지 재는 자입니다. 각도가 좁을수록 값이 큽니다. it의 Query와 cat의 Key가 같은 쪽을 가리키면 점수가 높고, because나 was와는 어긋나 낮습니다. "궁합 점수"라는 말이 여기서 나옵니다.

## 3. softmax로 합이 1인 가중치를 만든다

점수는 그냥 실수라 크기가 제각각입니다. <strong>softmax</strong>로 전부 0~1 사이, 합이 1인 <strong>attention weight</strong>로 바꿉니다.

```
wᵢⱼ = softmax(scoreᵢ / τ)ⱼ
```

그래서 it이 여러 단어에 나눠 주목하되 총량은 100%로 고정됩니다. 여기서 <strong>τ(temperature)</strong>가 분포의 뾰족함을 정합니다. τ가 작으면 1등 단어 하나로 확 쏠리고, 크면 여러 단어에 평평하게 퍼집니다. 한 곳만 볼지, 두루 볼지의 다이얼입니다.

> 💡 인터랙티브에서 <strong>τ 슬라이더</strong>를 0.3까지 내려 보세요. it의 가중치가 cat 하나로 뾰족하게 쏠리는 게 보입니다. [τ 밀어보기 →](/playground/transformer/#scene-3)

## 4. 새 표현 = 가중합, 의미를 흡수한다

마지막은 간단합니다. 가중치대로 Value를 섞습니다.

```
it′ = Σⱼ wᵢⱼ · Vⱼ
```

it이 cat에 80% 쏠렸다면, it의 새 표현은 cat의 Value로 80% 물듭니다. <strong>대명사가 가리키는 대상의 "색"을 흡수하는 순간</strong>입니다. self-attention이 "it은 cat"이라는 정보를 표현에 새겨 넣는 방식이 바로 이것입니다.

> 💡 it′ 알약이 cat의 색으로 물드는 걸 보세요 — [흡수 장면 열기 →](/playground/transformer/#scene-4)

## 5. 왜 학습이 이런 Q·K를 만드나

투영 행렬은 처음엔 랜덤입니다. 그런데 "it 다음을 잘 풀려면 cat을 봐야 한다"는 신호가 역전파로 흘러갑니다.

그 결과 <strong>it의 Query와 cat의 Key가 같은 방향으로 정렬</strong>됩니다. 궁합이 맞아야 손실이 줄기 때문입니다. Q·K는 규칙으로 짜 넣은 게 아니라, 손실을 줄이다 얻은 정렬입니다.

## 6. 멀티헤드 = 궁합을 여러 벌 동시에

이 궁합 계산을 한 벌만 돌리지 않습니다. <strong>멀티헤드</strong>는 Q·K·V 투영을 여러 세트 두고 병렬로 돌립니다.

헤드마다 다른 관계를 맡습니다. 어떤 헤드는 공참조(it→cat), 어떤 헤드는 바로 앞 단어, 어떤 헤드는 문장의 주어를 봅니다. 관계마다 담당을 나눠 갖는 셈입니다.

self-attention은 결국 이겁니다. 시퀀스 어디에 있든 관련 문맥을 <strong>학습된 궁합으로 가중해 모으는 일</strong>.

> 💡 헤드를 켜고 끄며 관계마다 선이 어떻게 달라지는지 비교해 보세요 — [멀티헤드 보기 →](/playground/transformer/#scene-5)

## 직접 만져보기

말로 다섯 번 읽는 것보다 한 번 만지는 게 빠릅니다. [직접 만져보기 →](/playground/transformer/)

- 왼쪽 <strong>it</strong>에 마우스를 올리면 <strong>cat</strong>으로 굵은 선이 갑니다. 궁합이 만든 attention입니다.
- <strong>① 점수 Q·Kᵀ</strong>에서 cat 막대가 왜 제일 긴지 확인하세요.
- <strong>② softmax의 τ 슬라이더</strong>를 좌우로 밀면 분포가 뾰족해지고 평평해집니다.
- <strong>③ 가중합 Σ wᵢ·Vᵢ</strong>에서 it′ 알약이 cat의 색으로 물듭니다.
- 상단 헤드 버튼을 켜고 끄면 헤드마다 어떤 선을 그리는지 비교됩니다.

이 세 장면이 어텐션의 "왜" 전부입니다.

> ⚠️ 인터랙티브의 숫자는 실제 학습된 모델 가중치가 아니라, it→cat 같은 관계를 보여주려고 손으로 배치한 시연용 값입니다. 숫자 자체는 예시지만, Q·K → softmax(τ) → 가중합으로 흐르는 <strong>구조는 실제 트랜스포머와 동일</strong>합니다.
