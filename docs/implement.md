# 실행 규칙 (Phase 3)

## 코드 규칙 (동일)
- TypeScript strict, Tailwind CSS, 컴포넌트 components/ 분리
- 'use client' 필요한 곳만

## OG 이미지 API
```typescript
// app/api/og/route.tsx
import { ImageResponse } from 'next/og';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const readingId = searchParams.get('readingId');
  // DB에서 reading fetch → ImageResponse 반환
}
```

## 카카오 SDK (share-buttons.tsx)
```typescript
// NEXT_PUBLIC_KAKAO_JS_KEY가 있을 때만 SDK 로드
if (process.env.NEXT_PUBLIC_KAKAO_JS_KEY) {
  // Kakao.init + Kakao.Share.sendDefault
}
// 없으면 기존 sharer URL 폴백
```

## Git 규칙
- M5 → 커밋, M6 → 커밋
- main 직접 push

## 금지
- lib/ 수정 금지, Prisma 스키마 수정 금지
- 새 npm 패키지 설치 금지 (next/og 내장)
