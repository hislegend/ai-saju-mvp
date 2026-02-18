import { NextResponse } from 'next/server';
import { ZodSchema } from 'zod';

export async function parseJsonBody<T>(request: Request, schema: ZodSchema<T>) {
  const body = await request.json();
  return schema.parse(body);
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
