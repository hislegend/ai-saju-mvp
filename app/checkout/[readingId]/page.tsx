import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getProductBySlug } from '@/lib/products';
import { CheckoutActions } from '@/components/forms/checkout-actions';
import { PageTracker } from '@/components/common/page-tracker';

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
    where: {
      id: readingId,
    },
    include: {
      profile: true,
      orders: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 3,
      },
    },
  });

  if (!reading) {
    notFound();
  }

  const product = getProductBySlug(reading.productSlug);

  return (
    <section className="section">
      <PageTracker eventName="landing_view" metadata={{ page: 'checkout', readingId }} />
      <div className="container grid grid-2">
        <article className="card card-pad">
          <p className="eyebrow">Order Summary</p>
          <h1 className="section-title" style={{ marginBottom: '0.6rem' }}>
            {product.title}
          </h1>
          <p className="section-copy" style={{ marginBottom: '0.8rem' }}>
            {reading.profile.name}님의 프리미엄 리딩 생성이 완료되었습니다. 결제 또는 코드 적용 후 결과를 열람할 수
            있습니다.
          </p>

          <div className="grid" style={{ gap: '0.6rem' }}>
            <p>
              <strong>기본 금액:</strong> {toKrw(product.salePrice)}원
            </p>
            <p>
              <strong>리딩 ID:</strong> {reading.id}
            </p>
            <p>
              <strong>상태:</strong> {reading.status}
            </p>
          </div>

          {reading.status === 'COMPLETED' ? (
            <div className="notice" style={{ marginTop: '1rem' }}>
              이미 결제 완료된 리딩입니다.{' '}
              <Link className="inline-link" href={`/result/${reading.id}`}>
                결과 페이지로 이동
              </Link>
            </div>
          ) : null}

          {reading.orders.length > 0 ? (
            <div style={{ marginTop: '1rem' }}>
              <p className="label">최근 주문 이력</p>
              <table className="table">
                <thead>
                  <tr>
                    <th>주문번호</th>
                    <th>상태</th>
                    <th>금액</th>
                  </tr>
                </thead>
                <tbody>
                  {reading.orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.orderNumber}</td>
                      <td>{order.status}</td>
                      <td>{toKrw(order.amount)}원</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </article>

        <CheckoutActions readingId={reading.id} defaultAmount={product.salePrice} />
      </div>
    </section>
  );
}
