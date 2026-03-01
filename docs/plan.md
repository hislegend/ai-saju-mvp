# Phase 1 UI — 마일스톤

> 코타로는 이 순서대로 실행한다. 건너뛰기 금지.

## M1: 무료 결과 페이지

### M1-1: ScoreCircle 컴포넌트
- `components/ScoreCircle.tsx` — SVG 원형 프로그레스 바 (0~100, 골드 색상)
- 검증:
```bash
npx tsc --noEmit 2>&1 || echo "TYPE CHECK FAILED"
```

### M1-2: CategoryCard 컴포넌트
- `components/CategoryCard.tsx` — 아이콘 + 점수바 + summary 3줄
- Props: icon, label, score, summary
- 검증:
```bash
npx tsc --noEmit 2>&1 || echo "TYPE CHECK FAILED"
```

### M1-3: BlurSection 컴포넌트
- `components/BlurSection.tsx` — 블러 오버레이 + "프리미엄으로 전체 보기" CTA
- 검증:
```bash
npx tsc --noEmit 2>&1 || echo "TYPE CHECK FAILED"
```

### M1-4: ShareButtons 컴포넌트
- `components/ShareButtons.tsx` — 카카오톡/트위터/링크복사
- 검증:
```bash
npx tsc --noEmit 2>&1 || echo "TYPE CHECK FAILED"
```

### M1-5: 결과 페이지 조립
- `app/result/[readingId]/page.tsx` — DB에서 Reading+Section fetch → 위 컴포넌트로 렌더
- 섹션 타입별 분기 (CORE/SCORE/LOVE/MONEY/CAREER/HEALTH/RELATIONSHIP/MONTHLY/MBTI_GUIDE/CHARACTER_COMMENT)
- 무료 모드: MONTHLY, MBTI_GUIDE detail, CHARACTER_COMMENT → BlurSection 처리
- 검증:
```bash
npx tsc --noEmit 2>&1 || echo "TYPE CHECK FAILED"
npm run build 2>&1 || echo "BUILD FAILED"
```

### M1-6: 반응형 확인
- 390px, 768px 확인
- 검증: 스크린샷 첨부 또는 레이아웃 깨짐 없음 확인
- **M1 완료 → git commit -m "feat: 무료 결과 페이지 리빌드" && git push**
- **docs/docs.md에 M1 상태 기록**

---

## M2: 메인 페이지

### M2-1: HeroSection 컴포넌트
- `components/HeroSection.tsx` — 풀스크린 배경 + "AI가 읽어주는 내 사주" + CTA
- 검증:
```bash
npx tsc --noEmit 2>&1 || echo "TYPE CHECK FAILED"
```

### M2-2: CategoryTabs 컴포넌트
- `components/CategoryTabs.tsx` — 가로 스크롤 탭 (1분사주/궁합/재물운/연애운/신년운세)
- 검증:
```bash
npx tsc --noEmit 2>&1 || echo "TYPE CHECK FAILED"
```

### M2-3: ProductCard 컴포넌트
- `components/ProductCard.tsx` — 캐릭터 카드 (이미지+이름+전문분야+가격 앵커링)
- 검증:
```bash
npx tsc --noEmit 2>&1 || echo "TYPE CHECK FAILED"
```

### M2-4: SocialProof 컴포넌트
- `components/SocialProof.tsx` — "방금 OOO님이 사주를 확인했습니다" 토스트 애니메이션
- 검증:
```bash
npx tsc --noEmit 2>&1 || echo "TYPE CHECK FAILED"
```

### M2-5: ReviewSection 컴포넌트
- `components/ReviewSection.tsx` — 별점 + 한 줄 후기 3개 (더미 데이터)
- 검증:
```bash
npx tsc --noEmit 2>&1 || echo "TYPE CHECK FAILED"
```

### M2-6: 메인 페이지 조립
- `app/page.tsx` — Hero → CategoryTabs → ProductCards → CTA → SocialProof → Reviews
- 검증:
```bash
npx tsc --noEmit 2>&1 || echo "TYPE CHECK FAILED"
npm run build 2>&1 || echo "BUILD FAILED"
```

### M2-7: 반응형 확인
- 390px, 768px 확인
- **M2 완료 → git commit -m "feat: 메인 페이지 개선" && git push**
- **docs/docs.md에 M2 상태 기록**

---

## 완료 기준
- [ ] `npx tsc --noEmit` 에러 0건
- [ ] `npm run build` 성공
- [ ] M1, M2 각각 커밋 + 푸시 완료
- [ ] docs/docs.md에 전체 상태 기록 완료
