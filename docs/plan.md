# Phase 3 UI — 마일스톤

## M5: OG 카드 + SNS 공유
1. `app/api/og/route.tsx` — 동적 OG 이미지 생성 (next/og ImageResponse)
2. `app/result/[readingId]/page.tsx` — generateMetadata 확장
3. `app/page.tsx` — 메인 페이지 정적 OG 메타
4. `components/result/share-buttons.tsx` — 카카오 SDK + 트위터 + 링크 복사 개선
5. 검증: SNS 미리보기 디버거용 curl 테스트

## M6: PDF 다운로드
1. `components/result/pdf-download-button.tsx` — window.print 기반
2. `app/globals.css` — @media print 스타일
3. 프리미엄 결과 페이지에 PDF 버튼 연결

## 완료 기준
- `npx tsc --noEmit` 에러 0건
- `npm run build` 성공
- git commit + push
