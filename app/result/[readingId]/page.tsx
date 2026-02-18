import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PageTracker } from '@/components/common/page-tracker';
import { ShareActions } from '@/components/result/share-actions';

type ResultPageProps = {
  params: Promise<{ readingId: string }>;
};

export async function generateMetadata({ params }: ResultPageProps) {
  const { readingId } = await params;
  return {
    title: `사주 결과 (${readingId.slice(0, 8)})`,
  };
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { readingId } = await params;

  const reading = await prisma.reading.findUnique({
    where: {
      id: readingId,
    },
    include: {
      profile: true,
      mbtiProfile: true,
      sections: {
        orderBy: {
          displayOrder: 'asc',
        },
      },
      orders: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
  });

  if (!reading) {
    notFound();
  }

  const isPremiumLocked = reading.mode === 'PREMIUM' && reading.status !== 'COMPLETED';
  const sectionsToRender = isPremiumLocked ? reading.sections.slice(0, 2) : reading.sections;

  return (
    <section className="section">
      <PageTracker eventName="result_viewed" readingId={reading.id} metadata={{ status: reading.status }} />
      <div className="container grid" style={{ gap: '1rem' }}>
        <article className="card card-pad">
          <p className="eyebrow">Result</p>
          <h1 className="section-title" style={{ marginBottom: '0.55rem' }}>
            {reading.profile.name}님의 사주 리딩 결과
          </h1>
          <p className="section-copy" style={{ marginBottom: '0.5rem' }}>
            모드: {reading.mode} · 상태: {reading.status}
            {reading.mbtiProfile ? ` · MBTI: ${reading.mbtiProfile.mbtiType}` : ' · MBTI: 미입력'}
          </p>

          <div className="share-row" style={{ marginTop: '0.8rem' }}>
            <Link className="btn-secondary" href="/quick">
              무료 리딩 다시 만들기
            </Link>
            {reading.mode === 'QUICK' ? (
              <Link className="btn" href="/premium/20022">
                프리미엄으로 확장
              </Link>
            ) : null}
          </div>
        </article>

        {reading.status === 'PROCESSING' ? (
          <article className="card card-pad">
            <p className="notice">
              코드 적용 또는 결제 확인이 처리 중입니다.{' '}
              <Link className="inline-link" href={`/processing?readingId=${reading.id}`}>
                처리 페이지로 이동
              </Link>
            </p>
          </article>
        ) : null}

        {isPremiumLocked ? (
          <article className="card card-pad">
            <p className="notice">
              프리미엄 전체 결과는 결제 완료 후 열람됩니다.{' '}
              <Link className="inline-link" href={`/checkout/${reading.id}`}>
                결제 페이지로 이동
              </Link>
            </p>
          </article>
        ) : null}

        <div className="result-grid">
          <div className="grid" style={{ gap: '0.8rem' }}>
            {sectionsToRender.map((section) => (
              <section className="result-section" key={section.id}>
                <h3>{section.title}</h3>
                <pre>{section.content}</pre>
              </section>
            ))}
          </div>

          <aside className="result-side">
            <div className="kpi">
              <p className="label" style={{ marginBottom: 0 }}>
                핵심 요약
              </p>
              <p>{reading.previewText || '핵심 요약이 아직 생성되지 않았습니다.'}</p>
            </div>

            <div className="card card-pad">
              <p className="label" style={{ marginBottom: '0.4rem' }}>
                공유
              </p>
              <ShareActions readingId={reading.id} />
            </div>

            <div className="card card-pad">
              <p className="label" style={{ marginBottom: '0.4rem' }}>
                결제 정보
              </p>
              {reading.orders[0] ? (
                <p className="helper">
                  최근 주문 상태: <strong>{reading.orders[0].status}</strong>
                </p>
              ) : (
                <p className="helper">주문 내역이 없습니다.</p>
              )}
              <Link className="inline-link" href="/mypage" style={{ marginTop: '0.5rem', display: 'inline-block' }}>
                마이페이지에서 전체 내역 보기
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
