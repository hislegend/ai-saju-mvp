# 실행 규칙

## 코드 규칙
- TypeScript strict 모드
- Tailwind CSS 사용 (인라인 style 금지)
- 컴포넌트는 `components/` 폴더에 분리
- 'use client' 필요한 곳만 사용 (서버 컴포넌트 우선)
- 한국어 텍스트 하드코딩 OK (i18n 없음)

## 스타일 가이드
- 모바일 퍼스트: `max-w-md mx-auto` 기본 래퍼
- 다크 배경: `bg-[#1A1A2E]` 또는 `bg-gray-900`
- 골드 액센트: `text-amber-400`, `bg-amber-500`
- 카드: `bg-white/10 backdrop-blur rounded-2xl p-4`
- 블러 영역: `filter blur-sm` + absolute 오버레이

## Git 규칙
- 커밋 메시지: `feat: [작업내용]`
- 작업 단위로 커밋 (M1 완료 → 커밋, M2 완료 → 커밋)
- main 브랜치에 직접 push

## 금지 사항
- Prisma 스키마 수정 금지
- lib/ 폴더 수정 금지 (엔도 담당)
- 새 npm 패키지 설치 시 사전 확인
