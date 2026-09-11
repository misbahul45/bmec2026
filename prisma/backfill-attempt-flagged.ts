import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const url = process.env.DATABASE_URL!
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) })

const SCORE_THRESHOLD = 25

async function main() {
  const stale = await prisma.examAttempt.findMany({
    where: {
      cheatCount: { gt: 0 },
      flagged: false,
    },
    select: {
      id: true,
      teamId: true,
      cheatCount: true,
      suspiciousScore: true,
      flagged: true,
      finished: true,
      team: { select: { name: true, email: true } },
    },
  })

  console.log("📋 Attempt dengan cheatCount>0 tapi flagged=false:")
  console.log("   Threshold flagged baru: suspiciousScore ≥", SCORE_THRESHOLD)
  console.log("")
  console.log(`   Ditemukan ${stale.length} attempt`)
  console.log("")

  if (stale.length === 0) {
    console.log("✅ Tidak ada data perlu di-backfill.")
    return
  }

  let updated = 0
  let skipped = 0
  for (const a of stale) {
    const shouldFlag = (a.suspiciousScore ?? 0) >= SCORE_THRESHOLD
    if (!shouldFlag) {
      console.log(
        `   ⏭  ${a.team.name} | cheatCount=${a.cheatCount} score=${a.suspiciousScore} → skor < ${SCORE_THRESHOLD}, tetap Normal`,
      )
      skipped++
      continue
    }
    await prisma.examAttempt.update({
      where: { id: a.id },
      data: { flagged: true },
    })
    console.log(
      `   ✅ ${a.team.name} | cheatCount=${a.cheatCount} score=${a.suspiciousScore} → flagged: true`,
    )
    updated++
  }

  console.log("")
  console.log(`🎯 Backfill selesai: ${updated} di-flag, ${skipped} tetap Normal`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
