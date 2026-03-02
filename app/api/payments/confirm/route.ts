/**
 * 토스페이먼츠 결제 승인 API
 * GET /api/payments/confirm?paymentKey=...&orderId=...&amount=...
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { confirmPayment } from '@/lib/payment';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = Number(searchParams.get('amount'));

  if (!paymentKey || !orderId || !amount) {
    return NextResponse.redirect(new URL('/fail?reason=missing_params', request.url));
  }

  try {
    const paymentResult = await confirmPayment(paymentKey, orderId, amount);

    // orderNumber로 Order 찾기
    const order = await prisma.order.findUnique({
      where: { orderNumber: orderId },
    });

    if (order) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'PAID',
          pgTransactionId: paymentKey,
        },
      });

      await prisma.reading.update({
        where: { id: order.readingId },
        data: { status: 'COMPLETED' },
      });

      return NextResponse.redirect(new URL(`/result/${order.readingId}`, request.url));
    }

    // Order가 없으면 readingId prefix로 Reading 직접 업데이트
    const readingIdPrefix = orderId.split('_')[1] || '';
    const reading = await prisma.reading.findFirst({
      where: {
        id: { startsWith: readingIdPrefix },
        status: 'REQUIRES_PAYMENT',
      },
      orderBy: { createdAt: 'desc' },
    });

    if (reading) {
      await prisma.reading.update({
        where: { id: reading.id },
        data: { status: 'COMPLETED' },
      });
      return NextResponse.redirect(new URL(`/result/${reading.id}`, request.url));
    }

    return NextResponse.redirect(new URL('/fail?reason=order_not_found', request.url));
  } catch (error) {
    console.error('결제 승인 실패:', error);
    return NextResponse.redirect(new URL('/fail?reason=confirm_failed', request.url));
  }
}
