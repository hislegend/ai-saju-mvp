import Link from 'next/link';
import { ProcessingPoller } from '@/components/common/processing-poller';

export const metadata = {
  title: '결과 처리 중',
};

type ProcessingPageProps = {
  searchParams: Promise<{ readingId?: string }>;
};

export default async function ProcessingPage({ searchParams }: ProcessingPageProps) {
  const { readingId } = await searchParams;

  return (
    <section className="section">
      <div className="container grid" style={{ maxWidth: '760px' }}>
        <article className="card card-pad">
          <p className="eyebrow">Processing</p>
          <h1 className="section-title" style={{ marginBottom: '0.6rem' }}>
            리딩을 준비하고 있습니다
          </h1>
          <p className="section-copy" style={{ marginBottom: '0.8rem' }}>
            결제 승인/코드 확인 후 결과 상태가 반영됩니다. 수초 내 완료되지 않으면 마이페이지에서 다시 조회해 주세요.
          </p>

          {readingId ? <ProcessingPoller readingId={readingId} /> : null}

          <div className="share-row" style={{ marginTop: '1rem' }}>
            {readingId ? (
              <Link className="btn" href={`/result/${readingId}`}>
                지금 결과 확인
              </Link>
            ) : null}
            <Link className="btn-secondary" href="/mypage">
              마이페이지로 이동
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
