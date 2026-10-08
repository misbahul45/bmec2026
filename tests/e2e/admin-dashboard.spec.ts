import { expect, test } from '@playwright/test'
import { callServerFn, loadFixture, login } from './helpers'

const fx = loadFixture()

const ADMIN_ROUTES: Array<[string, string]> = [
  ['overview', '/dashboard/admin'],
  ['teams', '/dashboard/admin/teams'],
  ['team detail', `/dashboard/admin/teams/${fx.teamIds.approved}`],
  ['exams', '/dashboard/admin/exams'],
  ['exam detail', `/dashboard/admin/exams/${fx.tryoutExamId}`],
  ['exam reviews', `/dashboard/admin/exams/${fx.tryoutExamId}/reviews`],
  ['exam sessions', `/dashboard/admin/exams/${fx.finalExamId}/sessions`],
  ['submissions', '/dashboard/admin/submissions'],
  ['scoreboard', '/dashboard/admin/scoreboard'],
  ['competitions', '/dashboard/admin/competitions'],
]

const WIDTHS = [320, 375, 768, 1024, 1440, 1920]
const ZERO_UUID = '00000000-0000-4000-8000-000000000000'

test.describe('admin dashboard pages', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'admin')
  })

  for (const [name, path] of ADMIN_ROUTES) {
    test(`${name}: direct load is clean (200, one h1, no console/network errors)`, async ({ page }) => {
      const consoleIssues: string[] = []
      const badResponses: string[] = []
      page.on('console', (m) => {
        if (m.type() === 'error' || m.type() === 'warning') consoleIssues.push(m.text())
      })
      page.on('pageerror', (e) => consoleIssues.push(String(e)))
      page.on('response', (r) => {
        if (r.status() >= 400) badResponses.push(`${r.status()} ${r.url()}`)
      })

      const response = await page.goto(path)
      expect(response?.status()).toBe(200)
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
      await page.waitForLoadState('networkidle')

      expect(consoleIssues).toEqual([])
      expect(badResponses).toEqual([])
    })

    test(`${name}: no horizontal overflow at 320-1920px`, async ({ page }) => {
      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: 800 })
        await page.goto(path)
        await page.waitForLoadState('networkidle')
        const overflow = await page.evaluate(() => {
          const de = document.documentElement
          return de.scrollWidth - de.clientWidth
        })
        expect(overflow, `${name} @${width}px`).toBeLessThanOrEqual(1)
      }
    })
  }

  test('overview shows empty states instead of blank charts when there is no data', async ({ page }) => {
    await page.goto('/dashboard/admin')
    await expect(page.getByText('Belum ada data').first()).toBeVisible()
    await expect(page.getByText('Belum ada attempt ujian')).toBeVisible()
  })
})

test.describe('admin input validation (server side)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'admin')
  })

  test('pagination is bounded for attempts and submissions', async ({ page }) => {
    for (const [mod, fn, base] of [
      ['/src/server/attempt.ts', 'getExamAttempts', { examId: ZERO_UUID }],
      ['/src/server/submission.ts', 'getSubmissions', {}],
    ] as const) {
      for (const bad of [{ limit: 0 }, { page: -3 }, { page: 1.5 }, { limit: 1_000_000_000 }]) {
        const r = await callServerFn(page, mod, fn, { ...base, ...bad })
        expect(r.ok, `${fn} ${JSON.stringify(bad)}`).toBe(false)
      }
      const ok = await callServerFn(page, mod, fn, { ...base, page: 1, limit: 10 })
      expect(ok.ok, `${fn} valid`).toBe(true)
    }
  })

  test('submission score must be an integer', async ({ page }) => {
    const fractional = await callServerFn(page, '/src/server/submission.ts', 'updateSubmissionScore', {
      id: ZERO_UUID,
      score: 7.5,
    })
    expect(fractional.ok).toBe(false)
    expect((fractional as { message?: string }).message).toContain('bilangan bulat')

    const integer = await callServerFn(page, '/src/server/submission.ts', 'updateSubmissionScore', {
      id: ZERO_UUID,
      score: 7,
    })
    // Validation passes; the unknown id is reported as a typed AppError, not a Prisma 500.
    expect(integer).toMatchObject({ ok: false, code: 'SUBMISSION_NOT_FOUND', statusCode: 404 })
  })

  test('batch dates and price are validated', async ({ page }) => {
    const base = { competitionId: ZERO_UUID, name: 'x', module_bacth: 'm' }
    const cases = [
      { ...base, startDate: '2026-05-10', endDate: '2026-05-01', price: 100 },
      { ...base, startDate: 'garbage', endDate: '2026-05-01', price: 100 },
      { ...base, startDate: '2026-05-01', endDate: '2026-05-10', price: -5 },
    ]
    for (const input of cases) {
      const r = await callServerFn(page, '/src/server/competition.ts', 'createBatch', input)
      expect(r.ok, JSON.stringify(input)).toBe(false)
    }
  })

  test('typed errors keep code and field across the server-function boundary', async ({ page }) => {
    const now = Date.now()
    const r = await callServerFn(page, '/src/server/exam-session.ts', 'createExamSession', {
      examId: fx.finalExamId,
      name: `S-${now}`,
      startTime: new Date(now).toISOString(),
      endTime: new Date(now + 5 * 86_400_000).toISOString(),
    })
    // FormSessionDialog uses `field` to highlight the offending input.
    expect(r).toMatchObject({ ok: false, code: 'SESSION_END_AFTER_EXAM', statusCode: 400, field: 'endTime' })
  })
})

test.describe('admin authorization boundary', () => {
  test('unauthenticated visitors are redirected away from the admin dashboard', async ({ page }) => {
    await page.goto('/dashboard/admin')
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('a TEAM session cannot call admin server functions', async ({ page }) => {
    await login(page, 'approved')
    for (const [mod, fn, data] of [
      ['/src/server/submission.ts', 'getSubmissions', {}],
      ['/src/server/team.ts', 'getTeams', {}],
      ['/src/server/dashboard.ts', 'getDashboardSummary', undefined],
      ['/src/server/exam.ts', 'getExams', undefined],
    ] as const) {
      const r = await callServerFn(page, mod, fn, data)
      expect(r, `${fn} as TEAM`).toMatchObject({ ok: false, code: 'INVALID_ADMIN_SESSION' })
    }
  })
})
