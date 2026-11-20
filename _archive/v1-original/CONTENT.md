# 포트폴리오 v1 콘텐츠 원본

리뉴얼 전 사이트(v1)의 모든 텍스트·링크·이미지 경로를 섹션별로 정리한 문서입니다.
새 디자인에도 같은 내용을 쓰므로 여기를 기준으로 옮기면 됩니다.

- 원본 코드: 이 폴더(`_archive/v1-original/`), git 태그 `v1-original`, 브랜치 `archive/v1-original`
- 텍스트 출처: `index.html`, `script.js`(프로젝트·클론코딩·챗봇), `tools.js`(스킬 카드)
- 이미지 경로는 루트 `assets/` 기준 (원본 복사본은 이 폴더의 `assets/`)

---

## 0. 기본 정보 / 메타

| 항목 | 내용 |
|---|---|
| 페이지 타이틀 | Porfolio - Choi Haesoo *(원본 오타 그대로: Porfolio)* |
| 이름 | 최해수 / Haesoo / Choi Haesoo |
| 직무 | UX·UI Designer |
| 지역 | Yongin, Korea |
| 상태 | Open to work |
| 전화 | 010 4212 4970 (`tel:+821042124970`) |
| 이메일 | chs041015@gmail.com |
| 폰트 | Poppins(300–900), Pretendard v1.3.9 |
| 라이브러리 | GSAP, ScrollTrigger, Three.js (`assets/vendor/`) |

### 내비게이션
- 로고/섹션 타이틀: Haesoo (스크롤에 따라 About Me / Works / Tools / History / Contact로 바뀜)
- 메뉴: About · Works · Timeline · Contact
- 좌상단 버튼: **Sayout** (눈 모양 아이콘) → Sayout 케이스 스터디 모달
- 토스트(미사용 상태 문구): 곧 만나요! 준비 중이에요
- 커서 힌트: Hover to translate !

### 섹션별 우측 캡션 (data-section-index / caption)
| 섹션 | 인덱스 | 캡션 |
|---|---|---|
| Hero | 2026 | PERSONAL PORTFOLIO |
| About | 01 / ABOUT ME | HELLO, WANNA KNOW MORE ABOUT ME? |
| Approach | 02 / MY APPROACH | THIS IS HOW MY BRAIN CONNECTS THE DOTS. |
| Works | SELECTED WORKS | IDEAS ARE NICE. BUILT ONES ARE BETTER. |
| Clone coding | WEB STUDIES | I TOOK IT APART, THEN BUILT IT BACK. *(숨김 처리)* |
| Skills | 05 / SKILLS | YES, I KNOW MY WAY AROUND THESE TOOLS. |

---

## 1. Hero
- 타이틀: **DESIGNER / WHO CODES**
- 장식: `assets/hero/accent-bolt.webp`, `assets/hero/accent-star.webp`, 구분선 `assets/figma/hero-divider.svg`
- 플립 카드 사진: `assets/about/portrait.webp`

## 2. About — Hello!
- 섹션 코드 타이틀: ABOUT ME
- 제목: **Hello!**
- 사이드 노트: I TRANSLATE USER EXPERIENCES / INTO DESIGN AND DECODE THEM / WITH CODE.
- 이름: **최해수**
- 소개: **사용자 경험**을 디자인으로 해석하고, / 코드로 해독하는 **디자이너** (굵게 = 하이라이트)
- 상세: 💼 UX·UI Designer · 📍 Yongin, Korea · 🟢 Open to work
- 버튼: View Project → #project1
- 아이콘: `assets/about/briefcase.svg`, `map-pin.svg`, `status-dot.svg`, `trending-up.svg`

## 3. My Approach (영/한 번역 리빌 문장)
호버하면 영어 ↔ 한국어로 바뀌는 4줄. 각 줄 사이에 장식 이미지(`assets/reveal/`).

| # | English | 한국어 | 장식 |
|---|---|---|---|
| 1 | I understand what users *(loop)* feel and turn it into *(cross)* clear ideas. | 저는 사용자를 감각으로 읽어내고, *(loop)* 그 감각을 논리로 *(cross)* 구현합니다. | accent-loop, accent-cross |
| 2 | I shape those ideas through *(star)* design and bring them to life with code. | 디자인으로 해석하고, 코드로 *(star)* 해독하는 디자이너, | accent-star |
| 3 | I create real tools from things that once *(bolt)* lived only in imagination. | 상상만 하던 것을 실제로 만질 수 있는 도구로 *(bolt)* 만들고자 합니다. | accent-bolt |
| 4 | My goal is to understand people and systems with *(equals)* equal depth. | 사람과 시스템을 *(equals)* 똑같이 깊이 이해하는 것이 제 목표입니다. | accent-equals |

## 4. Selected Works (메인 프로젝트 3개)
- 섹션 코드 타이틀: MY WORKS
- 제목: 기획부터 구현까지, 아이디어를 실제 경험으로 완성한 프로젝트입니다.

### 4-1. AQUA PLANET
- 캡션: AQUA PLANET — AN IMMERSIVE AQUARIUM EXPERIENCE, BUILT FOR THE WEB.
- 제목: **K브랜드 웹사이트 리뉴얼 팀프로젝트**
- 브랜드: aqua planet
- 기간: 2026.06.04 - 2026.07.03
- 한 줄(built): 랜딩·마린랩·티켓 페이지 개발을 맡고, 전 페이지가 공유하는 인터랙션 시스템을 설계했습니다
- 설명: 이 프로젝트에서 프론트엔드 개발자로서 랜딩, 마린랩, 티켓 예매 페이지 구현을 담당했습니다. Three.js 기반 3D 크루 캐러셀과 커스텀 커서, GNB, 버블 인터랙션 등 공통 컴포넌트를 설계하고 성능·QA 작업과 배포까지 완료했습니다.
- 기여도: 기획 60% · 디자인 70% · 개발 90%
- 웹사이트: https://ezen-aquaplanet-project.vercel.app/
- 기획서(Figma): https://www.figma.com/proto/RNZVS2U4p1upluVvq78tTL/personal?page-id=237%3A398&node-id=237-1640&viewport=612%2C783%2C0.08&t=Y3y3Dgch0k1oZkVg-1&scaling=min-zoom&content-scaling=fixed
- 이미지: `assets/project1/figma/project-left.webp`
- 로고: `assets/project1/logos/aqua.svg`, `assets/project1/logos/planet.svg`
- 캐릭터 장식: `assets/figma/aqua-diving-glasses.webp` (버블 효과)

### 4-2. LAYER
- 캡션: LAYER — A SCENT COMMUNITY WHERE TASTE BECOMES CONVERSATION.
- 제목: **AI 챗봇 커뮤니티 프로젝트**
- 브랜드: Layer
- 기간: 2026.07.04 - 2026.07.29
- 한 줄(built): 온보딩과 홈을 메인으로 개발하고, 앱 전반의 기능 구현과 더미데이터 설계를 담당했습니다
- 설명: React와 Tailwind CSS를 기반으로 앱 전반의 기능을 구현했고, 향수·브랜드·챌린지·매장 서비스의 더미데이터 설계, 이미지 AVIF 변환을 통한 성능 최적화, PC 프레임과 스타일 가이드 제작까지 담당했습니다.
- 기여도: 기획 70% · 디자인 70% · 개발 90%
- 웹사이트: https://ezen-layerproject.vercel.app/
- 기획서(Figma): https://www.figma.com/proto/RNZVS2U4p1upluVvq78tTL/personal?page-id=237%3A5040&node-id=237-5053&viewport=690%2C571%2C0.03&t=DIbfmwmD9cwUu7El-1&scaling=min-zoom&content-scaling=fixed
- 이미지: `assets/project1/figma/project-center.webp`
- 로고: `assets/project1/logos/layer.svg`
- 캐릭터 장식: `assets/figma/layer-perfume-cap.webp` (향기 효과)

### 4-3. MOA
- 캡션: MOA — A FRIENDLY GUIDE FOR BETTER EVERYDAY CHOICES.
- 제목: **선택을 돕는 질문형 결정 도우미 앱**
- 브랜드: 모아
- 기간: 2026.03.26 - 2026.05.29
- 한 줄(built): 사용자가 스스로 기준을 찾도록, UX 설계부터 디자인·개발까지 전 과정을 직접 담당했습니다
- 설명: 질문에 답하며 스스로 선택 기준을 찾는 서비스를 기획했습니다. 캐릭터와 파스텔 컬러로 친근하게 디자인하고 React와 Vite로 전체 서비스를 개발했으며, PWA 대응과 모바일 뷰포트 최적화까지 1인으로 진행했습니다.
- 기여도: 기획 100% · 디자인 100% · 개발 100%
- 웹사이트: https://moa-app-indol.vercel.app/
- 기획서(Figma): https://www.figma.com/proto/IYUwIKFuLk3G0BmvlsoH9h/%EC%B5%9C%ED%95%B4%EC%88%98-%EB%AA%A8%EC%95%84?page-id=1159%3A1255&node-id=1159-2682&viewport=1063%2C1162%2C0.03&t=5qcWExPYTwMcfkE4-1&scaling=contain&content-scaling=fixed&starting-point-node-id=1159%3A2682
- 이미지: `assets/project1/figma/project-right.webp`
- 로고: `assets/project1/logos/moa.svg`
- 캐릭터 장식: `assets/figma/moa-question-large.svg`, `moa-question-small.svg` (물음표)

## 5. Clone Coding (Web Studies)
- 섹션 코드 타이틀: CLONE CODING
- 제목: 실제 웹사이트의 구조와 인터랙션을 분석하고 직접 재현하며 **퍼블리싱과 인터랙션 구현 역량**을 키웠습니다.
- UI 문구: SCROLL TO EXPLORE · ↗ VIEW SITE

| No | 사이트 | 링크 | 썸네일 |
|---|---|---|---|
| 001 | Y Studio | https://clonecode-virid.vercel.app/ | `assets/clone-coding/clone-03.webp` |
| 002 | Crew A La mode | https://clonecoding2.vercel.app/ | `assets/clone-coding/clone-04.webp` |
| 003 | 대방산업 | https://clonecoding3.vercel.app/ | `assets/clone-coding/clone-05.webp` |
| 004 | Musign | https://clonecoding4.vercel.app/ | `assets/clone-coding/clone-06.webp` |
| 005 | Qude | https://clonecoding5.vercel.app/ | `assets/clone-coding/clone-01.webp` |
| 006 | 한화케미컬 | https://clonecodiing6.vercel.app/ | `assets/clone-coding/clone-02.webp` |

*(006 링크의 `clonecodiing6` 철자는 원본 그대로입니다.)*

## 6. Skills
- 타이틀: **SKILLS**
- 부제: 디자인부터 개발까지, 다양한 도구를 익히며 성장하고 있습니다.

### 카테고리 목록
- **DESIGN**: Figma, Blender
- **FRONTEND**: HTML / CSS, JavaScript, Three.js, GSAP, React, TypeScript, Tailwind, Git / GitHub, Vercel
- **AI**: OpenAI, Gemini, Anthropic, Meshy AI

### 스킬 카드 (뒤집으면 숙련도·설명)
| 도구 | 숙련도 | % | 설명 | 아이콘 |
|---|---|---|---|---|
| Figma | 상 | 90 | 와이어프레임부터 프로토타입까지 전 과정에 사용했습니다 | `assets/tools/figma.webp` |
| Three.js | 중상 | 75 | 카메라, 조명, 지오메트리를 다뤄 3D 씬을 구현했습니다 | `assets/tools/three-js.webp` |
| GSAP | 중상 | 75 | 타임라인과 트리거로 정교한 스크롤 연출을 만들었습니다 | `assets/tools/gsap.webp` |
| React | 중상 | 75 | 재사용 가능한 컴포넌트와 상태 관리로 화면을 구조화했습니다 | `assets/tools/react.webp` |
| TypeScript | 중상 | 75 | 타입을 정의해 재사용 가능한 UI를 구축했습니다 | `assets/tools/typescript.webp` |
| Anthropic | 상 | 90 | 기획부터 코드까지 효율적인 작업을 진행하였습니다 | `assets/tools/anthropic.webp` |
| Blender | 중 | 60 | AI 스크립트를 통해 3D 애니메이션을 추가했습니다 | `assets/tools/blender.webp` |
| HTML | 상 | 90 | 시맨틱 마크업으로 접근성 높은 구조를 만들었습니다 | `assets/tools/html.webp` |
| CSS | 상 | 90 | 반응형 레이아웃과 스타일로 화면을 구현했습니다 | `assets/tools/css.webp` |

## 7. Timeline
- 타이틀: **TIMELINE**
- 부제: 배우고, 만들며, 쌓아온 저의 타임라인을 소개합니다.

| 연도 | 제목 | 설명 | 사진 (기본 / 호버) |
|---|---|---|---|
| 2007 – 2012 | In Canada | 어린 시절 캐나다에서 다양한 국적의 친구들과 영어로 어울렸습니다. / 낯선 환경에 자연스럽게 적응하고 소통하는 감각을 익혔습니다. | canada-playground / canada-school |
| 2021 | Drawing | 미대 입시를 준비하며 매일 대상을 관찰하고 손으로 표현했습니다. / 형태와 비율을 읽는 훈련은 디자인을 바라보는 기초가 되었습니다. | drawing-teddybear / drawing-sketching |
| 2024 | Latte Art | 카페에서 1년 반 동안 일하며 커피 위에 다양한 그림을 그렸습니다. / 작은 표현 하나로 손님의 하루에 즐거움을 더하는 순간을 좋아했습니다. | latteart-leaf / latteart-bear |
| 2024 | Exhibitions | 매달 전시를 찾아 작품을 보고, 작가의 시선과 표현 방식을 기록합니다. / 다른 해석을 받아들이며 제 생각과 시각의 범위를 넓혀가고 있습니다. | exhibition-gallery / exhibition-graffiti |
| 2026 | UX / UI Begin | 사람의 불편을 발견하고 즉시 해결하는 디자인에 매력을 느꼈습니다. / 직접 디자인하고 구현하며 더 많은 사람에게 편리한 경험을 전하고 싶었습니다. | uxui-coding / uxui-meeting |
| NOW | Growing | 배우고 만든 것들이 쌓여, / 이제 100%를 향해 갑니다. | (진행률 원형 링) |

사진 경로: `assets/timeline/<이름>.webp`

## 8. Contact / Footer
- 제목: **Let’s talk !**
- 전화: 010 4212 4970
- 이메일: chs041015@gmail.com (Gmail 작성창으로 연결, 제목 "Haesoo Portfolio Inquiry", 본문 "Hello Haesoo, / I would like to talk about a project.")
- 푸터 메뉴: HOME · ABOUT · WORK · TIMELINE
- 시그니처: **It’s / Haesoo .**
- Back to top ↑
- © 2026 Haesoo All rights reserved
- 구분선: `assets/figma/footer-line.svg`

---

## 9. Sayout 케이스 스터디 (모달)
- 키커: AI WIREFRAME GENERATOR · CASE STUDY
- 제목: **Sayout**
- 이미지: `assets/sayout/sayout-case-study.png` (webp도 있음)
- 요약: 한국어로 원하는 화면을 설명하면 구조를 해석하고, / Figma에서 바로 편집할 수 있는 와이어프레임으로 / 변환하는 웹 도구입니다.
- WHY I MADE IT: 프로젝트를 진행하며 반복적인 와이어프레임 작업을 더 빠르고 효율적으로 할 필요성을 느껴, AI를 활용한 텍스트 기반 와이어프레임 생성기 Sayout을 만들었습니다.
- 포인트
  1. **자연어 구조화** — 한국어 명령에서 화면 유형과 요소, 문구, 순서, 위치 정보를 추출해 구조화된 데이터로 변환합니다.
  2. **해석 결과 직접 수정** — 생성 전 요소의 종류와 문구, 순서, 위치를 확인하고 수정할 수 있어 사용자가 결과를 직접 통제할 수 있습니다.
  3. **Figma 편집 레이어 변환** — 완성된 와이어프레임을 Figma로 복사해 Frame, Text, Auto Layout 구조를 유지한 채 바로 편집할 수 있습니다.
- CTA: Sayout 체험하기 ↗ → https://sayout-inapp.vercel.app/

## 10. Haesoo Bot (캐릭터 + 챗봇)

### 캐릭터 말풍선
- 라벨: I'm Haesoo Bot!
- 자동 말풍선: "방향키로 움직여보세요!", "저를 누르면 대화할 수 있어요"
- 방향키 힌트: `assets/figma/buddy-hint-bubble.svg`, `buddy-hint-arrow-{up,down,left,right}.svg`

### 챗봇 기본 문구
- 인사: 안녕하세요 ! 저는 최해수입니다. 포트폴리오나 작업 방식 또는 저에 대해 궁금한 점을 물어보세요.
- 추천 질문: 어떤 프로젝트를 했나요? / 가장 자신 있는 기술은? / 함께 일하려면 어떻게 하나요?
- 빠른 주제 버튼: 프로젝트 · 기술 · 소개 · 취미 · 연락
- 입력창: 메시지를 입력하세요 / SEND
- 프로젝트 카드에서 묻기: "아쿠아플라넷 프로젝트에 대해 알려주세요", "LAYER 프로젝트에 대해 알려주세요", "MOA 프로젝트에 대해 알려주세요"
- 답 없음: 그건 제가 아직 답을 못 드리는 질문이에요. 프로젝트나 기술, 제 얘기, 협업 방법 같은 거 물어봐 주세요!

### Q&A (키워드 → 답변, 위에서부터 먼저 매칭)
1. **MOA, 모아, 의사결정, 후보추천** — MOA는 선택지가 너무 많아서 결정이 어렵거나 남 의견에 자꾸 기대게 되는 문제를 풀려고 만든 서비스예요. 답변 맥락에 따라 질문을 이어가면서 선택 기준을 정리해주고, 마지막엔 후보 세 개랑 추천 이유를 보여줘요.
2. **MOA결과, 4.12, 사용자평가, 25명, 984개, MOA 성과** — MOA는 25명한테 40문항으로 사용자 평가를 받았어요. 미입력 16개 빼고 984개 응답 기준으로 평균 4.12점(5점 만점) 나왔고, 거기서 발견한 문제들(클릭 표현, 질문 흐름, 홈 화면 구조, 튜토리얼)은 다 개선했어요.
3. **아쿠아플라넷, Aqua Planet, 글래스모피즘** — 아쿠아플라넷의 지점, 해양생물, 프로그램을 깊어지는 바다 느낌으로 소개하는 인터랙티브 웹이에요. 긴 스크롤 배경, 영상, 기포·물결 효과, 3D 생물 모델, 글래스모피즘 UI를 섞어서 수중 공간을 탐색하는 감각을 표현했고, 대용량 영상·3D 자산 때문에 생기는 성능 문제도 같이 줄여봤어요.
4. **LAYER, 레이어, 향수** — LAYER는 어렵고 방대한 향수 정보를 취향이랑 상황에 맞게 탐색하게 도와주는 향수 앱이에요. 향수 성향 진단, 매거진, 후기랑 자유롭게 대화하는 커뮤니티, 사진 보고 어울리는 향 추천해주는 콘텐츠랑 챗봇까지 설계했어요.
5. **Sayout, 세이아웃, 명령형, 와이어프레임** — Sayout은 원하는 화면을 문장으로 입력하면 Figma 와이어프레임을 만들어주는 도구예요. 반복되는 초기 레이아웃 작업 시간을 줄이고, 구조를 빠르게 비교하고 고칠 수 있게 하는 게 목표예요. 최근엔 이 AI 와이어프레임 기능도 작업했어요! 좌상단 버튼 눌러서 체험해보세요.
6. **대표 프로젝트, 프로젝트 순서, 무엇부터, 추천 프로젝트** — UX 문제 정의랑 사용자 검증 과정 보고 싶으면 MOA 먼저 추천해요. 인터랙티브 웹 구현은 아쿠아플라넷, 콘텐츠 구조랑 감각적인 모바일 UI는 LAYER, AI로 새로운 도구 만드는 건 Sayout이랑 이 포트폴리오 챗봇에서 볼 수 있어요.
7. **프로젝트, 작업물, 포트폴리오, 만든, work** — 선택을 돕는 AI 서비스 MOA, 아쿠아플라넷의 해양 경험을 담은 인터랙티브 웹, 향수 탐색 앱 LAYER, 문장으로 와이어프레임 만들어주는 Sayout, 그리고 캐릭터형 챗봇을 넣은 이 포트폴리오까지 진행했어요. Works 버튼 누르면 더 자세히 볼 수 있어요!
8. **코딩, 개발, HTML, CSS, React, GitHub, 기술, 스킬, skill, 잘하, 자신** — 네, HTML·CSS 기반으로 화면 만들고 React랑 Vite로 프로젝트도 여러 개 진행했어요. Git·GitHub로 협업하고 Vercel로 배포까지 직접 해봤고, 인터랙션이 많이 필요한 프로젝트에선 GSAP·ScrollTrigger·Three.js도 써봤어요.
9. **디자인 도구, 디자인툴, Figma, 프로토타입, 컴포넌트** — 주로 Figma로 와이어프레임, UI, 컴포넌트, 프로토타입까지 다 만들어요. 필요한 이미지나 시각 자산도 다듬고, 인터랙티브 웹으로 옮길 땐 구조를 개발 환경에 맞게 정리해서 써요.
10. **앞으로, 커리어 목표, 미래, 프로덕트 디자이너, 되고 싶, 되고싶** — 사용자 행동이랑 감정을 세밀하게 이해하면서도, 아이디어를 실제 제품·서비스로 구현할 수 있는 디자이너가 되고 싶어요. 디자인이랑 개발 사이의 언어를 같이 이해하면서 팀이랑 잘 협업하고, 사용자가 직접 만지고 반응할 수 있는 경험을 만드는 게 목표예요.
11. **어떤 디자이너, 디자인 철학, 정체성, 지향점, 한 문장** — 저는 사용자를 감각으로 읽고, 그 감각을 논리로 구현하는 디자이너를 지향해요. 보기 좋은 화면 만드는 데서 끝내지 않고, 사용자가 뭘 이해하고 어떤 행동을 하게 될지까지 설계한 다음 인터랙션이랑 코드로 연결하려고 해요.
12. **자기소개, 소개, 지원자, 본인, 누구, 해수, 최해수** — 저는 사용자의 감각이랑 행동을 관찰해서 문제를 찾고, 그걸 논리적인 화면 구조랑 실제 작동하는 인터랙션으로 만드는 디자이너예요. Figma로 기획하고 시각화하는 것부터 HTML·CSS·React로 직접 구현하는 것까지 다 해요.
13. **강점, 장점, 차별점, 실행력** — 제 강점은 아이디어를 제안하는 데서 멈추지 않고, 사용자 흐름이랑 인터랙션을 구체화해서 실제 화면으로 구현하는 실행력이에요. 디자인 의도를 코드랑 직접 연결해볼 수 있어서, 구현하다 생기는 제약도 이해하고 더 현실적인 방법을 찾을 수 있어요.
14. **성격, 성향, 꾸준함, 끈기** — 목표를 정하면 쉽게 안 놓고 될 때까지 방법을 찾는 편이에요. 미대 입시 준비하면서 학업이랑 알바를 같이 했던 경험 덕분에, 시간이 빠듯해도 계획을 조정해가면서 끝까지 해내는 습관이 생겼어요.
15. **디자인 기준, 좋은 디자인, 정보 구조, 인터랙션 목적** — 화면을 보면서 사용자가 뭘 이해하고 다음에 뭘 해야 할지 자연스럽게 드러나는지를 제일 중요하게 봐요. 비주얼이나 인터랙션도 그냥 예뻐 보이려고 넣기보다, 문제랑 브랜드 경험을 더 명확하게 전달하는 방향으로 쓰려고 해요.
16. **프로세스, 작업 과정, 문제 해결, 사용자 흐름** — 먼저 사용자가 겪는 문제랑 목표를 정리하고, 핵심 흐름이랑 정보 구조를 설계해요. 그다음 와이어프레임이랑 비주얼 콘셉트를 구체화해서 실제 화면으로 만들어보고, 테스트나 피드백에서 나온 문제는 우선순위 정해서 다시 고쳐요.
17. **디자인과 개발, 현실성** — 인터랙션이 중요한 프로젝트는 디자인 파일만으로는 경험을 다 설명하기 어렵더라고요. 직접 구현해보면 속도나 반응, 전환 같은 걸 더 구체적으로 볼 수 있고, 개발 제약을 알고 나서 더 현실적인 디자인 결정을 내릴 수 있어요.
18. **인터랙션, 모션, 애니메이션, 스크롤, 스토리텔링** — 인터랙션을 그냥 장식으로 먼저 정하기보다, 콘텐츠 흐름이랑 사용자 시선을 어떻게 연결할지부터 생각해요. 아쿠아플라넷에서는 바다 속으로 들어가는 느낌을 롱스크롤이랑 영상·3D로 표현했고, 제 포트폴리오에서는 캐릭터가 안내하다가 챗봇으로 이어지는 흐름을 짜봤어요.
19. **사용자테스트, 사용자 테스트, 피드백, 검증** — MOA 프로젝트에서 사용자 평가를 해봤는데, 클릭 가능한 요소가 잘 안 보이는 문제, 질문이 반복되는 문제, 홈 화면 정보 우선순위 문제가 나왔어요. 그래서 클릭 가능성을 더 뚜렷하게 표현하고, 질문 흐름이랑 히어로 영역 정리하고, 튜토리얼도 보완했어요.
20. **팀 프로젝트, Git, 브랜치, 커뮤니케이션** — 팀 프로젝트에서 역할 나누고 Git·GitHub로 브랜치 관리하면서 작업했어요. 아쿠아플라넷 할 때는 페이지랑 자산을 브랜치로 나눠서 작업했고, 충돌이나 배포 문제 생기면 원인 찾아서 정리하면서 해결했어요.
21. **생성형, AI 활용, 업무활용** — AI로 결과물을 대신 결정하게 하기보다, 아이디어 탐색하고 이미지 시안 만들고 문구 정리하는 걸 빠르게 반복하는 용도로 써요. 문장으로 Figma 와이어프레임을 만들어주는 Sayout이나 이 포트폴리오 챗봇처럼, AI 기능 자체를 프로젝트로 만들어보는 것도 재밌어서 하고 있어요.
22. **디자인 계기, 산업디자인, 미대입시, 미대 입시, 진로** — 원래 그림 그리는 걸 좋아했고, 아이디어를 실제 형태로 만들 수 있다는 점에 끌려서 산업디자인 진학을 준비했어요. 그러다 화면 안에서 사용자 경험이랑 인터랙션을 설계하고 실제로 작동하게 만들 수 있는 UX/UI, 웹 디자인으로 관심이 넓어졌어요.
23. **재수, 삼수, 힘들었던, 극복** — 원하는 대학에 못 붙어서 재수, 삼수하면서 공부랑 알바를 같이 했던 시기가 제일 힘들었어요. 입시 비용이랑 생활비를 직접 마련해야 해서 시간도 돈도 빠듯했는데, 상황에 맞춰서 일이랑 공부 시간을 계속 조정하면서 준비했어요.
24. **텍사스로드하우스, 오술차, 알바, 아르바이트, 시간관리, 시간 관리** — 텍사스로드하우스에서 일할 땐 오전 10시부터 오후 4시까지 일하고 나서 공부하고, 주말엔 그림 수업도 들었어요. 오술차에서 일할 땐 낮에 공부하고 저녁부터 새벽까지 일했고요. 환경 탓하기보다 쓸 수 있는 시간을 나누고 우선순위 조정하면서 목표를 계속 이어갔어요.
25. **배운 점, 배운점, 그 경험, 영향을** — 처음 세운 방법이 안 통할 때 목표 자체를 포기하기보다, 원인을 찾고 계획을 다시 조정하는 습관이 생겼어요. 디자인할 때도 처음 만든 시안을 정답으로 안 두고, 사용자 피드백이나 구현 제약, 팀 의견 확인하면서 더 나은 방향으로 계속 고쳐요.
26. **UX/UI 공부, 교육, UX/UI 과정, 학습** — UX/UI 웹디자인 과정에서 Figma로 화면 설계하고 HTML·CSS로 웹 구현하는 걸 배웠고, 그다음 React로 확장했어요. 팀 프로젝트랑 개인 프로젝트 하면서 기획부터 UI 디자인, 프로토타이핑, 구현, 배포까지 한 흐름으로 경험해봤어요.
27. **히스토리, 타임라인, 여정, 살아왔, background, 어떻게 시작, 커리어** — 캐나다에서 어릴 때를 보내서 그런지 그때 감각이 아직도 남아있어요. 미대 입시하면서 관찰하고 그리는 법을 배웠고, 봉사활동 페이스페인팅이랑 카페 라떼아트도 하면서 사람 기쁘게 하는 걸 좋아하게 됐어요. 그러다 보니 자연스럽게 UX/UI로 왔네요.
28. **어디 살, 사는 곳, 거주, 지역, location** — 용인 살아요!
29. **취미, 여가, hobby, 쉴 때, 관심사, 그림, 드로잉** — 그림 그리는 걸 제일 좋아해요. 라떼아트로 커피 위에 그리기도 하고, 시간 날 때 전시 보러 다니거나 여행 다니는 것도 즐겨요.
30. **그림과 디자인, 시각화** — 그림 그리면서 머릿속 아이디어를 눈에 보이는 형태로 옮기는 게 익숙해졌어요. 지금은 그 경험을 가만히 있는 이미지에만 안 쓰고, 사용자가 움직이고 선택하고 반응할 수 있는 화면이랑 인터랙션으로 넓혀서 쓰고 있어요.
31. **함께, 협업, 연락, 컨택, 채용, 일하, 인터뷰, 이메일** — 010-4212-4970 또는 chs041015@gmail.com으로 편하게 연락 주세요. 프로젝트별 자세한 과정은 Works 섹션에서 더 볼 수 있어요!

---

## 11. 에셋 목록 (`assets/`)
- `about/` — portrait.webp, briefcase.svg, map-pin.svg, status-dot.svg, trending-up.svg
- `hero/` — accent-bolt.webp, accent-star.webp
- `reveal/` — accent-bolt, accent-cross, accent-equals, accent-loop, accent-star (.webp)
- `project1/figma/` — project-left(Aqua), project-center(Layer), project-right(Moa) (.webp)
- `project1/logos/` — aqua.svg, planet.svg, layer.svg, moa.svg
- `clone-coding/` — clone-01 ~ clone-06 (.webp)
- `tools/` — anthropic, blender, css, figma, gsap, html, react, three-js, typescript (.webp)
- `timeline/` — canada-playground, canada-school, drawing-sketching, drawing-teddybear, exhibition-gallery, exhibition-graffiti, latteart-bear, latteart-leaf, uxui-coding, uxui-meeting (.webp)
- `sayout/` — sayout-case-study (.png / .webp)
- `figma/` — 캐릭터 장식(aqua-diving-glasses, layer-perfume-cap, moa-question-*), 말풍선/방향키 힌트(buddy-hint-*), contact-arrow*(.svg), hero-divider.svg, footer-line.svg
- `vendor/` — gsap.min.js, ScrollTrigger.min.js, three.module.min.js
