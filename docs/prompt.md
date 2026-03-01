# AI 사주 MVP — Phase 1 UI 스펙

## 프로젝트 개요
AI 기반 사주팔자 + MBTI 16타입 개인화 운세 서비스.
Gemini 3.1 Pro로 실시간 해석, 캐릭터 3종(청운/세연/화련) 톤 분기.

## 기술 스택
- Next.js 16 + React 19 + TypeScript
- Tailwind CSS
- Prisma + SQLite
- 모바일 퍼스트 (390px 기준)

## 디자인 톤
- 메인 컬러: 갈색/골드 (#8B6914, #D4A853, #1A1A2E 다크 배경)
- 폰트: Pretendard (본문), 나눔명조 (사주 해석 텍스트)
- 스타일: 청월당(aifortunedoctor.com) 풀스크린 히어로 + 사주별관(thesajulab.com) 카탈로그 구조 혼합

## 작업 범위

### 작업 1: 무료 결과 페이지 리빌드
**파일:** `app/result/[readingId]/page.tsx`

DB에서 Reading + ReadingSection[]을 가져와서 렌더링.
섹션 타입별 분기:
- `CORE`: 핵심 한 줄 요약 — 큰 텍스트, 골드 색상
- `SCORE`: 총운 점수 — 원형 프로그레스 바 (SVG), 5개 카테고리 점수 막대
- `LOVE/MONEY/CAREER/HEALTH/RELATIONSHIP`: 카테고리 카드 — 아이콘 + 점수 + summary 3줄
- `MONTHLY`: 월별 흐름 — 12칸 그리드 (무료에서는 블러)
- `MBTI_GUIDE`: MBTI 맞춤 가이드 — 뱃지 + 강점/주의점/행동가이드 (무료에서는 블러)
- `CHARACTER_COMMENT`: 상담사 한 마디 — 캐릭터 아이콘 + 말풍선

**무료 모드 처리:**
- CORE, SCORE, 5개 카테고리 summary → 보임
- MONTHLY, MBTI_GUIDE detail, CHARACTER_COMMENT → 블러 + "프리미엄으로 전체 보기" CTA

**하단 고정:**
- SNS 공유 버튼 (카카오톡/트위터/링크 복사)
- "프리미엄 결과 보기 — 9,900원" CTA 버튼 (골드)

### 작업 2: 메인 페이지 개선
**파일:** `app/page.tsx`

섹션 구성 (위→아래):
1. **풀스크린 히어로** — 대표 캐릭터 이미지 배경 + "AI가 읽어주는 내 사주" + "무료 체험" CTA
2. **퀵 카테고리 탭** — 가로 스크롤: 1분사주 / 궁합 / 재물운 / 연애운 / 신년운세
3. **BEST 상품 카드 3개** — 청운/세연/화련 각각 카드 (이미지 + 이름 + 전문분야 + 가격 앵커링)
4. **무료 1분 사주 체험 CTA** — 풀 너비 골드 버튼
5. **소셜 프루프** — "방금 OOO님이 사주를 확인했습니다" 토스트 애니메이션 (하단 고정)
6. **리뷰/평점** — 별점 + 한 줄 후기 3개 (더미 데이터)

## 데이터 참조
- 캐릭터 이미지: `docs/assets/img/` (cheong-un.png, se-yeon.png, hwa-ryeon.png)
- Reading 타입: `prisma/schema.prisma` 참조
- 섹션 타입: `lib/saju-engine.ts`의 `BuiltSection` 타입
