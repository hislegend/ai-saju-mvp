# AI 사주 MVP — Phase 3 UI 스펙

## Phase 1+2 완료 현황
- AI 엔진(Gemini 3.1 Pro) + 만세력 + MBTI 16타입 + 캐싱
- 메인 + 캐릭터 상세(3종) + 무료/프리미엄 결과 + 결제 대기
- 이미지 WebP 최적화 완료

## 작업 범위

### 작업 1: OG 카드 메타태그 + 동적 OG 이미지
**파일:** `app/result/[readingId]/page.tsx` (메타데이터 확장), `app/api/og/route.tsx` (신규)

**메타데이터 (generateMetadata 확장):**
- title: "[이름]님의 AI 사주 결과 — 총운 [점수]점"
- description: coreSummary (핵심 한 줄)
- og:image: `/api/og?readingId=[id]` (동적 생성)
- og:type: "website"
- twitter:card: "summary_large_image"

**OG 이미지 API (`app/api/og/route.tsx`):**
- `@vercel/og` (next/og) 사용하여 1200x630 이미지 생성
- 레이아웃:
  - 좌측: 캐릭터 아이콘 (작게)
  - 중앙: "[이름]님의 2026년 운세"
  - 하단: 총운 점수 + MBTI 뱃지 + 핵심 한 줄
  - 배경: 다크 (#1A1A2E) + 골드 텍스트
- Reading DB에서 데이터 fetch

**각 페이지 메타데이터도 추가:**
- `app/page.tsx`: 메인 페이지 OG (정적)
- `app/fortune/[characterSlug]/page.tsx`: 캐릭터별 OG (이미 있으면 확장)

### 작업 2: SNS 공유 개선
**파일:** `components/result/share-buttons.tsx` (수정)

- 카카오톡: Kakao JS SDK 초기화 + `Kakao.Share.sendDefault` 호출
  - 앱키는 환경변수 `NEXT_PUBLIC_KAKAO_JS_KEY` 참조 (없으면 기존 sharer URL 폴백)
- 트위터: 텍스트에 점수 + 핵심 한 줄 포함
- 링크 복사: "결과가 복사되었습니다!" 토스트

### 작업 3: PDF 다운로드 버튼 연결
**파일:** `components/result/pdf-download-button.tsx` (신규)

- 브라우저에서 `window.print()` 기반 PDF 저장 (단순 구현)
- @media print 스타일: 블러 제거, 배경 흰색, 불필요 UI 숨김
- 프리미엄 결과 페이지에서만 활성화

## 기술 참조
- `@vercel/og`는 이미 Next.js 16에 내장 (`next/og`)
- Prisma Reading+Section fetch는 기존 result page 코드 참고
- 새 npm 패키지 불필요

## 스타일
- OG 이미지: 1200x630, 다크 배경 + 골드 텍스트
- PDF: @media print에서 깔끔한 흰 배경
