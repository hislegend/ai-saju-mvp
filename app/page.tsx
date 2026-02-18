import Link from 'next/link';
import { SocialProofTicker } from '@/components/common/social-proof-ticker';
import { CountdownBanner } from '@/components/common/countdown-banner';
import { PageTracker } from '@/components/common/page-tracker';
import { PREMIUM_PRODUCTS } from '@/lib/products';

function toKrw(value: number) {
  return new Intl.NumberFormat('ko-KR').format(value);
}

export default function HomePage() {
  const premiumA = PREMIUM_PRODUCTS['20022'];
  const premiumB = PREMIUM_PRODUCTS['70004'];

  return (
    <>
      <PageTracker eventName="landing_view" metadata={{ page: 'home' }} />
      <SocialProofTicker />

      <section className="hero">
        <div className="container hero-shell">
          <div>
            <p className="eyebrow">AI Saju + MBTI Personalization</p>
            <h1 className="hero-title">무료 유입형 사주 퍼널에 MBTI 해석 톤을 결합한 전환형 MVP</h1>
            <p className="hero-copy">
              무료 1분 사주로 진입 장벽을 낮추고, 유료 상세 리포트로 자연스럽게 전환됩니다. 같은 사주 데이터라도
              MBTI별 말투와 실행 가이드가 달라져 재방문과 공유율을 끌어올립니다.
            </p>
            <div className="hero-cta">
              <Link className="btn" href="/quick">
                무료 1분 사주 시작
              </Link>
              <Link className="btn-secondary" href={`/premium/${premiumA.slug}`}>
                프리미엄 리포트 보기
              </Link>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <p className="helper">핵심 BM 구조</p>
              <p className="stat-value">무료 + 광고 + 유료 업셀</p>
            </div>
            <div className="stat-card">
              <p className="helper">차별화 포인트</p>
              <p className="stat-value">MBTI 톤 개인화</p>
            </div>
            <CountdownBanner hours={24} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-3">
          <article className="card card-pad">
            <p className="badge">FREE ENTRY</p>
            <h2 className="section-title" style={{ fontSize: '1.2rem', marginTop: '0.65rem' }}>
              무료 1분 사주
            </h2>
            <p className="section-copy">입력 즉시 핵심 요약을 제공합니다. 결과 페이지에서 프리미엄으로 업셀됩니다.</p>
            <ul className="list-clean" style={{ marginTop: '0.8rem' }}>
              <li>폼 최소화: 이름/성별/생년월일/시간</li>
              <li>공유 CTA + 이벤트 추적 내장</li>
              <li>MBTI 미입력 시 4문항 간이 진단 제공</li>
            </ul>
            <Link className="btn" href="/quick" style={{ marginTop: '1rem' }}>
              무료로 시작
            </Link>
          </article>

          <article className="card card-pad">
            <p className="badge">PREMIUM A</p>
            <h2 className="section-title" style={{ fontSize: '1.2rem', marginTop: '0.65rem' }}>
              {premiumA.title}
            </h2>
            <p className="section-copy">정가 {toKrw(premiumA.price)}원 → 할인가 {toKrw(premiumA.salePrice)}원</p>
            <ul className="list-clean" style={{ marginTop: '0.8rem' }}>
              {premiumA.content.map((item) => (
                <li key={item.id}>{item.title}</li>
              ))}
            </ul>
            <Link className="btn" href={`/premium/${premiumA.slug}`} style={{ marginTop: '1rem' }}>
              상세 보기
            </Link>
          </article>

          <article className="card card-pad">
            <p className="badge">PREMIUM B</p>
            <h2 className="section-title" style={{ fontSize: '1.2rem', marginTop: '0.65rem' }}>
              {premiumB.title}
            </h2>
            <p className="section-copy">정가 {toKrw(premiumB.price)}원 → 할인가 {toKrw(premiumB.salePrice)}원</p>
            <ul className="list-clean" style={{ marginTop: '0.8rem' }}>
              {premiumB.content.map((item) => (
                <li key={item.id}>{item.title}</li>
              ))}
            </ul>
            <Link className="btn" href={`/premium/${premiumB.slug}`} style={{ marginTop: '1rem' }}>
              상세 보기
            </Link>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">MVP IA</p>
          <h2 className="section-title">구현된 퍼널 구조</h2>
          <div className="timeline">
            <div className="timeline-step">
              <strong>1) /quick</strong> 무료 사주 생성 및 공유 유도
            </div>
            <div className="timeline-step">
              <strong>2) /premium/:slug</strong> 긴 스토리텔링 랜딩 + 입력 폼 + 결제 진입
            </div>
            <div className="timeline-step">
              <strong>3) /checkout/:readingId</strong> 결제 또는 리딤 코드 전환
            </div>
            <div className="timeline-step">
              <strong>4) /result/:readingId</strong> 공통 사주 + MBTI 개인화 실행 가이드 제공
            </div>
            <div className="timeline-step">
              <strong>5) /mypage</strong> 재조회/결제내역/로그인 사용자 동선 제공
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
