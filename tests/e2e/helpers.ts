import { readFileSync } from 'node:fs'
import { expect, type Page } from '@playwright/test'

export type Fixture = {
  tryoutExamId: string
  finalExamId: string
  oldCheapBatchId: string
  olimpiadeId: string
  teamIds: {
    approved: string
    pending: string
    infografis: string
    unregistered: string
  }
}

export const ACCOUNTS = {
  admin: { email: 'admin-audit@example.test', password: 'AuditAdmin#2026' },
  approved: { email: 'team-approved@example.test', password: 'TeamAudit#2026' },
  pending: { email: 'team-pending@example.test', password: 'TeamAudit#2026' },
  infografis: { email: 'team-infografis@example.test', password: 'TeamAudit#2026' },
  unregistered: { email: 'team-unregistered@example.test', password: 'TeamAudit#2026' },
} as const

export function loadFixture(): Fixture {
  return JSON.parse(readFileSync(new URL('../../audit/fixture.json', import.meta.url), 'utf8'))
}

export async function login(page: Page, who: keyof typeof ACCOUNTS) {
  const { email, password } = ACCOUNTS[who]
  await page.goto('/auth/login')
  await page.locator('#email').fill(email)
  await page.locator('#password').fill(password)
  await page.getByRole('button', { name: /^Masuk/ }).click()
  await expect(page).toHaveURL(/\/dashboard|\/auth\/register/, { timeout: 20_000 })
}

export type ServerFnResult<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; message?: string; code?: string; status?: number }

/**
 * Calls a real TanStack Start server function through the dev server's
 * RPC endpoint, using the page's authenticated cookie jar.
 * The page must already be on an app origin (e.g. after login()).
 */
export async function callServerFn<T = any>(
  page: Page,
  modulePath: string,
  fnName: string,
  data?: unknown,
): Promise<ServerFnResult<T>> {
  return page.evaluate(
    async ({ modulePath, fnName, data }) => {
      try {
        const mod = await import(/* @vite-ignore */ modulePath)
        const result = await mod[fnName](data === undefined ? undefined : { data })
        return { ok: true as const, data: result }
      } catch (e: any) {
        return {
          ok: false as const,
          message: e?.message,
          code: e?.code,
          status: e?.status ?? e?.statusCode,
        }
      }
    },
    { modulePath, fnName, data },
  )
}
