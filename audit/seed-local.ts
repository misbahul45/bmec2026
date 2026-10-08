/**
 * Audit fixtures for a LOCAL throwaway database only.
 * Refuses to run unless DATABASE_URL points at localhost/127.0.0.1.
 *
 * Run: source <audit-env> && pnpm tsx audit/seed-local.ts
 */
import * as bcrypt from 'bcrypt'
import { prisma } from '../src/lib/utils/prisma'

const host = new URL(process.env.DATABASE_URL ?? 'postgresql://invalid').hostname
if (host !== '127.0.0.1' && host !== 'localhost') {
  console.error(`REFUSING to seed non-local database host: ${host}`)
  process.exit(1)
}

export const FIXTURE = {
  adminEmail: 'admin-audit@example.test',
  adminPassword: 'AuditAdmin#2026',
  teamPassword: 'TeamAudit#2026',
  teams: {
    approved: 'team-approved@example.test',
    pending: 'team-pending@example.test',
    infografis: 'team-infografis@example.test',
    unregistered: 'team-unregistered@example.test',
  },
}

const DAY = 24 * 60 * 60 * 1000

async function main() {
  await prisma.examEventLog.deleteMany()
  await prisma.examAnswer.deleteMany()
  await prisma.examAttempt.deleteMany()
  await prisma.examSessionTeam.deleteMany()
  await prisma.examSession.deleteMany()
  await prisma.examQuestion.deleteMany()
  await prisma.exam.deleteMany()
  await prisma.submission.deleteMany()
  await prisma.registration.deleteMany()
  await prisma.member.deleteMany()
  await prisma.mentor.deleteMany()
  await prisma.team.deleteMany()
  await prisma.batch.deleteMany()
  await prisma.stage.deleteMany()
  await prisma.competition.deleteMany()
  await prisma.admin.deleteMany()
  await prisma.file.deleteMany()

  const now = Date.now()

  await prisma.admin.create({
    data: {
      name: 'Audit Admin',
      email: FIXTURE.adminEmail,
      password: await bcrypt.hash(FIXTURE.adminPassword, 10),
    },
  })

  const olimpiade = await prisma.competition.create({ data: { name: 'OLIMPIADE' } })
  const infografis = await prisma.competition.create({ data: { name: 'INFOGRAFIS' } })
  await prisma.competition.create({ data: { name: 'LKTI' } })

  const [olmPenyisihan, , olmFinal] = await Promise.all([
    prisma.stage.create({ data: { name: 'PENYISIHAN', order: 1, competitionId: olimpiade.id } }),
    prisma.stage.create({ data: { name: 'SEMIFINAL', order: 2, competitionId: olimpiade.id } }),
    prisma.stage.create({ data: { name: 'FINAL', order: 3, competitionId: olimpiade.id } }),
  ])
  const ifsPenyisihan = await prisma.stage.create({
    data: { name: 'PENYISIHAN', order: 1, competitionId: infografis.id },
  })

  const activeBatch = await prisma.batch.create({
    data: {
      name: 'Batch 3',
      price: 150000,
      module_bacth: 'm3',
      competitionId: olimpiade.id,
      startDate: new Date(now - DAY),
      endDate: new Date(now + 30 * DAY),
    },
  })
  const oldCheapBatch = await prisma.batch.create({
    data: {
      name: 'Early Bird',
      price: 1,
      module_bacth: 'm1',
      competitionId: olimpiade.id,
      startDate: new Date(now - 90 * DAY),
      endDate: new Date(now - 60 * DAY),
    },
  })
  const ifsBatch = await prisma.batch.create({
    data: {
      name: 'Batch 1',
      price: 100000,
      module_bacth: 'm1',
      competitionId: infografis.id,
      startDate: new Date(now - DAY),
      endDate: new Date(now + 30 * DAY),
    },
  })

  const question = (order: number) => ({
    question: `<p>Soal ${order}</p>`,
    optionA: 'A',
    optionB: 'B',
    optionC: 'C',
    optionD: 'D',
    optionE: 'E',
    order,
    correctAnswer: 'A',
    correctScore: 4,
    wrongScore: -1,
    emptyScore: 0,
  })

  const tryout = await prisma.exam.create({
    data: {
      title: 'Tryout Penyisihan',
      type: 'TRYOUT',
      stageId: olmPenyisihan.id,
      duration: 30,
      startDate: new Date(now - DAY),
      endDate: new Date(now + DAY),
      questions: { create: [question(1), question(2), question(3)] },
    },
  })
  const finalExam = await prisma.exam.create({
    data: {
      title: 'Final Olimpiade',
      type: 'OLYMPIAD',
      stageId: olmFinal.id,
      duration: 60,
      startDate: new Date(now - DAY),
      endDate: new Date(now + DAY),
      questions: { create: [question(1), question(2)] },
    },
  })

  const teamHash = await bcrypt.hash(FIXTURE.teamPassword, 10)
  const mkTeam = (
    key: keyof typeof FIXTURE.teams,
    type: 'OLIMPIADE' | 'INFOGRAFIS',
    code: string,
    stageId: string | null,
  ) =>
    prisma.team.create({
      data: {
        name: `Team ${key}`,
        code,
        email: FIXTURE.teams[key],
        password: teamHash,
        phone: '081200000000',
        schoolName: 'SMA Audit',
        schoolAddress: 'Jl. Audit No. 1',
        competitionType: type,
        currentStageId: stageId,
        documentUrl: 'https://example.test/doc.pdf',
        twibbonUrl: 'https://example.test/twibbon.png',
      },
    })

  const approved = await mkTeam('approved', 'OLIMPIADE', 'olm-001', olmPenyisihan.id)
  const pending = await mkTeam('pending', 'OLIMPIADE', 'pending-1', olmPenyisihan.id)
  const ifs = await mkTeam('infografis', 'INFOGRAFIS', 'ifs-001', ifsPenyisihan.id)
  const unregistered = await mkTeam('unregistered', 'OLIMPIADE', 'pending-2', null)

  for (const [key, team] of Object.entries({ approved, pending, infografis: ifs, unregistered })) {
    await prisma.mentor.create({
      data: { teamId: team.id, name: `Mentor ${key}`, email: `mentor-${key}@example.test`, phone: '081211111111' },
    })
    await prisma.member.createMany({
      data: (['KETUA', 'ANGGOTA', 'ANGGOTA'] as const).map((role, i) => ({
        teamId: team.id,
        role,
        name: `Member ${key} ${i + 1}`,
        email: `member-${key}-${i + 1}@example.test`,
        phone: '081222222222',
      })),
    })
  }

  await prisma.registration.create({
    data: { teamId: approved.id, competitionId: olimpiade.id, batchId: activeBatch.id, status: 'APPROVED' },
  })
  await prisma.registration.create({
    data: { teamId: pending.id, competitionId: olimpiade.id, batchId: activeBatch.id, status: 'PENDING' },
  })
  await prisma.registration.create({
    data: { teamId: ifs.id, competitionId: infografis.id, batchId: ifsBatch.id, status: 'APPROVED' },
  })

  const out = {
    tryoutExamId: tryout.id,
    finalExamId: finalExam.id,
    oldCheapBatchId: oldCheapBatch.id,
    olimpiadeId: olimpiade.id,
    teamIds: {
      approved: approved.id,
      pending: pending.id,
      infografis: ifs.id,
      unregistered: unregistered.id,
    },
  }
  const { writeFileSync } = await import('node:fs')
  writeFileSync(new URL('./fixture.json', import.meta.url), JSON.stringify(out, null, 2))
  console.log('Fixtures written to audit/fixture.json')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
