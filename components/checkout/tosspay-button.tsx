'use client';

import { ANONYMOUS, loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { useEffect, useRef, useState } from 'react';

type TossPayButtonProps = {
  readingId: string;
  amount: number;
  orderName: string;
};

export function TossPayButton({ readingId, amount, orderName }: TossPayButtonProps) {
  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || '';
  const paymentWidgetRef = useRef<Awaited<ReturnType<Awaited<ReturnType<typeof loadTossPayments>>['widgets']>> | null>(null);
  const [ready, setReady] = useState(false);
  const methodsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!clientKey) return;

    let cancelled = false;

    async function init() {
      const tossPayments = await loadTossPayments(clientKey);
      const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });
      paymentWidgetRef.current = widgets;

      await widgets.setAmount({ currency: 'KRW', value: amount });

      if (methodsRef.current && !cancelled) {
        await widgets.renderPaymentMethods({
          selector: '#payment-methods',
          variantKey: 'DEFAULT',
        });
        if (!cancelled) setReady(true);
      }
    }

    void init();

    return () => { cancelled = true; };
  }, [clientKey, amount]);

  async function handlePay() {
    if (!paymentWidgetRef.current) return;

    const orderId = `SAJU_${readingId.slice(0, 8)}_${Date.now().toString(36)}`;

    try {
      await paymentWidgetRef.current.requestPayment({
        orderId,
        orderName,
        successUrl: `${window.location.origin}/api/payments/confirm`,
        failUrl: `${window.location.origin}/checkout/${readingId}?error=payment_failed`,
      });
    } catch (error) {
      console.log('결제 취소:', error);
    }
  }

  if (!clientKey) {
    return (
      <button type="button" className="btn" onClick={() => window.alert('결제 설정 준비 중입니다.')}>
        결제하기 (준비 중)
      </button>
    );
  }

  return (
    <div>
      <div id="payment-methods" ref={methodsRef} />
      <button
        type="button"
        className="btn"
        onClick={() => void handlePay()}
        disabled={!ready}
        style={{ marginTop: '1rem', width: '100%' }}
      >
        {ready ? `${amount.toLocaleString()}원 결제하기` : '결제 수단 로딩 중...'}
      </button>
    </div>
  );
}
