'use client';

import { FormEvent, useState } from 'react';

type CheckoutActionsProps = {
  readingId: string;
  defaultAmount: number;
};

function toKrw(value: number) {
  return new Intl.NumberFormat('ko-KR').format(value);
}

export function CheckoutActions({ readingId, defaultAmount }: CheckoutActionsProps) {
  const [paymentMethod, setPaymentMethod] = useState<'mock-card' | 'card' | 'kakao' | 'bank'>('mock-card');
  const [couponCode, setCouponCode] = useState('');
  const [redeemCode, setRedeemCode] = useState('');
  const [phone, setPhone] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function submitCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setCheckoutLoading(true);

    try {
      const response = await fetch(`/api/readings/${readingId}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethod,
          couponCode: couponCode || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || '결제 요청 생성에 실패했습니다.');
        return;
      }

      setSuccess(`결제 금액 ${toKrw(data.amount)}원으로 결제를 진행합니다.`);
      window.location.assign(data.paymentUrl);
    } catch {
      setError('결제 요청 중 네트워크 오류가 발생했습니다.');
    } finally {
      setCheckoutLoading(false);
    }
  }

  async function submitRedeem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setRedeemLoading(true);

    try {
      const response = await fetch(`/api/readings/${readingId}/redeem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: redeemCode,
          phone,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || '코드 사용에 실패했습니다.');
        return;
      }

      setSuccess('코드가 적용되었습니다. 처리 페이지로 이동합니다.');
      window.location.assign(data.nextPath);
    } catch {
      setError('코드 사용 처리 중 오류가 발생했습니다.');
    } finally {
      setRedeemLoading(false);
    }
  }

  return (
    <div className="grid">
      <section className="card card-pad">
        <p className="eyebrow">Checkout</p>
        <h2 className="section-title" style={{ marginBottom: '0.45rem' }}>
          결제 진행
        </h2>
        <p className="helper" style={{ marginBottom: '0.8rem' }}>
          기본 금액 {toKrw(defaultAmount)}원
        </p>

        <form className="reading-form" onSubmit={submitCheckout}>
          <div className="form-group">
            <label className="label" htmlFor="paymentMethod">
              결제 수단
            </label>
            <select
              id="paymentMethod"
              className="select"
              value={paymentMethod}
              onChange={(event) =>
                setPaymentMethod(event.target.value as 'mock-card' | 'card' | 'kakao' | 'bank')
              }
            >
              <option value="mock-card">모의 카드결제</option>
              <option value="card">카드</option>
              <option value="kakao">카카오페이</option>
              <option value="bank">계좌이체</option>
            </select>
          </div>

          <div className="form-group">
            <label className="label" htmlFor="couponCode">
              쿠폰 코드 (선택)
            </label>
            <input
              id="couponCode"
              className="input"
              type="text"
              placeholder="WELCOME2026"
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value.trim().toUpperCase())}
            />
          </div>

          <button className="btn" type="submit" disabled={checkoutLoading}>
            {checkoutLoading ? '결제 요청 생성 중...' : '결제 페이지 이동'}
          </button>
        </form>
      </section>

      <section className="card card-pad">
        <p className="eyebrow">Redeem</p>
        <h3 className="section-title" style={{ fontSize: '1.2rem', marginBottom: '0.45rem' }}>
          리딤 코드 사용
        </h3>

        <form className="reading-form" onSubmit={submitRedeem}>
          <div className="form-group">
            <label className="label" htmlFor="redeemCode">
              코드
            </label>
            <input
              id="redeemCode"
              className="input"
              type="text"
              placeholder="VIP70004"
              value={redeemCode}
              onChange={(event) => setRedeemCode(event.target.value.trim().toUpperCase())}
              required
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="phone">
              휴대폰 번호
            </label>
            <input
              id="phone"
              className="input"
              type="tel"
              placeholder="01012341234"
              value={phone}
              onChange={(event) => setPhone(event.target.value.replace(/[^0-9]/g, ''))}
              required
            />
          </div>

          <button className="btn-secondary" type="submit" disabled={redeemLoading}>
            {redeemLoading ? '코드 확인 중...' : '코드 적용 후 진행'}
          </button>
        </form>
      </section>

      {error ? <p className="error">{error}</p> : null}
      {success ? <p className="success">{success}</p> : null}
    </div>
  );
}
