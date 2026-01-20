import { PrismaClient } from '@prisma/client';

// Shim: export Prisma client and placeholders so app routes work without Firebase
const prisma = new PrismaClient();

export const adminAuth: any = null;
export const adminDb: any = null;
export const adminStorage: any = null;
export { prisma };
