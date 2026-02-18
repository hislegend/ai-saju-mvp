import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '760px' }}>
        <article className="card card-pad">
          <p className="eyebrow">404</p>
          <h1 className="section-title" style={{ marginBottom: '0.6rem' }}>
            요청하신 페이지를 찾을 수 없습니다
          </h1>
          <p className="section-copy" style={{ marginBottom: '0.9rem' }}>
            리딩 ID가 만료되었거나 잘못된 주소입니다. 홈에서 다시 생성해 주세요.
          </p>
          <div className="share-row">
            <Link className="btn" href="/">
              홈으로 이동
            </Link>
            <Link className="btn-secondary" href="/quick">
              무료 사주 시작
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
