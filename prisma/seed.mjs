import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcryptjs';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const passwordHash = await bcrypt.hash('demo1234', 10);

  const demoUser = await prisma.user.upsert({
    where: { phone: '01012341234' },
    update: {},
    create: {
      name: '데모 사용자',
      phone: '01012341234',
      passwordHash,
      marketingOptIn: true,
    },
  });

  const coupons = [
    {
      code: 'WELCOME2026',
      phone: null,
      discountAmount: 3000,
      maxUses: 9999,
      active: true,
      expiresAt: new Date('2026-12-31T23:59:59.000Z'),
    },
    {
      code: 'VIP70004',
      phone: '01012341234',
      discountAmount: 5000,
      maxUses: 1,
      active: true,
      expiresAt: new Date('2026-10-31T23:59:59.000Z'),
    },
  ];

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: coupon,
      create: coupon,
    });
  }

  await prisma.eventLog.create({
    data: {
      userId: demoUser.id,
      eventName: 'seed_initialized',
      metadata: {
        note: 'Initial seed completed',
      },
    },
  });

  console.log('Seed completed: demo user + coupons');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
