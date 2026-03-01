# AI 사주 MVP — Phase 2 UI 스펙

## Phase 1 완료 현황
- 백엔드: AI 엔진(Gemini 3.1 Pro) + 만세력 + MBTI 16타입 + 캐싱
- UI: 무료 결과 페이지(M1) + 메인 페이지(M2) 완료
- 이미지: WebP 변환 완료 (public/characters/*.webp)

## 기술 스택 (동일)
- Next.js 16 + React 19 + TypeScript + Tailwind CSS
- Prisma + SQLite
- 모바일 퍼스트 (390px 기준)

## 디자인 톤 (동일)
- 갈색/골드 (#8B6914, #D4A853, #1A1A2E 다크 배경)
- 청월당 풀스크린 히어로 + 사주별관 카탈로그 혼합

---

## 작업 범위

### 작업 1: 캐릭터 상세 페이지 (신규)
**파일:** `app/fortune/[characterSlug]/page.tsx`
**컴포넌트:** `components/fortune/`

청월당 스타일 풀스크린 캐릭터 히어로 페이지.
각 캐릭터(청운/세연/화련)별 독립 페이지.

**slug 매핑:**
- `cheongun` → 청운 (정통 사주 · 대운/신년운세)
- `seyeon` → 세연 (연애/궁합 전문)
- `hwaryeon` → 화련 (재물/사업 전문)

**레이아웃:**
1. 풀스크린 히어로 — 캐릭터 WebP 배경 + 이름 + 전문분야
2. 캐릭터 소개 카드 — 상담 스타일 설명 (3줄)
3. "이 사주방에서 알 수 있는 것" 리스트 (4~5항목)
4. 가격 영역 — 원가 19,000원 취소선 + 할인가 9,900원 + 할인율 뱃지
5. 입력 폼 섹션:
   - 이름 (text)
   - 생년월일 (date picker 또는 YYYY.MM.DD input)
   - 태어난 시간 (select: 자시~해시 + 모름)
   - 양력/음력 (radio)
   - MBTI (select: 16타입 + 모름)
6. CTA 버튼: "무료 1분 사주 보기" (quick) / "프리미엄 사주 보기 — 9,900원" (premium)
7. 하단: 리뷰 2개 (더미)

**폼 제출:**
- 무료: POST `/api/readings` → readingId → `/result/[readingId]` 리다이렉트
- 프리미엄: POST `/api/readings` → readingId → `/checkout/[readingId]` 리다이렉트

### 작업 2: 프리미엄 결과 페이지 확장
**파일:** `app/result/[readingId]/page.tsx` (기존 확장)

결제 완료(status=COMPLETED) 시 블러 해제:
- 5개 카테고리 상세 해석 (detail 필드) 전체 노출
- 월별 흐름 12칸 그리드 전체 노출
- MBTI 맞춤 가이드 전체 (강점/주의점/행동가이드 3개)
- 상담사 한 마디 전체 노출
- PDF 다운로드 버튼 (빈 onClick — Phase 3에서 구현)

### 작업 3: CategoryTabs 라우팅 연결
**파일:** `components/home/category-tabs.tsx` (수정)

각 탭 클릭 시:
- 1분사주 → `/quick`
- 궁합 → `/fortune/seyeon` (연애 전문)
- 재물운 → `/fortune/hwaryeon` (재물 전문)
- 연애운 → `/fortune/seyeon`
- 신년운세 → `/fortune/cheongun` (대운 전문)

### 작업 4: 결제 대기 페이지 개선
**파일:** `app/checkout/[readingId]/page.tsx` (수정)

- 상단: "프리미엄 사주 결과를 열어보세요"
- 가격: 9,900원 (부가세 포함)
- 결제 버튼: "토스페이로 결제하기" (아직 미연동 — alert으로 대체)
- 하단: 무료 결과 미리보기 링크

## 데이터 참조
- 캐릭터 이미지: `public/characters/*.webp`
- Reading 타입/섹션: `prisma/schema.prisma`, `lib/saju-engine.ts`
- API: `app/api/readings/route.ts` (POST)
- Validator: `lib/validators.ts` (readingCreateSchema)
