import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand-mark" aria-label="홈">
          AI SAJU LAB
        </Link>
        <nav className="site-nav" aria-label="주요 메뉴">
          <Link href="/quick">무료 1분 사주</Link>
          <Link href="/premium/20022">프리미엄</Link>
          <Link href="/mypage">마이페이지</Link>
          <Link href="/login">로그인</Link>
        </nav>
      </div>
    </header>
  );
}
