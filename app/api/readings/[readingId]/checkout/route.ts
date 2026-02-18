import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { createCheckoutOrder } from '@/lib/reading';
import { logEvent } from '@/lib/events';
import { checkoutSchema } from '@/lib/validators';

const checkoutErrorMessageByCode: Record<string, string> = {
  READING_NOT_FOUND: '리딩을 찾을 수 없습니다.',
  CHECKOUT_NOT_ALLOWED: '프리미엄 리딩만 결제가 가능합니다.',
  ALREADY_COMPLETED: '이미 결제가 완료된 리딩입니다.',
};

export async function POST(
  request: Request,
  context: { params: Promise<{ readingId: string }> },
) {
  try {
    const { readingId } = await context.params;
    const body = await request.json();
    const parsed = checkoutSchema.parse(body);

    const checkout = await createCheckoutOrder({
      readingId,
      paymentMethod: parsed.paymentMethod,
      couponCode: parsed.couponCode,
    });

    await logEvent({
      eventName: 'checkout_started',
      readingId,
      metadata: {
        paymentMethod: parsed.paymentMethod,
        couponApplied: Boolean(parsed.couponCode),
      },
    });

    return NextResponse.json({
      orderId: checkout.orderId,
      amount: checkout.amount,
      paymentUrl: checkout.paymentUrl,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }

    if (error instanceof Error && checkoutErrorMessageByCode[error.message]) {
      return NextResponse.json({ error: checkoutErrorMessageByCode[error.message] }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to start checkout' }, { status: 500 });
  }
}
