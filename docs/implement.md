# 실행 규칙 (Phase 2)

## 코드 규칙 (동일)
- TypeScript strict, Tailwind CSS, 컴포넌트는 components/ 분리
- 'use client' 필요한 곳만, 한국어 하드코딩 OK

## 스타일 가이드 (동일)
- 모바일 퍼스트: max-w-md mx-auto
- 다크 배경 + 골드 액센트 + 블러 카드

## 이미지 참조
- 캐릭터: /characters/cheongun.webp, /characters/seyeon.webp, /characters/hwaryeon.webp
- PNG 삭제됨 — 반드시 .webp 참조

## API 호출 (ReadingForm에서)
```typescript
const res = await fetch('/api/readings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name, gender, calendarType, birthDate, birthTime,
    timeUnknown, mbtiType, readingMode, productSlug,
    marketingConsent: false,
  }),
});
const { readingId, status, nextPath } = await res.json();
// nextPath로 리다이렉트
```

gender: "male" | "female" | "other" (소문자)
calendarType: "solar" | "lunar" (소문자)
readingMode: "quick" | "premium"
productSlug: "quick-free" (무료) | "20022" (프리미엄)

## Git 규칙
- 커밋 메시지: feat: [작업내용]
- M3 완료 → 커밋, M4 완료 → 커밋
- main 브랜치 직접 push

## 금지
- lib/ 수정 금지, Prisma 스키마 수정 금지
- 새 npm 패키지 설치 시 사전 확인
