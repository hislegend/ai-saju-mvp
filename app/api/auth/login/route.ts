import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { ZodError } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAuthCookieName } from '@/lib/auth';
import { loginSchema } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.parse(body);

    const existing = await prisma.user.findUnique({
      where: { phone: parsed.phone },
    });

    if (!existing) {
      const user = await prisma.user.create({
        data: {
          phone: parsed.phone,
          name: parsed.name || '새 사용자',
          passwordHash: await bcrypt.hash(parsed.password, 10),
          marketingOptIn: Boolean(parsed.marketingOptIn),
        },
      });

      const cookieStore = await cookies();
      cookieStore.set(getAuthCookieName(), user.id, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      });

      return NextResponse.json({ userId: user.id, name: user.name, created: true });
    }

    const isPasswordMatch = await bcrypt.compare(parsed.password, existing.passwordHash || '');
    if (!isPasswordMatch) {
      return NextResponse.json({ error: '휴대폰 번호 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set(getAuthCookieName(), existing.id, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.json({ userId: existing.id, name: existing.name, created: false });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}
