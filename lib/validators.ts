import { z } from 'zod';
import { normalizeMbtiType } from '@/lib/mbti';

const phoneRegex = /^01[0-9]\d{7,8}$/;

export const readingCreateSchema = z.object({
  name: z.string().min(1).max(40),
  gender: z.enum(['male', 'female', 'other']),
  calendarType: z.enum(['solar', 'lunar']),
  birthDate: z.string().regex(/^\d{4}\.\d{2}\.\d{2}$/),
  birthTime: z.string().optional().nullable(),
  timeUnknown: z.boolean(),
  mbtiType: z
    .string()
    .optional()
    .nullable()
    .transform((value) => normalizeMbtiType(value)),
  mbtiConfidence: z.number().min(0).max(1).optional().nullable(),
  additionalAnswers: z.record(z.string(), z.string()).optional().nullable(),
  marketingConsent: z.boolean().default(false),
  sourceUtm: z
    .object({
      source: z.string().optional(),
      medium: z.string().optional(),
      campaign: z.string().optional(),
      term: z.string().optional(),
      content: z.string().optional(),
    })
    .optional()
    .nullable(),
  readingMode: z.enum(['quick', 'premium']).optional(),
  productSlug: z.string().optional().nullable(),
  userId: z.string().optional().nullable(),
});

export const checkoutSchema = z.object({
  paymentMethod: z.enum(['card', 'bank', 'kakao', 'naver', 'mock-card']).default('mock-card'),
  couponCode: z.string().trim().min(4).max(32).optional(),
});

export const redeemSchema = z.object({
  code: z.string().trim().min(4).max(32),
  phone: z.string().trim().regex(phoneRegex, '휴대폰 번호 형식이 올바르지 않습니다.'),
});

export const trackEventSchema = z.object({
  eventName: z.enum([
    'landing_view',
    'form_started',
    'form_submitted',
    'checkout_started',
    'payment_success',
    'result_viewed',
    'share_clicked',
  ]),
  userId: z.string().optional().nullable(),
  readingId: z.string().optional().nullable(),
  utm: z.record(z.string(), z.string()).optional().nullable(),
  device: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional().nullable(),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional().nullable(),
});

export const loginSchema = z.object({
  phone: z.string().trim().regex(phoneRegex),
  password: z.string().min(4).max(64),
  name: z.string().max(40).optional(),
  marketingOptIn: z.boolean().optional(),
});
