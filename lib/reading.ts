import {
  CalendarType,
  Gender,
  OrderStatus,
  ReadingMode,
  ReadingStatus,
} from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { buildReadingSections } from '@/lib/saju-engine';
import { getProductBySlug } from '@/lib/products';

function parseBirthDate(value: string) {
  const [year, month, day] = value.split('.').map((v) => Number(v));
  return new Date(Date.UTC(year, month - 1, day));
}

function normalizeGender(value: 'male' | 'female' | 'other'): Gender {
  if (value === 'male') return Gender.MALE;
  if (value === 'female') return Gender.FEMALE;
  return Gender.OTHER;
}

function normalizeCalendarType(value: 'solar' | 'lunar'): CalendarType {
  return value === 'solar' ? CalendarType.SOLAR : CalendarType.LUNAR;
}

function randomOrderNumber() {
  const timestamp = Date.now().toString().slice(-8);
  const rand = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, '0');
  return `ORD-${timestamp}-${rand}`;
}

export async function createReadingWithSections(input: {
  name: string;
  gender: 'male' | 'female' | 'other';
  calendarType: 'solar' | 'lunar';
  birthDate: string;
  birthTime?: string | null;
  timeUnknown: boolean;
  mbtiType?: string | null;
  mbtiConfidence?: number | null;
  additionalAnswers?: Record<string, string> | null;
  marketingConsent: boolean;
  sourceUtm?: Record<string, string> | null;
  readingMode?: 'quick' | 'premium';
  productSlug?: string | null;
  userId?: string | null;
}) {
  const mode = input.readingMode === 'premium' ? ReadingMode.PREMIUM : ReadingMode.QUICK;
  const product = getProductBySlug(input.productSlug);

  const profile = await prisma.profile.create({
    data: {
      userId: input.userId || null,
      name: input.name,
      gender: normalizeGender(input.gender),
      calendarType: normalizeCalendarType(input.calendarType),
      birthDate: parseBirthDate(input.birthDate),
      birthTime: input.birthTime || null,
      timeUnknown: input.timeUnknown,
      isPrimary: true,
    },
  });

  const mbtiProfile = input.mbtiType
    ? await prisma.mbtiProfile.create({
        data: {
          userId: input.userId || null,
          profileId: profile.id,
          mbtiType: input.mbtiType,
          confidence: input.mbtiConfidence || 0.95,
          source: input.additionalAnswers ? 'resolved-mini-quiz' : 'direct',
          answers: input.additionalAnswers || undefined,
        },
      })
    : null;

  const sections = buildReadingSections({
    name: input.name,
    gender: normalizeGender(input.gender),
    calendarType: normalizeCalendarType(input.calendarType),
    birthDate: input.birthDate,
    birthTime: input.birthTime,
    timeUnknown: input.timeUnknown,
    mbtiType: input.mbtiType,
    mode,
  });

  const status = mode === ReadingMode.PREMIUM ? ReadingStatus.REQUIRES_PAYMENT : ReadingStatus.CREATED;

  const reading = await prisma.reading.create({
    data: {
      userId: input.userId || null,
      profileId: profile.id,
      mbtiProfileId: mbtiProfile?.id,
      mode,
      productSlug: mode === ReadingMode.PREMIUM ? product.slug : 'quick-free',
      status,
      marketingConsent: input.marketingConsent,
      sourceUtm: input.sourceUtm || undefined,
      previewText: sections[0]?.content || null,
      sections: {
        create: sections,
      },
    },
  });

  return {
    reading,
    nextPath: status === ReadingStatus.REQUIRES_PAYMENT ? `/checkout/${reading.id}` : `/result/${reading.id}`,
  };
}

export async function createCheckoutOrder(input: {
  readingId: string;
  paymentMethod: string;
  couponCode?: string;
}) {
  const reading = await prisma.reading.findUnique({
    where: { id: input.readingId },
  });

  if (!reading) {
    throw new Error('READING_NOT_FOUND');
  }

  if (reading.mode !== ReadingMode.PREMIUM) {
    throw new Error('CHECKOUT_NOT_ALLOWED');
  }

  if (reading.status === ReadingStatus.COMPLETED) {
    throw new Error('ALREADY_COMPLETED');
  }

  const product = getProductBySlug(reading.productSlug);
  let amount = product.salePrice;

  if (input.couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: input.couponCode } });

    if (coupon && coupon.active && (!coupon.expiresAt || coupon.expiresAt > new Date())) {
      amount = Math.max(1000, amount - coupon.discountAmount);
    }
  }

  const order = await prisma.order.create({
    data: {
      readingId: reading.id,
      userId: reading.userId,
      orderNumber: randomOrderNumber(),
      paymentMethod: input.paymentMethod,
      couponCode: input.couponCode,
      amount,
      status: OrderStatus.PENDING,
    },
  });

  const paymentUrl = `/api/payments/mock?orderId=${order.id}`;

  await prisma.$transaction([
    prisma.order.update({
      where: { id: order.id },
      data: { paymentUrl },
    }),
    prisma.reading.update({
      where: { id: reading.id },
      data: {
        status: ReadingStatus.REQUIRES_PAYMENT,
      },
    }),
  ]);

  return {
    orderId: order.id,
    amount,
    paymentUrl,
  };
}

export async function redeemReadingCode(input: {
  readingId: string;
  code: string;
  phone: string;
}) {
  const reading = await prisma.reading.findUnique({ where: { id: input.readingId } });
  if (!reading) {
    throw new Error('READING_NOT_FOUND');
  }

  const coupon = await prisma.coupon.findUnique({ where: { code: input.code } });
  if (!coupon || !coupon.active) {
    throw new Error('INVALID_CODE');
  }

  if (coupon.phone && coupon.phone !== input.phone) {
    throw new Error('PHONE_MISMATCH');
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    throw new Error('EXPIRED_CODE');
  }

  if (coupon.usedCount >= coupon.maxUses) {
    throw new Error('CODE_ALREADY_USED');
  }

  const alreadyRedeemed = await prisma.couponRedeem.findUnique({
    where: {
      code_phone: {
        code: input.code,
        phone: input.phone,
      },
    },
  });

  if (alreadyRedeemed) {
    throw new Error('CODE_ALREADY_USED');
  }

  await prisma.$transaction([
    prisma.coupon.update({
      where: { id: coupon.id },
      data: {
        usedCount: {
          increment: 1,
        },
      },
    }),
    prisma.couponRedeem.create({
      data: {
        couponId: coupon.id,
        readingId: reading.id,
        code: input.code,
        phone: input.phone,
        expiresAt: coupon.expiresAt,
      },
    }),
    prisma.reading.update({
      where: { id: reading.id },
      data: {
        status: ReadingStatus.PROCESSING,
      },
    }),
  ]);

  return {
    redeemed: true,
    nextPath: `/processing?readingId=${reading.id}`,
  };
}

export async function finalizeOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      reading: true,
    },
  });

  if (!order) {
    throw new Error('ORDER_NOT_FOUND');
  }

  if (order.status !== OrderStatus.PAID) {
    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.PAID,
          pgTransactionId: `mock-${Date.now()}`,
        },
      }),
      prisma.reading.update({
        where: { id: order.readingId },
        data: {
          status: ReadingStatus.COMPLETED,
        },
      }),
    ]);
  }

  return {
    order,
    nextPath: `/result/${order.readingId}?paid=1`,
  };
}
