import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  AUTH_SECRET: z.string().min(16, 'AUTH_SECRET must be at least 16 characters'),
  AUTH_URL: z.string().optional(),
  IMAGEKIT_PRIVATE_KEY: z.string().min(1, 'IMAGEKIT_PRIVATE_KEY is required'),
  IMAGEKIT_PUBLIC_KEY: z.string().min(1, 'IMAGEKIT_PUBLIC_KEY is required'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_POOL_MAX: z.string().optional(),
  VERCEL: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>

let validatedEnv: Env | null = null

export function getEnv(): Env {
  if (validatedEnv) return validatedEnv

  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    const missing = result.error.issues
      .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
      .join('\n')
    throw new Error(`Environment variable validation failed:\n${missing}`)
  }

  validatedEnv = result.data
  return validatedEnv
}

export function requireEnv(key: keyof Env): string {
  const env = getEnv()
  const value = env[key]
  if (!value) throw new Error(`Missing required environment variable: ${String(key)}`)
  return String(value)
}
