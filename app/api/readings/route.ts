import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ZodError } from 'zod';
import { createReadingWithSections } from '@/lib/reading';
import { logEvent } from '@/lib/events';
import { getAuthCookieName } from '@/lib/auth';
import { readingCreateSchema } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = readingCreateSchema.parse(body);

    const cookieStore = await cookies();
    const userIdFromCookie = cookieStore.get(getAuthCookieName())?.value;

    const result = await createReadingWithSections({
      name: parsed.name,
      gender: parsed.gender,
      calendarType: parsed.calendarType,
      birthDate: parsed.birthDate,
      birthTime: parsed.birthTime,
      timeUnknown: parsed.timeUnknown,
      mbtiType: parsed.mbtiType,
      mbtiConfidence: parsed.mbtiConfidence,
      additionalAnswers: parsed.additionalAnswers || null,
      marketingConsent: parsed.marketingConsent,
      sourceUtm: parsed.sourceUtm || null,
      readingMode: parsed.readingMode,
      productSlug: parsed.productSlug,
      userId: parsed.userId || userIdFromCookie || null,
    });

    await logEvent({
      eventName: 'form_submitted',
      userId: parsed.userId || userIdFromCookie || null,
      readingId: result.reading.id,
      utm: parsed.sourceUtm || undefined,
      metadata: {
        mode: parsed.readingMode || 'quick',
      },
    });

    return NextResponse.json({
      readingId: result.reading.id,
      status: result.reading.status === 'REQUIRES_PAYMENT' ? 'requires_payment' : 'created',
      nextPath: result.nextPath,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to create reading' }, { status: 500 });
  }
}
