/**
 * 토스페이먼츠 결제 유틸
 */

export function generateOrderId(readingId: string): string {
  const ts = Date.now().toString(36);
  return `SAJU_${readingId.slice(0, 8)}_${ts}`;
}

export const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || '';
export const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY || '';

export async function confirmPayment(paymentKey: string, orderId: string, amount: number) {
  const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(TOSS_SECRET_KEY + ':').toString('base64')}`,
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '결제 승인 실패');
  }

  return data;
}
