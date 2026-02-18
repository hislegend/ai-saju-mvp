import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { mbtiResolveInputSchema, resolveMbtiFromAnswers } from '@/lib/mbti';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = mbtiResolveInputSchema.parse(body);
    const result = resolveMbtiFromAnswers(parsed.answers);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to resolve MBTI' }, { status: 500 });
  }
}
