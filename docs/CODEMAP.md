# 코드 맵

이 사이트가 어디에 무엇이 있는지, 새 글·실험실·게임을 추가할 때 어디를 건드리는지 정리한 지도.
글쓰기 규칙은 [blog-style.md](blog-style.md).

## 세 축

| 축 | 경로 | 하는 일 |
|---|---|---|
| 글 | `/blog/`, `/en/blog/` | 한/영 문장 단위로 정렬된 글. 문장을 클릭하면 반대 언어가 뜬다 |
| 실험실 | `/playground/` | 글마다 붙는 **실험**: 변수를 바꿔 재고 가설을 확인/반박. 가짜 데이터 말고 진짜 계산 |
| 오락실 | `/arcade/` | 글 개념을 규칙으로 삼은 **게임**(점수·승패, 창의적으로) + 브라우저 안 진짜 모델과 겨루는 게임 |

시리즈(`/series/`)가 글과 실험실을 순서대로 묶는다.

## 디렉터리

```
src/
  content/blog/<slug>.mdx, <slug>-en.mdx   글 껍데기(frontmatter + 컴포넌트 3개). 스키마: src/content.config.ts
  data/<camelCase>.ts                      글 본문. BiBlock[] (h2, p{s:[{ko,en}]}, list, callout, code, sources …)
  data/series.ts                           시리즈 정의. parts[].published=false면 '곧'으로 표시
  components/
    BilingualArticle.astro                 본문 렌더 + 언어 토글 + 문장 팝오버 + (1) ──── 목차
    BlogPost.astro (layouts/)              글 헤더: "N. 메인 — 부제" 제목을 편 번호 / 휘어진 메인 / 부제로 나눔
    ArcTitle.astro                         휘어진 타이틀(SVG textPath, 글자 수에 맞춰 크기 자동)
    SeriesNav / SeriesNext                 글 위·아래 시리즈 내비
    Header / Footer / BaseHead / EasterEgg 공통 (EasterEgg = 코나미 코드 게임, 지우지 말 것)
  pages/
    blog/[...slug].astro, en/blog/...      글 라우팅
    playground/<toy>.astro, index.astro    실험실. index.astro의 groups 배열과 FN(썸네일 canvas 함수)에 반드시 같이 등록
    arcade/<game>.astro, index.astro       오락실
    series.astro, en/series.astro          ORDER 배열에 시리즈 id를 넣어야 노출
public/
  lab/                                     실험실·게임이 import하는 공용 ESM (<script type="module" is:inline>)
  arcade/                                  게임 데이터(next-word-pool.json)
  assets/                                  글 이미지(차트 PNG)
scripts/
  *.check.mjs                              공용 모듈 검사(아래 표)
  build-rag-index.mjs                      RAG 검색 인덱스 생성
  blog-figures/                            터미널 스타일 차트 HTML → PNG
  resume-pdf/                              이력서 PDF
.github/workflows/deploy.yml               main에 push하면 GitHub Pages로 배포 (Node 22)
```

## public/lab 공용 모듈

| 모듈 | 내용 | 쓰는 곳 | 검사 |
|---|---|---|---|
| `lm.js` | transformers.js 4.3.0으로 브라우저 LLM 로드. `LMS`에서 모델 선택(기본 SmolLM2-135M, 선택 Qwen3-0.6B). WebGPU q4f16, 없으면 WASM q8 | gpt, sampling, arcade/next-word | — |
| `sampling.js` | top-k → top-p → min-p 자르기, 샘플, 엔트로피 | sampling, gpt, next-word | `lab-sampling.check.mjs` |
| `autograd.js` | 약 50줄 스칼라 자동미분(+, ×, ², ReLU, tanh) | backprop, mlp.js | `lab-autograd.check.mjs` |
| `mlp.js` | 시드 고정 고리 데이터 + MLP + 미니배치 | train | (autograd 검사로 간접) |
| `rag.js` | BM25(한글 2글자 bigram), 코사인, RRF | rag | `lab-rag.check.mjs` |
| `rag-index.json` | 글을 소제목 단위로 자른 조각 + e5 임베딩 | rag | `build-rag-index.mjs`로 생성 |
| `arch.js` | 공개 모델 config.json 값 + 파라미터·KV 캐시 계산 | arch | `lab-arch.check.mjs` (공식 발표치와 비교) |
| `nextword.js` | 다음 단어 게임: 오답 보기 고르기, 모델 선택 | arcade/next-word | `lab-nextword.check.mjs`, `arcade-pool.check.mjs` |
| `moe.js` | MoE 라우터 시뮬(쏠림 + 보조 손실 없는 편향 균형) | moe | `lab-moe.check.mjs` |
| `rope.js` | RoPE 회전·사인파 더하기 점수, 바늘 파장, 학습 길이 내 못 돈 바늘 수, Llama 3.1 스케일링·위치 보간 (모델 설정 = 실제 config) | rope | `lab-rope.check.mjs` |
| `depth.js` | 무작위 층 쌓기: 정규화 없음·Post-LN·Pre-LN × LayerNorm·RMSNorm, 신호 크기·남은 입력(코사인)·역전파(유한차분 검증), SwiGLU FFN 파라미터 | depth | `lab-depth.check.mjs` |
| `safe.js` | 오락실 바늘 금고: RoPE식 바늘 주기(2π·6^i), 단계, 맞물림(=RoPE 상대 점수) | arcade/safe | `lab-safe.check.mjs` |
| `decide.js` | 디시전 모델 상대: Qwen3 디시전 모드(선택지 단어 로짓), Laya(커뮤니티 ONNX, onnxruntime-web). 버릇 보정·차단 | arcade 듀얼 | — |
| `crossy.js`, `galaga.js` | 듀얼 게임 규칙(시드 고정 순수 함수) + 모델용 날것/하네스 글 + `allowed` 차단 + `draw(…, f)` 틱 사이 보간. 선택: `TICK`(ms, 기본 250), `human(s, held)`(누른 키로 조작, 없으면 입력 큐) | arcade/crossy, galaga (`DuelArena.astro`) | `lab-crossy.check.mjs`, `lab-galaga.check.mjs` |

검사 전부 돌리기:

```sh
for f in scripts/*.check.mjs; do node "$f" || break; done
```

## 할 일별 체크리스트

**새 글**
1. `src/data/<name>.ts`에 blocks 작성 (규칙: docs/blog-style.md)
2. `src/content/blog/<slug>.mdx`와 `<slug>-en.mdx` (같은 `translationKey`, en은 `lang="en"`)
3. `pubDate`는 KST 오전 시각으로 (`T10:00:00`). 오후 늦게 쓰면 UTC로 넘어가 날짜가 하루 밀림
4. 시리즈 글이면 `src/data/series.ts`에서 `published: true`
5. **`node scripts/build-rag-index.mjs`** — 안 돌리면 /playground/rag/가 옛 글을 검색함
6. 글에 쓴 수치는 실험실이나 Node로 실측한 것만. 출처는 1차 자료로 확인

**새 실험실**
1. `src/pages/playground/<toy>.astro` (계산 로직은 `public/lab/*.js`에 순수 함수로 + `scripts/*.check.mjs`)
2. `playground/index.astro`의 `groups`에 카드 추가 **그리고** 썸네일 함수 + `FN` 등록. 빠지면 목록 페이지 JS가 깨짐

**새 게임**: `src/pages/arcade/<game>.astro` + `arcade/index.astro`의 `games` 배열. 사람 vs 모델 1:1이면 `public/lab/<game>.js`에 `DuelArena`가 쓰는 인터페이스(newGame·step·rawText·harnessText·allowed·draw·…)만 맞추면 됨

## 지켜야 할 것

- 모델 로딩은 버튼을 눌러야 시작(자동 다운로드 금지). 용량을 버튼에 표시
- 큰 배열에 `Math.max(...arr)` 금지(어휘 15만 개면 스택이 넘친다). 반복문 사용
- `rag-retrieval` 글은 인덱스에서 제외(평가 질문을 인용하고 있어서). 인덱스는 조각을 1개씩 임베딩(묶으면 값이 흔들림)
- main 직접 커밋은 훅이 막는다. 작업 브랜치 → PR
- dev 서버는 `public/` 파일이 바뀌면 페이지를 새로 고친다. 브라우저에서 모델 평가를 돌리는 중엔 파일 수정 금지. 모델은 하나씩 올릴 것(둘 동시 + 연속 추론은 맥이 버거움)
- 글 수치의 기준 모델은 SmolLM2-135M. 기본값을 바꾸면 기존 글 숫자와 어긋난다
