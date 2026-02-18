import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { redeemReadingCode } from '@/lib/reading';
import { redeemSchema } from '@/lib/validators';

const errorMessageByCode: Record<string, string> = {
  READING_NOT_FOUND: '리딩을 찾을 수 없습니다.',
  INVALID_CODE: '유효하지 않은 코드입니다.',
  PHONE_MISMATCH: '코드에 등록된 번호와 일치하지 않습니다.',
  EXPIRED_CODE: '만료된 코드입니다.',
  CODE_ALREADY_USED: '이미 사용된 코드입니다.',
};

export async function POST(
  request: Request,
  context: { params: Promise<{ readingId: string }> },
) {
  try {
    const { readingId } = await context.params;
    const body = await request.json();
    const parsed = redeemSchema.parse(body);

    const redeemed = await redeemReadingCode({
      readingId,
      code: parsed.code,
      phone: parsed.phone,
    });

    return NextResponse.json(redeemed);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }

    if (error instanceof Error && errorMessageByCode[error.message]) {
      return NextResponse.json({ error: errorMessageByCode[error.message] }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to redeem code' }, { status: 500 });
  }
}
