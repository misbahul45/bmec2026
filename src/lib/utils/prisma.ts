import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!
const configuredPoolMax = Number.parseInt(process.env.DATABASE_POOL_MAX ?? '5', 10)
const poolMax = Number.isFinite(configuredPoolMax)
  ? Math.min(10, Math.max(2, configuredPoolMax))
  : 5

function createPrismaClient() {
  if (
    process.env.NODE_ENV === 'production' &&
    connectionString.includes('.neon.tech') &&
    !connectionString.includes('-pooler.')
  ) {
    console.warn('[database] DATABASE_URL Neon belum menggunakan pooled hostname (-pooler).')
  }

  const adapter = new PrismaPg({
    connectionString,
    max: poolMax,
    connectionTimeoutMillis: 5_000,
    idleTimeoutMillis: 20_000,
  })

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

declare global {
  var __prisma: PrismaClient | undefined;
}

export const prisma = globalThis.__prisma ?? createPrismaClient()

globalThis.__prisma = prisma
