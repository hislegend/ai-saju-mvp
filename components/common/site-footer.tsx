import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <p className="footer-brand">AI SAJU LAB</p>
          <p className="footer-copy">사주는 참고용 콘텐츠이며, 의료·법률·투자 자문을 대체하지 않습니다.</p>
        </div>
        <div className="footer-copy" style={{ display: 'grid', gap: '0.35rem' }}>
          <Link className="inline-link" href="https://ktestone.com/terms" target="_blank" rel="noreferrer">
            벤치마크 참고 약관
          </Link>
          <Link className="inline-link" href="https://ktestone.com/privacy" target="_blank" rel="noreferrer">
            벤치마크 참고 개인정보처리방침
          </Link>
          <p>© 2026 AI SAJU LAB. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
