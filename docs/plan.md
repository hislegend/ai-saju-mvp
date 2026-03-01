# Phase 1 UI — 마일스톤

## M1: 무료 결과 페이지 (우선)
1. ScoreCircle 컴포넌트 — SVG 원형 프로그레스 바 (0~100)
2. CategoryCard 컴포넌트 — 아이콘 + 점수바 + summary
3. BlurSection 컴포넌트 — 블러 오버레이 + CTA
4. ShareButtons 컴포넌트 — 카카오/트위터/링크복사
5. `app/result/[readingId]/page.tsx` 조립 — DB에서 Reading+Section fetch → 위 컴포넌트로 렌더
6. 반응형 확인 (390px, 768px)

## M2: 메인 페이지
1. HeroSection 컴포넌트 — 풀스크린 배경 + CTA
2. CategoryTabs 컴포넌트 — 가로 스크롤 탭
3. ProductCard 컴포넌트 — 캐릭터 카드 (이미지+이름+가격)
4. SocialProof 컴포넌트 — 토스트 알림 애니메이션
5. ReviewSection 컴포넌트 — 별점 + 후기
6. `app/page.tsx` 조립
7. 반응형 확인

## 완료 기준
- `npx tsc --noEmit` 에러 0건
- 모바일(390px) 스크린샷 첨부
- git commit + push
