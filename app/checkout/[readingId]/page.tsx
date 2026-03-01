import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PageTracker } from '@/components/common/page-tracker';
import { TossPayButton } from '@/components/checkout/tosspay-button';

type CheckoutPageProps = {
  params: Promise<{ readingId: string }>;
};

function toKrw(value: number) {
  return new Intl.NumberFormat('ko-KR').format(value);
}

export async function generateMetadata({ params }: CheckoutPageProps) {
  const { readingId } = await params;
  return {
    title: `결제 진행 (${readingId.slice(0, 8)})`,
  };
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { readingId } = await params;

  const reading = await prisma.reading.findUnique({
    where: { id: readingId },
    include: {
      profile: true,
    },
  });

  if (!reading) {
    notFound();
  }

  const amount = 9900;

  return (
    <section className="section">
      <PageTracker eventName="checkout_started" readingId={readingId} metadata={{ page: 'checkout-v2' }} />
      <div className="container" style={{ maxWidth: '440px' }}>
        <article className="card card-pad" style={{ display: 'grid', gap: '0.8rem' }}>
          <p className="eyebrow">Premium Checkout</p>
          <h1 className="section-title" style={{ marginBottom: 0 }}>
            프리미엄 사주 결과를 열어보세요
          </h1>
          <p className="section-copy">
            {reading.profile.name}님의 프리미엄 해석이 준비되었습니다. 결제 후 월별 흐름, MBTI 행동 가이드, 상담사
            코멘트 전체를 바로 확인할 수 있습니다.
          </p>

          <div className="notice" style={{ background: '#fff8ec', color: '#7f3b1b' }}>
            결제 금액: <strong>{toKrw(amount)}원</strong> (부가세 포함)
          </div>

          <TossPayButton />

          <Link className="btn-secondary" href={`/result/${reading.id}`}>
            무료 결과 미리보기 보기
          </Link>

          {reading.status === 'COMPLETED' ? (
            <p className="success">
              이미 결제가 완료된 리딩입니다.{' '}
              <Link className="inline-link" href={`/result/${reading.id}`}>
                결과 페이지로 이동
              </Link>
            </p>
          ) : null}
        </article>
      </div>
    </section>
  );
}
