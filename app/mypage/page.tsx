import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: '마이페이지',
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(value);
}

function toKrw(value: number) {
  return new Intl.NumberFormat('ko-KR').format(value);
}

export default async function MyPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <section className="section">
        <div className="container" style={{ maxWidth: '780px' }}>
          <article className="card card-pad">
            <p className="eyebrow">MyPage</p>
            <h1 className="section-title" style={{ marginBottom: '0.55rem' }}>
              로그인이 필요합니다
            </h1>
            <p className="section-copy" style={{ marginBottom: '0.9rem' }}>
              결제 내역, 리딩 재조회, 리딤 코드 이력은 로그인 사용자에게만 제공됩니다.
            </p>
            <div className="share-row">
              <Link className="btn" href="/login">
                로그인 하러가기
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

  const [readings, orders, redeems] = await Promise.all([
    prisma.reading.findMany({
      where: {
        userId: user.id,
      },
      include: {
        profile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    }),
    prisma.order.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    }),
    prisma.couponRedeem.findMany({
      where: {
        reading: {
          userId: user.id,
        },
      },
      orderBy: {
        redeemedAt: 'desc',
      },
      take: 20,
    }),
  ]);

  return (
    <section className="section">
      <div className="container grid" style={{ gap: '1rem' }}>
        <article className="card card-pad">
          <p className="eyebrow">MyPage</p>
          <h1 className="section-title" style={{ marginBottom: '0.55rem' }}>
            {user.name || '사용자'}님의 내역
          </h1>
          <p className="section-copy">연락처: {user.phone || '-'} · 마케팅 동의: {user.marketingOptIn ? '예' : '아니오'}</p>
        </article>

        <article className="card card-pad">
          <h2 className="section-title" style={{ fontSize: '1.2rem', marginBottom: '0.7rem' }}>
            리딩 목록
          </h2>
          {readings.length === 0 ? (
            <p className="helper">생성된 리딩이 없습니다.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>생성일</th>
                  <th>이름</th>
                  <th>모드/상태</th>
                  <th>이동</th>
                </tr>
              </thead>
              <tbody>
                {readings.map((reading) => (
                  <tr key={reading.id}>
                    <td>{formatDate(reading.createdAt)}</td>
                    <td>{reading.profile.name}</td>
                    <td>
                      {reading.mode} / {reading.status}
                    </td>
                    <td>
                      <Link className="inline-link" href={`/result/${reading.id}`}>
                        결과 보기
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </article>

        <article className="card card-pad">
          <h2 className="section-title" style={{ fontSize: '1.2rem', marginBottom: '0.7rem' }}>
            결제 내역
          </h2>
          {orders.length === 0 ? (
            <p className="helper">주문 내역이 없습니다.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>생성일</th>
                  <th>주문번호</th>
                  <th>상태</th>
                  <th>금액</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{order.orderNumber}</td>
                    <td>{order.status}</td>
                    <td>{toKrw(order.amount)}원</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </article>

        <article className="card card-pad">
          <h2 className="section-title" style={{ fontSize: '1.2rem', marginBottom: '0.7rem' }}>
            리딤 코드 이력
          </h2>
          {redeems.length === 0 ? (
            <p className="helper">사용한 리딤 코드가 없습니다.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>사용일</th>
                  <th>코드</th>
                  <th>휴대폰</th>
                  <th>결과</th>
                </tr>
              </thead>
              <tbody>
                {redeems.map((redeem) => (
                  <tr key={redeem.id}>
                    <td>{formatDate(redeem.redeemedAt)}</td>
                    <td>{redeem.code}</td>
                    <td>{redeem.phone}</td>
                    <td>
                      {redeem.readingId ? (
                        <Link className="inline-link" href={`/result/${redeem.readingId}`}>
                          결과 이동
                        </Link>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </article>
      </div>
    </section>
  );
}
