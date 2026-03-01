# Phase 2 UI — 마일스톤

## M3: 캐릭터 상세 페이지 (우선)
1. CharacterHero 컴포넌트 — 풀스크린 WebP + 오버레이 + 이름/전문분야
2. CharacterInfo 컴포넌트 — 소개 + "알 수 있는 것" 리스트
3. PriceCard 컴포넌트 — 원가/할인가/할인율 뱃지
4. ReadingForm 컴포넌트 — 이름/생년월일/시간/양음력/MBTI 입력
5. `app/fortune/[characterSlug]/page.tsx` 조립
6. 폼 제출 → API 호출 → 리다이렉트 동작 확인
7. 반응형 확인 (390px)

## M4: 프리미엄 결과 + 결제 대기 페이지
1. 결과 페이지 — status=COMPLETED일 때 블러 해제 로직
2. 카테고리 detail 필드 렌더링
3. 월별 흐름 + MBTI 가이드 + 상담사 코멘트 전체 노출
4. PDF 다운로드 버튼 (placeholder)
5. `app/checkout/[readingId]/page.tsx` 개선
6. CategoryTabs 라우팅 연결

## 완료 기준
- `npx tsc --noEmit` 에러 0건
- `npm run build` 성공
- 모바일(390px) 확인
- git commit + push
