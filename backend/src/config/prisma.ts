import { PrismaClient } from '@prisma/client';

// Singleton Prisma client for the whole backend
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log(' Database connected');
  } catch (err) {
    console.error(' Unable to connect to database', err);
    throw err;
  }
};
