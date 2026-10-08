import { defineConfig, devices } from '@playwright/test'

// Tests run against a LOCAL dev server backed by a local throwaway database.
// Start it yourself first (see audit/README.md); this config never starts a server
// so it can never accidentally inherit a production DATABASE_URL from .env.
const baseURL = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:3100'

export default defineConfig({
  testDir: './tests/e2e',
  globalSetup: './tests/e2e/global-setup.ts',
  fullyParallel: false,
  workers: 1,
  retries: 1,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['json', { outputFile: 'audit/playwright-results.json' }]],
  outputDir: 'audit/screenshots',
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
