import Image from 'next/image';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="home-hero-v2">
      <Image
        src="/characters/cheongun.webp"
        alt="청운 캐릭터"
        fill
        sizes="100vw"
        className="home-hero-image"
        priority
      />
      <div className="home-hero-overlay" />
      <div className="home-hero-content">
        <p className="home-hero-eyebrow">AI SAJU × MBTI</p>
        <h1>AI가 읽어주는 내 사주</h1>
        <p>오늘의 운을 무료로 확인하고, 프리미엄 해석으로 월별 전략까지 이어가세요.</p>
        <Link className="btn" href="/quick">
          무료 1분 사주 체험
        </Link>
      </div>
    </section>
  );
}
