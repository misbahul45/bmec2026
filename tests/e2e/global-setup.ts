import { execFileSync } from 'node:child_process'

// Re-seeds the LOCAL audit database before the suite so every run starts from
// the same state. audit/seed-local.ts refuses to run against a non-local host.
export default async function globalSetup() {
  execFileSync('pnpm', ['tsx', 'audit/seed-local.ts'], { stdio: 'inherit' })
}
