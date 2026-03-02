import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

declare global {
  var __prisma__: PrismaClient | undefined;
}

const connectionString = process.env.DATABASE_URL || '';
const adapter = new PrismaPg(connectionString);

export const prisma =
  global.__prisma__ ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.__prisma__ = prisma;
}
