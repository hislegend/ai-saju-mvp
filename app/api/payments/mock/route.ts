import { NextRequest, NextResponse } from 'next/server';
import { finalizeOrder } from '@/lib/reading';
import { logEvent } from '@/lib/events';

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get('orderId');
  if (!orderId) {
    return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
  }

  try {
    const result = await finalizeOrder(orderId);

    await logEvent({
      eventName: 'payment_success',
      readingId: result.order.readingId,
      userId: result.order.userId,
      metadata: {
        orderId,
        amount: result.order.amount,
      },
    });

    return NextResponse.redirect(new URL(result.nextPath, request.url));
  } catch {
    return NextResponse.json({ error: 'Failed to confirm payment' }, { status: 500 });
  }
}
