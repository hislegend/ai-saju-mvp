# AI 사주 서비스 MVP (웹 우선)

MBTI 해석 톤 개인화를 결합한 사주 서비스 MVP입니다.

## 핵심 구현 범위
- 무료 진입 퍼널: `/` → `/quick` → `/result/:readingId`
- 유료 퍼널: `/premium/:slug` → `/checkout/:readingId` → `/processing` → `/result/:readingId`
- 재조회/내역: `/mypage`
- 인증: 휴대폰 로그인 + 카카오 모의 로그인 API
- MBTI 차별화: 직접 입력 + 4문항 간이 진단(`/api/mbti/resolve`) 후 결과 톤 개인화

## 페이지 IA
- `/` 메인 랜딩
- `/quick` 무료 1분 사주
- `/premium/:slug` 프리미엄 랜딩
- `/checkout/:readingId` 결제/코드 리딤
- `/processing` 처리 대기
- `/result/:readingId` 결과 페이지
- `/mypage` 내역/재조회
- `/login` 로그인

## API 스펙(MVP)
- `POST /api/readings`
  - 입력: `name, gender, calendarType, birthDate, birthTime?, timeUnknown, mbtiType?, mbtiConfidence?, additionalAnswers?, marketingConsent, sourceUtm, readingMode, productSlug?`
  - 출력: `readingId, status(created|requires_payment), nextPath`
- `POST /api/readings/{readingId}/checkout`
  - 입력: `paymentMethod, couponCode?`
  - 출력: `orderId, amount, paymentUrl`
- `POST /api/readings/{readingId}/redeem`
  - 입력: `code, phone`
  - 출력: `redeemed, nextPath`
- `POST /api/mbti/resolve`
  - 입력: `answers[4]`
  - 출력: `mbtiType, confidence`
- `POST /api/events/track`
  - 이벤트: `landing_view, form_started, form_submitted, checkout_started, payment_success, result_viewed, share_clicked`

## 로컬 실행
### 1) 설치
```bash
npm install
```

### 2) Prisma Client 생성
```bash
npm run prisma:generate
```

### 3) SQLite 스키마 초기화
```bash
npm run db:init
```

### 4) 시드 데이터 주입
```bash
npm run prisma:seed
```

### 5) 개발 서버 실행
```bash
npm run dev
```

브라우저: [http://localhost:3000](http://localhost:3000)

## 데모 계정/코드
- 데모 계정
  - phone: `01012341234`
  - password: `demo1234`
- 쿠폰
  - `WELCOME2026`
  - `VIP70004` (데모 번호 한정)

## 기술 스택
- Next.js 16 (App Router)
- TypeScript
- Prisma + SQLite
- Zod
- bcryptjs

## 데이터 모델
- `users`, `profiles`, `mbti_profiles`, `readings`, `reading_sections`, `orders`, `coupons`, `coupon_redeems`, `event_logs`

## 참고
- 현재 `build/dev` 스크립트는 경로 유니코드 이슈 회피를 위해 webpack 모드로 고정되어 있습니다.
