import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!

const adapter = new PrismaPg({
  connectionString,
  max: 1,
})

declare global {
  var __prisma: PrismaClient | undefined;
}

export const prisma = globalThis.__prisma || new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}