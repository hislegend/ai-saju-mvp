import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { getAuthCookieName } from '@/lib/auth';

function randomDigits(length: number) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}

export async function POST() {
  const kakaoId = `kakao-${Date.now()}`;
  const phone = `010${randomDigits(8)}`;

  const user = await prisma.user.create({
    data: {
      kakaoId,
      phone,
      name: '카카오 사용자',
      marketingOptIn: true,
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

  return NextResponse.json({ userId: user.id, name: user.name });
}
