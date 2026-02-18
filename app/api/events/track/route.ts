import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { logEvent } from '@/lib/events';
import { trackEventSchema } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = trackEventSchema.parse(body);

    await logEvent({
      eventName: parsed.eventName,
      userId: parsed.userId,
      readingId: parsed.readingId,
      utm: parsed.utm || undefined,
      device: parsed.device || undefined,
      metadata: parsed.metadata || undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }
}
