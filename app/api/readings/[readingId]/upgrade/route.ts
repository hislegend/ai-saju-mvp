import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 테스트 모드: 결제 없이 프리미엄으로 업그레이드
export async function POST(
  _request: Request,
  context: { params: Promise<{ readingId: string }> },
) {
  try {
    const { readingId } = await context.params;

    const reading = await prisma.reading.findUnique({
      where: { id: readingId },
    });

    if (!reading) {
      return NextResponse.json({ error: 'Reading not found' }, { status: 404 });
    }

    // mode를 PREMIUM으로 업데이트
    await prisma.reading.update({
      where: { id: readingId },
      data: { mode: 'PREMIUM' },
    });

    return NextResponse.json({ status: 'upgraded', readingId });
  } catch (error) {
    console.error('Upgrade error:', error);
    return NextResponse.json({ error: 'Failed to upgrade' }, { status: 500 });
  }
}
