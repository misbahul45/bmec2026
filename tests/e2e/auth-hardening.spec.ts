import { expect, test } from '@playwright/test'
import { ACCOUNTS, callServerFn } from './helpers'

async function attempt(page: import('@playwright/test').Page, email: string, password: string) {
  return callServerFn(page, '/src/server/auth.ts', 'loginFn', { email, password })
}

test.describe('login hardening', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login')
    await page.waitForLoadState('networkidle')
  })

  test('unknown email and wrong password are indistinguishable (no account enumeration)', async ({ page }) => {
    const wrongPassword = await attempt(page, ACCOUNTS.admin.email, 'Wrong#Password1')
    const unknownEmail = await attempt(page, `nobody-${Date.now()}@example.test`, 'Wrong#Password1')

    expect(wrongPassword).toMatchObject({ ok: false, code: 'INVALID_CREDENTIALS', statusCode: 401 })
    expect(unknownEmail).toMatchObject({ ok: false, code: 'INVALID_CREDENTIALS', statusCode: 401 })
    expect((wrongPassword as { message?: string }).message).toBe((unknownEmail as { message?: string }).message)
  })

  test('repeated failures for one email are rate limited', async ({ page }) => {
    // Unique address per run: counters live in the dev server's memory for 15 minutes.
    const email = `rate-limit-${Date.now()}@example.test`
    const codes: Array<string | undefined> = []
    for (let i = 0; i < 10; i++) {
      const r = await attempt(page, email, `Wrong#Password${i}`)
      codes.push(r.ok ? 'OK' : r.code)
    }
    expect(codes.slice(0, 8)).toEqual(Array(8).fill('INVALID_CREDENTIALS'))
    expect(codes.slice(8)).toEqual(['TOO_MANY_ATTEMPTS', 'TOO_MANY_ATTEMPTS'])
  })

  test('a successful login still works after earlier failures', async ({ page }) => {
    await attempt(page, ACCOUNTS.admin.email, 'Wrong#Password1')
    const ok = await attempt(page, ACCOUNTS.admin.email, ACCOUNTS.admin.password)
    expect(ok.ok).toBe(true)
  })

  test('credential forms never fall back to GET (password must not reach the URL)', async ({ page }) => {
    await expect(page.locator('form')).toHaveAttribute('method', 'post')
  })
})
