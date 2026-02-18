import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'saju_user_id';

export function getAuthCookieName() {
  return AUTH_COOKIE_NAME;
}

export async function getCurrentUserId() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value || null;
}

export async function getCurrentUser() {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
  });
}
