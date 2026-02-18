import { prisma } from '@/lib/prisma';

export async function logEvent(input: {
  eventName: string;
  userId?: string | null;
  readingId?: string | null;
  utm?: Record<string, string> | null;
  device?: Record<string, string | number | boolean> | null;
  metadata?: Record<string, string | number | boolean> | null;
}) {
  await prisma.eventLog.create({
    data: {
      eventName: input.eventName,
      userId: input.userId || null,
      readingId: input.readingId || null,
      utm: input.utm || undefined,
      device: input.device || undefined,
      metadata: input.metadata || undefined,
    },
  });
}
